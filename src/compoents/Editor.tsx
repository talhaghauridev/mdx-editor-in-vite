import {
  KitchenSinkToolbar,
  MDXEditor,
  SandpackConfig,
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
  sandpackPlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

import { parseMarkdownToJson } from "./RenderContent";

export const ALL_PLUGINS = [
  toolbarPlugin({ toolbarContents: () => <KitchenSinkToolbar /> }),
  listsPlugin(),
  quotePlugin(),
  headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
  linkPlugin(),
  linkDialogPlugin(),
  imagePlugin({
    imageAutocompleteSuggestions: [
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150",
    ],
    // disableImageResize: true,
    imageUploadHandler: async () =>
      Promise.resolve("https://picsum.photos/200/300"),
  }),
  tablePlugin(),
  thematicBreakPlugin(),
  frontmatterPlugin(),
  codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
  // sandpackPlugin({ sandpackConfig: virtuosoSampleSandpackConfig }),
  codeMirrorPlugin({
    codeBlockLanguages: {
      js: "JavaScript",
      css: "CSS",
      txt: "Plain Text",
      tsx: "TypeScript",
      "": "Unspecified",
    },
  }),
  directivesPlugin({ directiveDescriptors: [] }),
  diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "boo" }),
  markdownShortcutPlugin(),
];

// const markdownContent = `
// # Markdown syntax guide

// ## Headers

// # This is a Heading h1
// ## This is a Heading h2
// ###### This is a Heading h6
// **<u>Idfsfcdsfsdfsdfsdf</u>**
// ## Emphasis

// *This text will be italic*
// _This will also be italic_

// **This text will be bold**
// __This will also be bold__

// _You **can** combine them_

// ## Lists

// ### Unordered

// * Item 1
// * Item 2
// * Item 2a
// * Item 2b

// ### Ordered

// 1. Item 1
// 2. Item 2
// 3. Item 3
//     1. Item 3a
//     2. Item 3b

// ## Images

// ![This is an alt text.](/image/sample.webp "This is a sample image.")

// ## Links

// You may be using [Markdown Live Preview](https://markdownlivepreview.com/).

// ## Blockquotes

// > Markdown is a lightweight markup language with plain-text-formatting syntax, created in 2004 by John Gruber with Aaron Swartz.
// >
// >> Markdown is often used to format readme files, for writing messages in online discussion forums, and to create rich text using a plain text editor.

// ## Tables

// | Left columns  | Right columns |
// | ------------- |:-------------:|
// | left foo      | right foo     |
// | left bar      | right bar     |
// | left baz      | right baz     |

// ## Blocks of code

// \`\`\`
// let message = 'Hello world';
// alert(message);
// \`\`\`

// ## Inline code

// This web site is using \`markedjs/marked\`

// `;
const defaultSnippetContent = `
export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
`.trim();

const simpleSandpackConfig: SandpackConfig = {
  defaultPreset: "react",
  presets: [
    {
      label: "React",
      name: "react",
      meta: "live react",
      sandpackTemplate: "react",
      sandpackTheme: "light",
      snippetFileName: "/App.js",
      snippetLanguage: "jsx",
      initialSnippetContent: defaultSnippetContent,
    },
  ],
};

// Mock function to simulate image upload
const uploadImage = (imageFile: any) => {
  // Here you would typically send the imageFile to your server or a cloud storage service.
  // For this example, we're simulating the upload by returning a static URL.
  console.log("Uploading image:", imageFile);

  // Simulate a delay for the upload
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("https://picsum.photos/200/300");
    }, 4000);
  });
};

function Editor({ setMarkdownContent }: { setMarkdownContent: any }) {
  return (
    <MDXEditor
      className="editor-co"
      markdown={"## Hello World"}
      plugins={[
        toolbarPlugin({ toolbarContents: () => <KitchenSinkToolbar /> }),
        listsPlugin(),
        quotePlugin(),
        headingsPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        imagePlugin({
          //   imageAutocompleteSuggestions: [
          //     "https://via.placeholder.com/150",
          //     "https://via.placeholder.com/150",
          //   ],
          imageUploadHandler: uploadImage as any,
        }),
        tablePlugin(),
        thematicBreakPlugin(),
        frontmatterPlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
        sandpackPlugin({ sandpackConfig: simpleSandpackConfig as any }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            js: "JavaScript",
            css: "CSS",
            txt: "text",
            tsx: "TypeScript",
          },
          //   codeMirrorExtensions: [basicDark]
        }),
        directivesPlugin({ directiveDescriptors: [] }),
        diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "boo" }),
        markdownShortcutPlugin(),
      ]}
      onChange={(m) => {
        console.log({ markown: m, paese: parseMarkdownToJson(m) });
        setMarkdownContent(m);
      }}
    />
  );
}

export default Editor;
