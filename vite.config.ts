import react from '@vitejs/plugin-react';
import path from 'path';
import { AliasOptions, defineConfig } from 'vite';

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
  plugins: [react()],
  resolve: {
    alias,
  },
  base: './',
  envDir: './.env',
});
