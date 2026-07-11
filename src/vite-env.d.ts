/// <reference types="vite/client" />

declare module "@grapesjs/studio-sdk/style";

// monaco-editor's package.json "exports" map doesn't declare a "types"
// condition for its "./*" wildcard, so TS can't resolve the sibling .d.ts
// files for these deep imports (used in CodeEditor.tsx to avoid pulling in
// every bundled language via the package root). editor.api's surface is a
// subset of the main package's, so re-exporting from "monaco-editor" is a
// safe over-approximation; the two .contribution imports are side-effect
// only, so no exports are needed.
declare module "monaco-editor/esm/vs/editor/editor.api" {
  export * from "monaco-editor";
}
declare module "monaco-editor/esm/vs/basic-languages/html/html.contribution";
declare module "monaco-editor/esm/vs/language/html/monaco.contribution";
declare module "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
declare module "monaco-editor/esm/vs/basic-languages/css/css.contribution";

interface Window {
  MonacoEnvironment?: {
    getWorker: (workerId: string, label: string) => Worker;
  };
}

interface ImportMetaEnv {
  readonly VITE_UTD_STATIC_BEARER_TOKEN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
