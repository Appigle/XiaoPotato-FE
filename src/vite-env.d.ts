/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_X_POTATO_BASE_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
