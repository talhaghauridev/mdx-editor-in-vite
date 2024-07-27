import { FC, memo, useState } from "react";
import { parseMarkdownToJson } from "../RenderContent";
import RenderMarkdown from "./RenderMarkdown";
import AndroidPreview from "../MobileProview";

type MarkdownPreviewProps = {
  markdownContent: string;
};

type PreviewType = "Mobile" | "Web";
const MarkdownPreview: FC<MarkdownPreviewProps> = ({ markdownContent }) => {
  const [preview, serPreview] = useState<PreviewType>("Web");
  return (
    <section id="markdown-preview">
      <div className="preview">
        Privew
        <button
          onClick={() => serPreview(preview === "Mobile" ? "Web" : "Mobile")}
        >
          Preview {preview}
        </button>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {preview === "Mobile" ? (
          <AndroidPreview>
            <div className="markdown-p">
              <RenderMarkdown
                content={parseMarkdownToJson(markdownContent) as any}
              />
            </div>
          </AndroidPreview>
        ) : (
          <div className="markdown-p">
            <RenderMarkdown
              content={parseMarkdownToJson(markdownContent) as any}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default memo(MarkdownPreview);
