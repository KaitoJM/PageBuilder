// Side-effect module: wires up Monaco's web workers for Vite. Raw
// monaco-editor (not the @monaco-editor/react wrapper) needs this manual
// setup since Vite doesn't bundle workers automatically like webpack's
// monaco-editor-webpack-plugin does. Import this once before creating any
// editor instance.
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import HtmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import CssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";

self.MonacoEnvironment = {
  getWorker(_workerId: string, label: string) {
    if (label === "html") return new HtmlWorker();
    if (label === "css") return new CssWorker();
    return new EditorWorker();
  },
};
