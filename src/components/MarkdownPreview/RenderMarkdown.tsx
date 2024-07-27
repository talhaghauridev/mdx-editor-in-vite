import React, { memo, useCallback, useMemo } from "react";

// Define possible marks
interface Mark {
  type: "bold" | "italic" | "underline" | "link" | "code";
  attrs?: {
    href?: string;
    target?: string;
  };
}

// Define possible content nodes
interface ContentNode {
  type:
    | "heading"
    | "paragraph"
    | "text"
    | "orderedList"
    | "listItem"
    | "thematicBreak"
    | "codeBlock"
    | "checkList"
    | "bulletList"
    | "image";
  text?: string;
  marks?: Mark[];
  content?: ContentNode[];
  attrs?: {
    [key: string]: any;
  };
}

// Define component props for each node type
interface NodeProps {
  node: ContentNode;
  renderContent: (content: ContentNode[]) => React.ReactNode;
  styles: { [key: string]: React.CSSProperties };
}

// Define the component types mapping
interface Components {
  [key: string]: React.ComponentType<NodeProps>;
}

// Define the props for RenderContent component
interface Props {
  content: ContentNode[];
  components?: Components;
  styles?: { [key: string]: React.CSSProperties };
}

// Default styles
const defaultStyles: { [key: string]: React.CSSProperties } = {
  codeStyle: {
    background: "#f0f0f3",
    padding: "4px",
    borderRadius: "4px",
    fontFamily: "monospace",
  },
  codeBlockStyle: {
    background: "#2d2d2d",
    color: "#f8f8f2",
    padding: "16px",
    margin: "16px 0",
  },
  checkBoxStyle: {
    marginRight: "8px",
  },
  listItemStyle: {
    margin: "8px 0",
  },
};

// Utility function to remove backslashes
const removeBackslashes = (text: string) => text.replace(/\\+/g, "");

const RenderMarkdown: React.FC<Props> = memo(
  ({ content, components = {}, styles = {} }) => {
    const combinedStyles = useMemo(
      () => ({ ...defaultStyles, ...styles }),
      [styles]
    );

    const renderNode = useCallback(
      (node: ContentNode, key: number): React.ReactNode => {
        const { type, attrs, content: nodeContent } = node;
        const Component = components[type] || null;

        if (Component) {
          return (
            <Component
              key={key}
              node={node}
              renderContent={renderContent}
              styles={combinedStyles}
            />
          );
        }

        switch (type) {
          case "heading":
            return React.createElement(
              `h${attrs?.level || 1}`,
              { key },
              renderContent(nodeContent)
            );
          case "paragraph":
            return <p key={key}>{renderContent(nodeContent)}</p>;
          case "text":
            return renderTextNode(node, key);
          case "orderedList":
            return <ol key={key}>{renderContent(nodeContent)}</ol>;
          case "listItem":
            return (
              <li key={key} style={combinedStyles.listItemStyle}>
                {renderContent(nodeContent)}
              </li>
            );
          case "thematicBreak":
            return <hr key={key} />;
          case "codeBlock":
            return renderCodeBlockNode(node, key);
          case "checkList":
            return renderCheckListNode(node, key);
          case "bulletList":
            return renderBulletListNode(node, key);
          case "image":
            return renderImageNode(node, key);
          default:
            return null;
        }
      },
      [components, combinedStyles]
    );

    const renderTextNode = useCallback(
      (node: ContentNode, key: number): React.ReactNode => {
        const { text, marks } = node;
        let textElement: React.ReactNode = (
          <span key={key}>{removeBackslashes(text || "")}</span>
        );

        if (marks) {
          textElement = marks.reduce<React.ReactNode>((acc, mark) => {
            switch (mark.type) {
              case "bold":
                return <strong key={key}>{acc}</strong>;
              case "italic":
                return <em key={key}>{acc}</em>;
              case "underline":
                return <u key={key}>{acc}</u>;
              case "link":
                return (
                  <a
                    href={mark.attrs?.href}
                    target={mark.attrs?.target || "_self"}
                    key={key}
                  >
                    {acc}
                  </a>
                );
              case "code":
                return (
                  <code style={combinedStyles.codeStyle} key={key}>
                    {acc}
                  </code>
                );
              default:
                return acc;
            }
          }, textElement);
        }

        return textElement;
      },
      [combinedStyles]
    );

    const renderCodeBlockNode = useCallback(
      (node: ContentNode, key: number): React.ReactNode => {
        const { content, attrs } = node;
        const language = attrs?.language || "text";
        const codeContent = content?.[0]?.text || "";

        return (
          <pre key={key || language} style={combinedStyles.codeBlockStyle}>
            <code>{removeBackslashes(codeContent)}</code>
          </pre>
        );
      },
      [combinedStyles]
    );

    const renderContent = useCallback(
      (content: ContentNode[] = []): React.ReactNode => {
        return content.map((node, index) => renderNode(node, index));
      },
      [renderNode]
    );

    const renderCheckListNode = useCallback(
      (node: ContentNode, key: number): React.ReactNode => {
        const { content } = node;

        return (
          <ul key={key}>
            {content?.map((item, index) => (
              <li key={index} style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={item.attrs?.checked || false}
                  readOnly
                  style={combinedStyles.checkBoxStyle}
                />
                {renderContent(item.content)}
              </li>
            ))}
          </ul>
        );
      },
      [combinedStyles, renderContent]
    );

    const renderBulletListNode = useCallback(
      (node: ContentNode, key: number): React.ReactNode => {
        const { content } = node;

        return (
          <ul key={key}>
            {content?.map((item, index) => (
              <li key={index} style={combinedStyles.listItemStyle}>
                {renderContent(item.content)}
              </li>
            ))}
          </ul>
        );
      },
      [combinedStyles, renderContent]
    );

    const renderImageNode = useCallback(
      (node: ContentNode, key: number): React.ReactNode => {
        const { src, alt } = node.attrs || {};
        return (
          <img
            src={src}
            alt={alt || ""}
            style={{ maxWidth: "100%", height: "300px", objectFit: "fill" }}
            key={key}
          />
        );
      },
      []
    );

    const memoizedContent = useMemo(
      () => renderContent(content),
      [content, renderContent]
    );

    return <>{memoizedContent}</>;
  }
);

export default RenderMarkdown;
