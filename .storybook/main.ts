import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/nextjs-vite';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: [
    '../components/**/*.stories.{ts,tsx}',
    '../features/**/*.stories.{ts,tsx}',
    {
      directory: '../ks-react-components/src/stories',
      files: '**/*.stories.@(ts|tsx)',
      titlePrefix: 'ks-react-components',
    },
  ],
  addons: ['@storybook/addon-vitest', '@storybook/addon-docs'],
  framework: '@storybook/nextjs-vite',
  viteFinal(config) {
    // ESM 環境ではグローバルの __dirname が存在しないため、import.meta.url から算出したパスをローカル変数に格納する
    const projectDir = path.dirname(fileURLToPath(import.meta.url));

    return mergeConfig(config, {
      resolve: {
        alias: {
          '@': path.resolve(projectDir, '..'),
          'styled-system': path.resolve(projectDir, '../styled-system'),
          // ks-react-components のストーリーが v8 時代の @storybook/addon-actions を参照しているため、v10 の storybook/actions へ転送する
          '@storybook/addon-actions': 'storybook/actions',
        },
      },
      esbuild: { target: 'esnext' },
      // Vite の define に __dirname を注入すると、CJS 由来のコードが参照しても動作しやすくなる
      define: {
        __dirname: JSON.stringify(projectDir),
      },
    });
  },
  staticDirs: ['..\\public', '..\\ks-react-components\\public'],
  features: {
    experimentalRSC: true,
  },
};
export default config;
