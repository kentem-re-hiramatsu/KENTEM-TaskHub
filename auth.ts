import type { NextAuthOptions } from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
import { linkMemberByGithubLogin } from '@/features/settings/permissions/model/permission-store';

const REQUIRED_ORG_LOGIN = 'ks-kentem';
const REQUIRED_ORG_KEYWORD = 'kentem';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET ?? 'dev-only-secret-change-me',
  trustHost: true,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
      authorization: {
        params: {
          scope: 'read:user read:org read:project',
        },
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ account }) {
      if (account?.provider !== 'github' || !account.access_token) return false;

      const headers = {
        Authorization: `Bearer ${account.access_token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      };

      const userResponse = await fetch('https://api.github.com/user', {
        headers,
        cache: 'no-store',
      });
      const user = (await userResponse.json().catch(() => null)) as
        | { id?: number; login?: string; name?: string }
        | null;

      if (user?.login && typeof user.id === 'number') {
        linkMemberByGithubLogin({
          login: user.login,
          githubUserId: user.id,
          memberName: user.name ?? user.login,
          displayName: user.name,
        });
      }

      const membershipResponse = await fetch(
        `https://api.github.com/user/memberships/orgs/${REQUIRED_ORG_LOGIN}`,
        {
          headers,
          cache: 'no-store',
        },
      );

      if (membershipResponse.ok) {
        const membership = (await membershipResponse.json()) as {
          state?: string;
        };
        if (membership.state === 'active') {
          return true;
        }
      }

      const orgsResponse = await fetch('https://api.github.com/user/orgs', {
        headers: {
          ...headers,
        },
        cache: 'no-store',
      });
      if (!orgsResponse.ok) return '/login?error=OrgCheckFailed';

      const orgs = (await orgsResponse.json()) as Array<{ login?: string }>;
      const isKentemMember = orgs.some(
        (org) => org.login?.toLowerCase().includes(REQUIRED_ORG_KEYWORD),
      );
      const isKentemUserLogin = Boolean(
        user?.login?.toLowerCase().includes(REQUIRED_ORG_KEYWORD),
      );
      if (isKentemMember || isKentemUserLogin) return true;

      const login = user?.login ? encodeURIComponent(user.login) : 'unknown';
      return `/login?error=AccessDenied&gh_login=${login}`;
    },
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
};
