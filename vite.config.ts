import react from '@vitejs/plugin-react';
import path from 'path';
import { AliasOptions, defineConfig } from 'vite';
import ClosePlugin from './vite-plugin-close.ts';

const directories = [
  './src',
  './src/assets',
  './src/components',
  './src/views',
  './src/types',
  './src/constants',
];

const alias: AliasOptions = directories.reduce<Record<string, string>>(
  (acc, dir) => {
    const key = `@${path.basename(dir)}`;
    acc[key] = path.resolve(__dirname, dir);
    return acc;
  },
  {} as Record<string, string>,
);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ClosePlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      ...alias,
    },
  },
  base: './',
  envDir: './.env',
});
