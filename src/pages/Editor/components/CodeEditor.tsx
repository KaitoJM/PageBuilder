import { useEffect, useRef } from "react";
// Import only the base editor API + HTML language support, not the
// `monaco-editor` package root - that pulls in editor.main.js, which
// registers every bundled language (PHP, SQL, Ruby, Solidity, ...) and
// blew the main chunk up by ~4MB for a feature that only edits HTML.
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import "monaco-editor/esm/vs/basic-languages/html/html.contribution";
import "monaco-editor/esm/vs/language/html/monaco.contribution";
import "@/lib/monacoEnvironment";

export interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  height?: string;
  className?: string;
}

export default function CodeEditor({
  value,
  onChange,
  language = "html",
  height = "300px",
  className,
}: CodeEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!containerRef.current) return;

    const instance = monaco.editor.create(containerRef.current, {
      value,
      language,
      theme: "vs-dark",
      automaticLayout: true,
      minimap: { enabled: false },
    });
    editorRef.current = instance;

    const subscription = instance.onDidChangeModelContent(() => {
      onChangeRef.current?.(instance.getValue());
    });

    return () => {
      subscription.dispose();
      instance.dispose();
      editorRef.current = null;
    };
    // Mount once - value/language changes after initial mount are handled
    // by the effects below rather than recreating the editor instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const instance = editorRef.current;
    if (instance && instance.getValue() !== value) {
      instance.setValue(value);
    }
  }, [value]);

  useEffect(() => {
    const instance = editorRef.current;
    const model = instance?.getModel();
    if (model) monaco.editor.setModelLanguage(model, language);
  }, [language]);

  return <div ref={containerRef} className={className} style={{ height }} />;
}
