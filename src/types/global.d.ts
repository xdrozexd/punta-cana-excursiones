// Global type declarations
declare global {
  // Vite environment variables
  interface ImportMetaEnv {
    readonly VITE_API_URL: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};
