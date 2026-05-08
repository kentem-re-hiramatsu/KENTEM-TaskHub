import fs from 'node:fs';

const features = fs
  .readdirSync('features')
  .map((it) => ({ name: it, value: it }));

const REGEX_FIRST_UPPER = /^[A-Z][a-zA-Z0-9]*$/;
const REGEX_FIRST_LOWER = /^[a-z][a-zA-Z0-9]*$/;

export default function (
  /** @type {import('plop').NodePlopAPI} */
  plop,
) {
  plop.setHelper('eq', (a, b) => {
    return a === b;
  });
  plop.setGenerator('component', {
    description: 'Component Generator',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'コンポーネント名を入力してください',
        validate: (value) => {
          return REGEX_FIRST_UPPER.test(value)
            ? true
            : 'コンポーネント名は先頭大文字で入力してください';
        },
      },
      {
        type: 'list',
        name: 'kind',
        message: '分類を選択してください',
        choices: ['components', 'features'],
      },
      {
        type: 'list',
        name: 'feature',
        message: '機能名を選択してください',
        choices: ['新規作成', ...features],
        when: ({ kind }) => kind === 'features' && features.length > 0,
      },
      {
        type: 'input',
        name: 'newFeature',
        message: '機能名を入力してください',
        when: ({ kind, feature }) =>
          kind === 'features' && (!feature || feature === '新規作成'),
        validate: (value) => {
          return REGEX_FIRST_LOWER.test(value)
            ? true
            : '機能名は先頭小文字で入力してください';
        },
      },
    ],
    actions: (answers) => {
      let componentPath = 'components';
      if (answers.kind && answers.kind === 'features') {
        const featureName = answers.newFeature
          ? '{{kebabCase newFeature}}'
          : '{{feature}}';
        componentPath = `features/${featureName}/components`;
      }

      const componentFilePath = `${componentPath}/${answers.kind === 'components' ? '{{kebabCase name}}/' : ''}{{kebabCase name}}.tsx`;

      /** @type {import('plop').ActionType[]} */
      const actionTypes = [
        {
          type: 'add',
          path: componentFilePath,
          templateFile: 'generators/component.tsx.hbs',
        },
        {
          type: 'add',
          path: `${componentPath}/${answers.kind === 'components' ? '{{kebabCase name}}/' : ''}{{kebabCase name}}.stories.tsx`,
          templateFile: 'generators/component.stories.tsx.hbs',
        },
      ];

      return actionTypes;
    },
  });
}
