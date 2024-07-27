import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  CodeToggle,
  ConditionalContents,
  CreateLink,
  DiffSourceToggleWrapper,
  InsertCodeBlock,
  InsertImage,
  InsertThematicBreak,
  KitchenSinkToolbar,
  ListsToggle,
  MDXEditor,
  Separator,
  UndoRedo,
  codeBlockPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  directivesPlugin,
  frontmatterPlugin,
  headingsPlugin,
  imagePlugin,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

import { parseMarkdownToJson } from "./RenderContent";
// Mock function to simulate image upload
const uploadImage = (imageFile: any) => {
  console.log("Uploading image:", imageFile);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("https://picsum.photos/200/300");
    }, 4000);
  });
};

export const ALL_PLUGINS = [
  toolbarPlugin({ toolbarContents: () => <KitchenSinkToolbar /> }),
  listsPlugin(),
  quotePlugin(),
  headingsPlugin(),
  linkPlugin(),
  linkDialogPlugin(),
  imagePlugin({
    imageUploadHandler: uploadImage as any,
  }),
  thematicBreakPlugin(),
  frontmatterPlugin(),
  codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
  codeMirrorPlugin({
    codeBlockLanguages: {
      js: "JavaScript",
      css: "CSS",
      txt: "text",
      tsx: "TypeScript",
      jsx: "JavaScript (JSX)",
      html: "HTML",
      md: "Markdown",
      json: "JSON",
      xml: "XML",
      yml: "YAML",
      yaml: "YAML",
      sh: "Shell",
      bash: "Bash",
      java: "Java",
      py: "Python",
      php: "PHP",
      ruby: "Ruby",
      go: "Go",
      cpp: "C++",
      cs: "C#",
      kotlin: "Kotlin",
      swift: "Swift",
      dart: "Dart",
      ts: "TypeScript",
      vue: "Vue",
      angular: "Angular",
      astro: "Astro",
    },
  }),
  directivesPlugin({ directiveDescriptors: [] }),
  diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "boo" }),
  markdownShortcutPlugin(),
];

function Editor({ setMarkdownContent }: { setMarkdownContent: any }) {
  return (
    <MDXEditor
      className="mdx-editor"
      markdown={"## Hello World"}
      plugins={[
        toolbarPlugin({
          toolbarContents: () => (
            <>
              <ConditionalContents
                options={[
                  {
                    when: (editor) => editor?.editorType === "codeblock",
                    contents: () => <ChangeCodeMirrorLanguage />,
                  },

                  {
                    fallback: () => (
                      <DiffSourceToggleWrapper>
                        <UndoRedo />
                        <BoldItalicUnderlineToggles />
                        <CodeToggle />
                        <ListsToggle />
                        <Separator />
                        <BlockTypeSelect />
                        <CreateLink />
                        <InsertImage />
                        <Separator />
                        <InsertThematicBreak />
                        <InsertCodeBlock />
                      </DiffSourceToggleWrapper>
                    ),
                  },
                ]}
              />
            </>
          ),
        }),
        listsPlugin(),
        quotePlugin(),
        headingsPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        imagePlugin({
          imageUploadHandler: uploadImage as any,
        }),
        thematicBreakPlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            js: "JavaScript",
            css: "CSS",
            txt: "Plain Text",
            tsx: "TypeScript",
          },
        }),
        directivesPlugin({ directiveDescriptors: [] }),
        diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "boo" }),
        markdownShortcutPlugin(),
      ]}
      onChange={(m) => {
        console.log({ markdown: m, parsed: parseMarkdownToJson(m) });
        setTimeout(() => {
          setMarkdownContent(m);
        }, 1000);
      }}
    />
  );
}

export default Editor;
