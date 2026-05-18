import { type NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

interface RequestBody {
  projectUrl?: string;
  projectNumber?: string;
}

type ScopeType = 'org' | 'user';
type FieldNode = { name?: string };
type IssueContent = {
  // biome-ignore lint/style/useNamingConvention: GraphQL response field
  __typename?: string;
  id: string;
  number: number;
  title: string;
  url: string;
  state: string;
};
type FieldValueNode = {
  text?: string;
  number?: number;
  name?: string;
  title?: string;
  date?: string;
  users?: { nodes: Array<{ login: string }> };
  field?: { name?: string };
};
type ItemNode = {
  fieldValues: { nodes: FieldValueNode[] };
  content?: IssueContent;
};

const resolveScopeFromUrl = (
  projectUrl: string,
): { scopeType: ScopeType; login: string; number: number } | null => {
  try {
    const url = new URL(projectUrl);
    const parts = url.pathname.split('/').filter(Boolean);

    if (parts.length < 4) return null;

    if (parts[0] === 'orgs' && parts[2] === 'projects') {
      const number = Number(parts[3]);
      if (!parts[1] || Number.isNaN(number)) return null;
      return { scopeType: 'org', login: parts[1], number };
    }

    if (parts[0] === 'users' && parts[2] === 'projects') {
      const number = Number(parts[3]);
      if (!parts[1] || Number.isNaN(number)) return null;
      return { scopeType: 'user', login: parts[1], number };
    }

    return null;
  } catch {
    return null;
  }
};

const ITEMS_FRAGMENT = `
  items(first: 50) {
    nodes {
      fieldValues(first: 20) {
        nodes {
          ... on ProjectV2ItemFieldTextValue {
            text
            field { ... on ProjectV2Field { name } }
          }
          ... on ProjectV2ItemFieldNumberValue {
            number
            field { ... on ProjectV2Field { name } }
          }
          ... on ProjectV2ItemFieldSingleSelectValue {
            name
            field { ... on ProjectV2SingleSelectField { name } }
          }
          ... on ProjectV2ItemFieldIterationValue {
            title
            field { ... on ProjectV2IterationField { name } }
          }
          ... on ProjectV2ItemFieldUserValue {
            users(first: 5) { nodes { login } }
            field { ... on ProjectV2Field { name } }
          }
          ... on ProjectV2ItemFieldDateValue {
            date
            field { ... on ProjectV2Field { name } }
          }
        }
      }
      content {
        __typename
        ... on Issue {
          id
          number
          title
          url
          state
        }
      }
    }
  }
`;

const QUERY_USER = `
query($login: String!, $number: Int!) {
  user(login: $login) {
    projectV2(number: $number) {
      id
      title
      url
      fields(first: 20) {
        nodes {
          ... on ProjectV2Field { name }
          ... on ProjectV2IterationField { name }
          ... on ProjectV2SingleSelectField { name }
        }
      }
      ${ITEMS_FRAGMENT}
    }
  }
}`;

const QUERY_ORG = `
query($login: String!, $number: Int!) {
  organization(login: $login) {
    projectV2(number: $number) {
      id
      title
      url
      fields(first: 20) {
        nodes {
          ... on ProjectV2Field { name }
          ... on ProjectV2IterationField { name }
          ... on ProjectV2SingleSelectField { name }
        }
      }
      ${ITEMS_FRAGMENT}
    }
  }
}`;

const extractFieldValue = (node: FieldValueNode): { fieldName: string; value: string } | null => {
  const fieldName = node.field?.name;
  if (!fieldName) return null;
  if (typeof node.text === 'string') return { fieldName, value: node.text };
  if (typeof node.number === 'number') return { fieldName, value: String(node.number) };
  if (typeof node.title === 'string') return { fieldName, value: node.title };
  if (typeof node.date === 'string') return { fieldName, value: node.date };
  if (node.users !== undefined) return { fieldName, value: node.users.nodes.map((u) => u.login).join(', ') };
  if (typeof node.name === 'string') return { fieldName, value: node.name };
  return null;
};

export async function POST(request: NextRequest) {
  const authToken = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const token = authToken?.accessToken as string | undefined;

  if (!token) {
    return NextResponse.json(
      { error: 'ログインセッションが無効です。再ログインしてください。' },
      { status: 401 },
    );
  }

  let body: RequestBody;
  try {
    body = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json(
      { error: 'リクエスト形式が不正です。' },
      { status: 400 },
    );
  }

  if (!body.projectUrl) {
    return NextResponse.json(
      { error: 'Project URL は必須です。' },
      { status: 400 },
    );
  }

  const resolved = resolveScopeFromUrl(body.projectUrl);
  if (!resolved) {
    return NextResponse.json(
      { error: 'Project URL の形式が不正です。' },
      { status: 400 },
    );
  }

  const number = body.projectNumber
    ? Number(body.projectNumber)
    : resolved.number;
  if (Number.isNaN(number)) {
    return NextResponse.json(
      { error: 'Project 番号が不正です。' },
      { status: 400 },
    );
  }

  const query = resolved.scopeType === 'org' ? QUERY_ORG : QUERY_USER;
  const variables = { login: resolved.login, number };

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: new Headers({
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    }),
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  type ProjectV2 = {
    id: string;
    title: string;
    url: string;
    fields: { nodes: FieldNode[] };
    items: { nodes: ItemNode[] };
  };
  const data = (await response.json()) as {
    data?: {
      user?: { projectV2?: ProjectV2 };
      organization?: { projectV2?: ProjectV2 };
    };
    errors?: Array<{ message: string }>;
  };

  if (!response.ok || data.errors?.length) {
    const message =
      data.errors?.[0]?.message || 'GitHub API 呼び出しに失敗しました。';
    if (message.includes('INSUFFICIENT_SCOPES')) {
      return NextResponse.json(
        {
          error:
            'GitHub Projects の参照権限が不足しています。read:project 権限で再度ログインしてください。',
          code: 'INSUFFICIENT_SCOPES',
        },
        { status: 403 },
      );
    }
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const project =
    resolved.scopeType === 'org'
      ? data.data?.organization?.projectV2
      : data.data?.user?.projectV2;
  if (!project) {
    return NextResponse.json(
      { error: '対象プロジェクトが見つかりません。' },
      { status: 404 },
    );
  }

  const issues = project.items.nodes
    .filter((node): node is ItemNode & { content: IssueContent } =>
      Boolean(node.content && node.content.__typename === 'Issue'),
    )
    .map((node) => {
      const fieldValues: Record<string, string> = {};
      for (const fvNode of node.fieldValues.nodes) {
        const extracted = extractFieldValue(fvNode);
        if (extracted) fieldValues[extracted.fieldName] = extracted.value;
      }
      const { content } = node;
      return {
        id: content.id,
        number: content.number,
        title: content.title,
        url: content.url,
        state: content.state,
        fieldValues,
      };
    });

  const fields = project.fields.nodes
    .map((node) => node.name)
    .filter((name): name is string => Boolean(name));

  return NextResponse.json({
    project: {
      id: project.id,
      title: project.title,
      url: project.url,
    },
    fields,
    issues,
  });
}
