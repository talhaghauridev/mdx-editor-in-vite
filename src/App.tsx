import { useState } from "react";
import Editor from "./components/Editor";
import MarkdownPreview from "./components/MarkdownPreview/MarkdownPreview";

const App = () => {
  const [markdownContent, setMarkdownContent] = useState("");
  return (
    <>
      <main
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        <Editor setMarkdownContent={setMarkdownContent} />
        <div>
          <MarkdownPreview markdownContent={markdownContent} />
        </div>
      </main>
      <div
        className="App"
        style={{ display: "flex", justifyContent: "center", padding: "50px" }}
      ></div>
    </>
  );
};

export default App;
