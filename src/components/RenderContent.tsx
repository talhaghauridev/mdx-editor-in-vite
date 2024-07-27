import React from "react";

const MarkdownRenderer: React.FC<{ markdown: string }> = ({ markdown }) => {
  const content = parseMarkdownToJson(markdown);
  console.log(content);

  return <div>{renderContent(content)}</div>;
};

export default MarkdownRenderer;

type Mark = { type: string; attrs?: Record<string, any> };

interface BaseNode {
  type: string;
}

interface TextWithMarks extends BaseNode {
  type: "text";
  text: string;
  marks?: Mark[];
}

interface Content extends BaseNode {
  content: Content[] | TextWithMarks[];
  attrs?: Record<string, any>;
}

type MarkdownNode = Content | TextWithMarks;
function renderTextWithMarks(textNode: TextWithMarks): React.ReactNode {
  let textElement: React.ReactNode = textNode.text;

  if (textNode.marks) {
    textNode.marks.forEach((mark, index) => {
      switch (mark.type) {
        case "italic":
          textElement = <em key={index}>{textElement}</em>;
          break;
        case "bold":
          textElement = <strong key={index}>{textElement}</strong>;
          break;
        case "link":
          textElement = (
            <a
              key={index}
              href={mark.attrs?.href}
              target={mark.attrs?.target}
              rel={mark.attrs?.rel}
              className={mark.attrs?.class || undefined}
            >
              {textElement}
            </a>
          );
          break;
        case "code":
          textElement = <code key={index}>{textElement}</code>;
          break;
        default:
          break;
      }
    });
  }

  return textElement;
}

function renderContent(content: MarkdownNode[]): React.ReactNode {
  return content.map((node, index) => {
    switch (node.type) {
      case "heading":
        const level = (node as Content).attrs?.level || 2;
        return React.createElement(
          `h${level}`,
          { key: index },
          renderContent((node as Content).content as MarkdownNode[])
        );
      case "paragraph":
        return (
          <p key={index}>
            {renderContent((node as Content).content as MarkdownNode[])}
          </p>
        );
      case "bulletList":
        return (
          <ul key={index}>
            {renderContent((node as Content).content as MarkdownNode[])}
          </ul>
        );
      case "listItem":
        return (
          <li key={index}>
            {renderContent((node as Content).content as MarkdownNode[])}
          </li>
        );
      case "blockquote":
        return (
          <blockquote key={index}>
            {renderContent((node as Content).content as MarkdownNode[])}
          </blockquote>
        );
      case "codeBlock":
        const language = (node as Content).attrs?.language || "text";
        return (
          <pre key={index}>
            <code className={`language-${language}`}>
              {renderContent((node as Content).content as MarkdownNode[])}
            </code>
          </pre>
        );
      case "text":
        return renderTextWithMarks(node as TextWithMarks);
      default:
        return null;
    }
  });
}
export function parseMarkdownToJson(markdown: string): Content[] {
  const content: Content[] = [];
  const lines = markdown.split("\n");

  function addContent(
    type: string,
    content: Content[] | TextWithMarks[] = [],
    attrs: Record<string, any> = {}
  ): Content {
    return {
      type,
      ...(Object.keys(attrs).length && { attrs }),
      content,
    };
  }

  const textWithMarks = (text: string, marks: Mark[] = []): TextWithMarks => {
    // @ts-ignore
    if (text.trim() === "") return null; // Ignore empty text
    return {
      type: "text",
      text,
      ...(marks.length && { marks }),
    };
  };

  const parseText = (text: string): TextWithMarks[] => {
    text = decodeHtmlEntities(text); // Decode HTML entities
    const segments: TextWithMarks[] = [];
    let lastIndex = 0;

    // Combine all patterns to be checked for matches.
    const combinedRegex =
      /(\*\*\*([^*]+?)\*\*\*)|(\*\*([^*]+?)\*\*)|(\*([^*]+?)\*)|(_([^_]+?)_)|(<u>(.+?)<\/u>)|(\[([^\]]+?)\]\(([^)]+?)\))|(`([^`]+?)`)/g;
    let match: RegExpExecArray | null;

    while ((match = combinedRegex.exec(text)) !== null) {
      const [fullMatch] = match;
      const startIndex = match.index;
      const endIndex = startIndex + fullMatch.length;

      if (lastIndex < startIndex) {
        const textSegment = text.slice(lastIndex, startIndex);
        if (textSegment.trim() !== "") {
          segments.push(textWithMarks(textSegment));
        }
      }

      if (match[2]) {
        segments.push(
          textWithMarks(match[2], [{ type: "bold" }, { type: "italic" }])
        );
      } else if (match[4]) {
        segments.push(textWithMarks(match[4], [{ type: "bold" }]));
      } else if (match[6]) {
        segments.push(textWithMarks(match[6], [{ type: "italic" }]));
      } else if (match[8]) {
        segments.push(textWithMarks(match[8], [{ type: "italic" }]));
      } else if (match[10]) {
        segments.push(textWithMarks(match[10], [{ type: "underline" }]));
      } else if (match[12]) {
        const linkText = match[12];
        const linkHref = match[13];

        const innerSegments = parseText(linkText); // Parse inner text to get all marks

        innerSegments.forEach((segment) => {
          if (!segment.marks) {
            segment.marks = [];
          }
          segment.marks.push({
            type: "link",
            attrs: {
              href: linkHref,
              target: "_blank",
            },
          });
        });

        segments.push(...innerSegments);
      } else if (match[15]) {
        segments.push(textWithMarks(match[15], [{ type: "code" }]));
      }

      lastIndex = endIndex;
    }

    if (lastIndex < text.length) {
      const textSegment = text.slice(lastIndex);
      if (textSegment.trim() !== "") {
        segments.push(textWithMarks(textSegment));
      }
    }

    return segments.filter(Boolean); // Remove null values
  };

  let inCodeBlock = false;
  let codeLanguage = "";
  let codeBuffer: string[] = [];

  for (const line of lines) {
    let match: RegExpMatchArray | null;
    if (inCodeBlock) {
      if (line.startsWith("```")) {
        content.push(
          addContent("codeBlock", [textWithMarks(codeBuffer.join("\n"))], {
            language: codeLanguage,
          })
        );
        inCodeBlock = false;
        codeBuffer = [];
      } else {
        codeBuffer.push(line);
      }
      continue;
    }

    if (line.startsWith("```")) {
      inCodeBlock = true;
      codeLanguage = line.slice(3).trim();
      continue;
    }

    if ((match = line.match(/^#{1,6}\s(.+)/))) {
      // @ts-ignore
      const level = line.match(/^#+/)[0].length;
      const headingText = match[1].trim();
      const headingContent = parseText(headingText);

      content.push(addContent("heading", headingContent, { level }));
      continue;
    }

    if ((match = line.match(/^\s*[-*]\s\[(x| )\]\s(.+)/))) {
      const isChecked = match[1] === "x";
      const checklistText = match[2];
      const checklistContent = parseText(checklistText);

      const listItem = addContent("checkList", checklistContent, {
        checked: isChecked,
      });

      if (
        content.length === 0 ||
        content[content.length - 1].type !== "checkList"
      ) {
        content.push(addContent("checkList", [listItem]));
      } else {
        const lastList = content[content.length - 1];
        (lastList.content as Content[]).push(listItem);
      }

      continue;
    }

    if ((match = line.match(/^\s*[-*]\s(.+)/))) {
      const bulletText = match[1];
      const bulletContent = parseText(bulletText);

      const listItem = addContent(
        "listItem",
        [addContent("paragraph", bulletContent)],
        { color: "" }
      );

      if (
        content.length === 0 ||
        content[content.length - 1].type !== "bulletList"
      ) {
        content.push(addContent("bulletList", [listItem]));
      } else {
        const lastList = content[content.length - 1];
        (lastList.content as Content[]).push(listItem);
      }

      continue;
    }

    if ((match = line.match(/^\d+\.\s(.+)/))) {
      const orderedText = match[1];
      const orderedContent = parseText(orderedText);

      const listItem = addContent(
        "listItem",
        [addContent("paragraph", orderedContent)],
        { color: "" }
      );

      if (
        content.length === 0 ||
        content[content.length - 1].type !== "orderedList"
      ) {
        content.push(addContent("orderedList", [listItem]));
      } else {
        const lastList = content[content.length - 1];
        (lastList.content as Content[]).push(listItem);
      }

      continue;
    }

    // Updated regex for images to correctly parse src and title
    if ((match = line.match(/^!\[([^\]]*)\]\(([^"\s]+)(?:\s*"([^"]*)")?\)/))) {
      const altText = match[1];
      const src = match[2];
      // Title is parsed but not added to attrs
      content.push(addContent("image", [], { src, alt: altText }));
      continue;
    }

    if ((match = line.match(/^\|\s*(.+?)\s*\|\s*(.+?)\s*\|/))) {
      const leftText = match[1];
      const rightText = match[2];
      const tableContent = [
        addContent("paragraph", parseText(leftText)),
        addContent("paragraph", parseText(rightText)),
      ];

      content.push(addContent("table", tableContent as any));
      continue;
    }

    if ((match = line.match(/^>\s(.+)/))) {
      const blockquoteText = match[1];
      const blockquoteContent = parseText(blockquoteText);

      content.push(
        addContent("blockquote", [addContent("paragraph", blockquoteContent)])
      );
      continue;
    }

    // Thematic break (horizontal rule)
    if (line.match(/^(\*\s*){3,}$|^(-\s*){3,}$|^(_\s*){3,}$/)) {
      content.push(addContent("thematicBreak"));
      continue;
    }

    if (line.trim() !== "") {
      const paragraphContent = parseText(line);
      content.push(addContent("paragraph", paragraphContent));
    }
  }

  return content;
}

function decodeHtmlEntities(text: string): string {
  const textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  return textArea.value;
}

// Example usage
export const markdown = `
## Hello World

![Hello World](https://picsum.photos/200/300 "sadddddddddd")

A thematic break separates this content.

---

***Another break here.***

* [x] Task 1 completed
* [ ] Task 2 not completed
* [x] Task 3 completed
`;

const jsonContent = parseMarkdownToJson(markdown);
console.log(JSON.stringify(jsonContent, null, 2));
