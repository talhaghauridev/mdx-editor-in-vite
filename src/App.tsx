import { useState } from "react";
import Editor from "./compoents/Editor";
import { markdown, parseMarkdownToJson } from "./compoents/RenderContent";
import RenderMarkdown from "./compoents/RenderMarkdown";
// import MarkdownRenderer, { markdownContent } from "./compoents/RenderContent";

// `;
const App = () => {
  // const content = parseMarkdown(markdownContent);
  // console.log({ content });
  const [markdownContent, setMarkdownContent] = useState(markdown);
  return (
    <main
      style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}
    >
      <Editor setMarkdownContent={setMarkdownContent} />
      {/* {JSON.stringify(parseMarkdownToJson(markdown), null, 12)} */}
      <div>
        <RenderMarkdown content={parseMarkdownToJson(markdownContent) as any} />
      </div>
    </main>
  );
};

export default App;
