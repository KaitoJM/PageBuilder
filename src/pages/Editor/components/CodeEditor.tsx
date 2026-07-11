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
// Full CSS language service (on top of the monarch tokenizer above) - needed
// for document formatting (see formatOnLoad), not just for standalone CSS
// documents.
import "monaco-editor/esm/vs/language/css/monaco.contribution";
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
  readOnly?: boolean;
  minimap?: boolean;
  // Runs the document formatter whenever this doc's content is set, for
  // values that arrive pre-minified (e.g. component.toHTML()/getCss()
  // output) rather than typed by a user.
  formatOnLoad?: boolean;
}

// editor.action.formatDocument's precondition requires the editor to be
// writable, so a readOnly editor would otherwise silently refuse to run it -
// flip readOnly off just long enough for the command's initial (synchronous)
// support check to pass; the edits it applies aren't gated by readOnly since
// they go through the model directly, not the user-input path readOnly blocks.
function formatReadOnlySafe(
  instance: monaco.editor.IStandaloneCodeEditor,
  readOnly: boolean,
) {
  if (readOnly) instance.updateOptions({ readOnly: false });
  instance
    .getAction("editor.action.formatDocument")
    ?.run()
    .finally(() => {
      if (readOnly) instance.updateOptions({ readOnly: true });
    });
}

const CodeEditor = forwardRef<CodeEditorHandle, CodeEditorProps>(
  function CodeEditor(
    {
      docKey,
      value,
      onChange,
      language = "html",
      height = "300px",
      className,
      readOnly = false,
      minimap = true,
      formatOnLoad = false,
    },
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
        minimap: { enabled: minimap },
        readOnly,
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
      if (formatOnLoad) {
        formatReadOnlySafe(instance, readOnly);
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
      const instance = editorRef.current;
      const model = modelsRef.current.get(docKey);
      if (model && model.getValue() !== value) {
        model.setValue(value);
        if (formatOnLoad && instance?.getModel() === model) {
          formatReadOnlySafe(instance, readOnly);
        }
      }
    }, [docKey, value, formatOnLoad]);

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
