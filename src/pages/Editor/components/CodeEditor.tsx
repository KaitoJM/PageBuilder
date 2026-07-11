import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
// Import only the base editor API + HTML language support, not the
// `monaco-editor` package root - that pulls in editor.main.js, which
// registers every bundled language (PHP, SQL, Ruby, Solidity, ...) and
// blew the main chunk up by ~4MB for a feature that only edits HTML.
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import "monaco-editor/esm/vs/basic-languages/html/html.contribution";
import "monaco-editor/esm/vs/language/html/monaco.contribution";
// The HTML monarch grammar embeds <script>/<style> content via
// nextEmbedded: "text/javascript" / "text/css", which only resolves to real
// tokenization if a language with that mimetype is registered. These are the
// lightweight basic-languages tokenizers (no language service/IntelliSense),
// just enough to colorize the embedded JS/CSS.
import "monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution";
import "monaco-editor/esm/vs/basic-languages/css/css.contribution";
import "@/lib/monacoEnvironment";

export interface CodeEditorHandle {
  undo: () => void;
  redo: () => void;
}

export interface CodeEditorProps {
  // Identifies which document is being shown. One editor widget is mounted
  // for the component's lifetime; switching docKey swaps in a per-key
  // model (created on first use, then reused) instead of recreating the
  // editor - each doc keeps its own undo/redo history and scroll position
  // independently, rather than losing them every time you switch away.
  docKey: string;
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  height?: string;
  className?: string;
}

const CodeEditor = forwardRef<CodeEditorHandle, CodeEditorProps>(
  function CodeEditor(
    { docKey, value, onChange, language = "html", height = "300px", className },
    ref,
  ) {
    const containerRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
    const modelsRef = useRef<Map<string, monaco.editor.ITextModel>>(new Map());
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;

    // Mount the editor widget once. onDidChangeModelContent fires for
    // whichever model is currently attached, so one subscription here
    // (reading the latest onChange via the ref) covers every doc.
    useEffect(() => {
      if (!containerRef.current) return;

      const instance = monaco.editor.create(containerRef.current, {
        theme: "vs-dark",
        automaticLayout: true,
        minimap: { enabled: true },
      });
      editorRef.current = instance;

      const subscription = instance.onDidChangeModelContent(() => {
        onChangeRef.current?.(instance.getValue());
      });

      const models = modelsRef.current;
      return () => {
        subscription.dispose();
        instance.dispose();
        models.forEach((model) => model.dispose());
        models.clear();
        editorRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Get-or-create the model for docKey and attach it if it isn't already
    // the active one. A newly created model is seeded from `value`; an
    // existing one already owns its own (possibly since-edited) content.
    useEffect(() => {
      const instance = editorRef.current;
      if (!instance) return;

      let model = modelsRef.current.get(docKey);
      if (!model) {
        model = monaco.editor.createModel(value, language);
        modelsRef.current.set(docKey, model);
      }

      if (instance.getModel() !== model) {
        instance.setModel(model);
      }
      // Only run when switching docs - value changes for the already-active
      // doc are handled by the effect below, not by recreating the model.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [docKey]);

    // Keep the target doc's model in sync if `value` changes externally
    // (e.g. fresh data loaded for the same docKey). Guarded so the model's
    // own edits - which flow out via onChange and back in as this same
    // prop - don't get echoed back into it.
    useEffect(() => {
      const model = modelsRef.current.get(docKey);
      if (model && model.getValue() !== value) {
        model.setValue(value);
      }
    }, [docKey, value]);

    useEffect(() => {
      const model = modelsRef.current.get(docKey);
      if (model) monaco.editor.setModelLanguage(model, language);
    }, [docKey, language]);

    useImperativeHandle(ref, () => ({
      undo: () => editorRef.current?.trigger("toolbar", "undo", null),
      redo: () => editorRef.current?.trigger("toolbar", "redo", null),
    }));

    return <div ref={containerRef} className={className} style={{ height }} />;
  },
);

export default CodeEditor;
