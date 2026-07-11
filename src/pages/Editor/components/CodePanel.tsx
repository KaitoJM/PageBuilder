import CodeEditor from "./CodeEditor";
import { useEditorCodeStore } from "../stores/editorCodeStore";

export default function CodePanel() {
  const html = useEditorCodeStore((state) => state.html);
  const css = useEditorCodeStore((state) => state.css);

  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <h4>HTML</h4>
        <CodeEditor
          docKey="html-code"
          value={html}
          language="html"
          height="100%"
          readOnly
          minimap={false}
          formatOnLoad
          className="overflow-hidden rounded-md border flex-1"
        />
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-2">
        <h4>CSS</h4>
        <CodeEditor
          docKey="css-code"
          value={css}
          language="css"
          height="100%"
          readOnly
          minimap={false}
          formatOnLoad
          className="overflow-hidden rounded-md border flex-1"
        />
      </div>
    </div>
  );
}
