/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useCallback, useMemo } from "react";
import {
  createEditor,
  Descendant,
  Editor,
  Transforms,
  Element as SlateElement,
  BaseEditor,
  Node as SlateNode,
  Path,
  Text,
} from "slate";
import { Slate, Editable, withReact, useSlate, ReactEditor } from "slate-react";
import { HistoryEditor, withHistory } from "slate-history";
import escapeHtml from "escape-html";

// ─── TYPES ───────────────────────────────────────────────────────────────────

type MarkFormat = "bold" | "italic" | "underline" | "strike" | "subscript" | "superscript";
type BlockFormat =
  | "paragraph"
  | "heading"
  | "blockquote"
  | "bulleted-list"
  | "numbered-list"
  | "list-item";
type AlignValue = "left" | "center" | "right" | "justify";

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strike?: boolean;
  subscript?: boolean;
  superscript?: boolean;
};

type CustomElement = {
  type: BlockFormat;
  align?: AlignValue;
  children: (CustomText | CustomElement)[];
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const LIST_TYPES: BlockFormat[] = ["bulleted-list", "numbered-list"];

const EMPTY_SLATE: Descendant[] = [{ type: "paragraph", children: [{ text: "" }] }];

// ─── SERIALIZER: Slate → HTML string ─────────────────────────────────────────

const serializeNode = (node: any): string => {
  if (Text.isText(node)) {
    let text = escapeHtml(node.text);
    if (node.bold) text = `<strong>${text}</strong>`;
    if (node.italic) text = `<em>${text}</em>`;
    if (node.underline) text = `<u>${text}</u>`;
    if (node.strike) text = `<s>${text}</s>`;
    if (node.subscript) text = `<sub>${text}</sub>`;
    if (node.superscript) text = `<sup>${text}</sup>`;
    return text;
  }

  const children = node.children.map(serializeNode).join("");
  const align = node.align ? ` style="text-align:${node.align}"` : "";

  switch (node.type as BlockFormat) {
    case "heading":
      return `<h2${align}>${children}</h2>`;
    case "blockquote":
      return `<blockquote${align}>${children}</blockquote>`;
    case "bulleted-list":
      return `<ul${align}>${children}</ul>`;
    case "numbered-list":
      return `<ol${align}>${children}</ol>`;
    case "list-item":
      return `<li>${children}</li>`;
    case "paragraph":
    default:
      return `<p${align}>${children}</p>`;
  }
};

export const serializeToHtml = (nodes: Descendant[]): string => nodes.map(serializeNode).join("");

// ─── DESERIALIZER: HTML string → Slate Descendant[] ──────────────────────────

const deserializeElement = (el: HTMLElement): Descendant | Descendant[] | null => {
  if (el.nodeType === Node.TEXT_NODE) {
    return { text: el.textContent ?? "" } as any;
  }
  if (el.nodeType !== Node.ELEMENT_NODE) return null;

  const children: any[] = Array.from(el.childNodes)
    .map((child) => deserializeElement(child as HTMLElement))
    .flat()
    .filter(Boolean);

  const safeChildren = children.length > 0 ? children : [{ text: "" }];

  const alignAttr = (el as HTMLElement).style?.textAlign as AlignValue | undefined;
  const align = alignAttr || undefined;

  // Handle inline marks — these come as nested elements inside a block
  // We only generate block nodes here; marks are handled via Text leaf wrapping
  const tag = el.tagName?.toLowerCase();

  switch (tag) {
    case "h2":
    case "h3":
    case "h4":
      return { type: "heading", align, children: safeChildren };
    case "blockquote":
      return { type: "blockquote", align, children: safeChildren };
    case "ul":
      return { type: "bulleted-list", align, children: safeChildren };
    case "ol":
      return { type: "numbered-list", align, children: safeChildren };
    case "li":
      return { type: "list-item", children: safeChildren };
    case "p":
      return { type: "paragraph", align, children: safeChildren };
    // Inline marks — wrap children as marked text
    case "strong":
    case "b":
      return safeChildren.map((c: any) => ({ ...c, bold: true }));
    case "em":
    case "i":
      return safeChildren.map((c: any) => ({ ...c, italic: true }));
    case "u":
      return safeChildren.map((c: any) => ({ ...c, underline: true }));
    case "s":
    case "del":
      return safeChildren.map((c: any) => ({ ...c, strike: true }));
    case "sub":
      return safeChildren.map((c: any) => ({ ...c, subscript: true }));
    case "sup":
      return safeChildren.map((c: any) => ({ ...c, superscript: true }));
    case "body":
    case "div":
    case "span":
      return safeChildren;
    default:
      return safeChildren;
  }
};

export const deserializeFromHtml = (html: string): Descendant[] => {
  if (!html || html.trim() === "") return EMPTY_SLATE;

  const document = new DOMParser().parseFromString(html, "text/html");
  const result = deserializeElement(document.body);

  const nodes = (Array.isArray(result) ? result : [result]).filter(Boolean) as Descendant[];

  // Ensure every top-level node is a block element (not a raw text node)
  const wrapped = nodes.map((node: any) => {
    if (Text.isText(node) || !node.type) {
      return { type: "paragraph", children: [node] } as CustomElement;
    }
    return node;
  });

  return wrapped.length > 0 ? wrapped : EMPTY_SLATE;
};

// ─── PLUGIN: withLists ────────────────────────────────────────────────────────

const withLists = (editor: Editor): Editor => {
  const { insertBreak, deleteBackward } = editor;

  editor.insertBreak = () => {
    const { selection } = editor;
    if (!selection) return insertBreak();

    const [listItemEntry] = Editor.nodes(editor, {
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "list-item",
    });

    if (listItemEntry) {
      const [node] = listItemEntry;
      const isEmpty = SlateNode.string(node) === "";
      if (isEmpty) {
        Transforms.unwrapNodes(editor, {
          match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            LIST_TYPES.includes((n as CustomElement).type),
          split: true,
        });
        Transforms.setNodes(editor, { type: "paragraph" });
        return;
      }
      Transforms.insertNodes(editor, {
        type: "list-item",
        children: [{ text: "" }],
      });
      return;
    }

    insertBreak();
  };

  editor.deleteBackward = (unit) => {
    const { selection } = editor;
    if (!selection) return deleteBackward(unit);

    const [listItemEntry] = Editor.nodes(editor, {
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === "list-item",
    });

    if (listItemEntry) {
      const [, listItemPath] = listItemEntry;
      const start = Editor.start(editor, listItemPath);
      if (Path.equals(selection.anchor.path, start.path) && selection.anchor.offset === 0) {
        Transforms.unwrapNodes(editor, {
          match: (n) =>
            !Editor.isEditor(n) &&
            SlateElement.isElement(n) &&
            LIST_TYPES.includes((n as CustomElement).type),
          split: true,
        });
        Transforms.setNodes(editor, { type: "paragraph" });
        return;
      }
    }

    deleteBackward(unit);
  };

  return editor;
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const isMarkActive = (editor: Editor, format: MarkFormat): boolean => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor: Editor, format: MarkFormat): void => {
  isMarkActive(editor, format)
    ? Editor.removeMark(editor, format)
    : Editor.addMark(editor, format, true);
};

const isBlockActive = (editor: Editor, format: BlockFormat): boolean => {
  const { selection } = editor;
  if (!selection) return false;
  const [match] = Editor.nodes(editor, {
    at: Editor.unhangRange(editor, selection),
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && (n as CustomElement).type === format,
  });
  return !!match;
};

const toggleBlock = (editor: Editor, format: BlockFormat): void => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes((n as CustomElement).type),
    split: true,
  });

  if (isList && !isActive) {
    Transforms.setNodes(editor, { type: "list-item" });
    Transforms.wrapNodes(editor, { type: format, children: [] });
  } else {
    Transforms.setNodes(editor, { type: isActive ? "paragraph" : format });
  }
};

const setAlign = (editor: Editor, align: AlignValue): void => {
  Transforms.setNodes(
    editor,
    { align },
    {
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        (n as CustomElement).type !== "list-item",
    },
  );
};

// ─── RENDERERS ───────────────────────────────────────────────────────────────

const Leaf = ({ attributes, children, leaf }: any) => {
  let content = children;
  if (leaf.bold) content = <strong>{content}</strong>;
  if (leaf.italic) content = <em>{content}</em>;
  if (leaf.underline) content = <u>{content}</u>;
  if (leaf.strike) content = <s>{content}</s>;
  if (leaf.subscript) content = <sub>{content}</sub>;
  if (leaf.superscript) content = <sup>{content}</sup>;
  return <span {...attributes}>{content}</span>;
};

const Element = ({ attributes, children, element }: any) => {
  const style: React.CSSProperties = { textAlign: element.align };
  switch (element.type as BlockFormat) {
    case "heading":
      return (
        <h2 style={style} className="my-1 text-xl font-bold" {...attributes}>
          {children}
        </h2>
      );
    case "blockquote":
      return (
        <blockquote
          style={style}
          className="my-1 border-l-4 border-slate-300 pl-3 text-slate-500 italic"
          {...attributes}
        >
          {children}
        </blockquote>
      );
    case "bulleted-list":
      return (
        <ul style={style} className="my-1 list-disc pl-6" {...attributes}>
          {children}
        </ul>
      );
    case "numbered-list":
      return (
        <ol style={style} className="my-1 list-decimal pl-6" {...attributes}>
          {children}
        </ol>
      );
    case "list-item":
      return (
        <li className="my-0.5" {...attributes}>
          {children}
        </li>
      );
    default:
      return (
        <p style={style} className="my-0.5 min-h-[1.5em]" {...attributes}>
          {children}
        </p>
      );
  }
};

// ─── TOOLBAR ─────────────────────────────────────────────────────────────────

const ToolbarButton = ({
  onMouseDown,
  active,
  title,
  children,
}: {
  onMouseDown: () => void;
  active?: boolean;
  title?: string;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    title={title}
    onMouseDown={(e) => {
      e.preventDefault(); // Critical: keeps editor focus
      onMouseDown();
    }}
    className={`h-7 min-w-7 rounded px-1.5 text-sm font-medium transition-colors ${
      active
        ? "border border-blue-400 bg-blue-100 text-blue-700"
        : "border border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-100"
    }`}
  >
    {children}
  </button>
);

const Divider = () => <div className="mx-0.5 h-5 w-px shrink-0 self-center bg-slate-200" />;

const MARK_BUTTONS: {
  format: MarkFormat;
  label: React.ReactNode;
  title: string;
}[] = [
  { format: "bold", label: <strong>B</strong>, title: "Bold" },
  { format: "italic", label: <em>I</em>, title: "Italic" },
  { format: "underline", label: <u>U</u>, title: "Underline" },
  { format: "strike", label: <s>S</s>, title: "Strikethrough" },
  {
    format: "subscript",
    label: (
      <span>
        X<sub>2</sub>
      </span>
    ),
    title: "Subscript",
  },
  {
    format: "superscript",
    label: (
      <span>
        X<sup>2</sup>
      </span>
    ),
    title: "Superscript",
  },
];

const ALIGN_BUTTONS: { align: AlignValue; label: string; title: string }[] = [
  { align: "left", label: "≡←", title: "Align Left" },
  { align: "center", label: "≡↔", title: "Align Center" },
  { align: "right", label: "≡→", title: "Align Right" },
  { align: "justify", label: "≡≡", title: "Justify" },
];

const Toolbar = () => {
  const editor = useSlate();
  return (
    <div className="flex flex-wrap items-center gap-0.5 rounded-t-lg border-b border-slate-200 bg-slate-50 px-2 py-1.5">
      {MARK_BUTTONS.map(({ format, label, title }) => (
        <ToolbarButton
          key={format}
          title={title}
          active={isMarkActive(editor, format)}
          onMouseDown={() => toggleMark(editor, format)}
        >
          {label}
        </ToolbarButton>
      ))}
      <Divider />
      <ToolbarButton
        title="Heading"
        active={isBlockActive(editor, "heading")}
        onMouseDown={() => toggleBlock(editor, "heading")}
      >
        H
      </ToolbarButton>
      <ToolbarButton
        title="Blockquote"
        active={isBlockActive(editor, "blockquote")}
        onMouseDown={() => toggleBlock(editor, "blockquote")}
      >
        ❝
      </ToolbarButton>
      <ToolbarButton
        title="Bulleted List"
        active={isBlockActive(editor, "bulleted-list")}
        onMouseDown={() => toggleBlock(editor, "bulleted-list")}
      >
        • List
      </ToolbarButton>
      <ToolbarButton
        title="Numbered List"
        active={isBlockActive(editor, "numbered-list")}
        onMouseDown={() => toggleBlock(editor, "numbered-list")}
      >
        1. List
      </ToolbarButton>
      <Divider />
      {ALIGN_BUTTONS.map(({ align, label, title }) => (
        <ToolbarButton key={align} title={title} onMouseDown={() => setAlign(editor, align)}>
          {label}
        </ToolbarButton>
      ))}
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export interface SlateEditorProps {
  /** HTML string from DB, e.g. "<p>Hello <strong>world</strong></p>" */
  value?: string;
  /** Called with HTML string on every change */
  onChange?: (html: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  minHeight?: string;
  maxHeight?: string;
}

const SlateEditor = ({
  value,
  onChange,
  placeholder = "Start typing...",
  readOnly = false,
  minHeight = "120px",
  maxHeight = "320px",
}: SlateEditorProps) => {
  const editor = useMemo(() => withLists(withHistory(withReact(createEditor()))), []);

  // Initial value only once

  const initialValue = useMemo(() => deserializeFromHtml(value ?? ""), []);

  // Sync external updates
  // like AI generated content

  React.useEffect(() => {
    const newValue = deserializeFromHtml(value ?? "");

    const currentValue = editor.children;

    // Prevent unnecessary updates

    if (JSON.stringify(currentValue) === JSON.stringify(newValue)) {
      return;
    }

    editor.children = newValue;

    editor.onChange();
  }, [value, editor]);

  const renderElement = useCallback((props: any) => <Element {...props} />, []);

  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

  const handleChange = useCallback(
    (slateValue: Descendant[]) => {
      onChange?.(serializeToHtml(slateValue));
    },

    [onChange],
  );

  return (
    <Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm transition-all focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-100">
        {!readOnly && <Toolbar />}

        <Editable
          readOnly={readOnly}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder={placeholder}
          spellCheck
          style={{
            minHeight,
            maxHeight,
          }}
          className="overflow-x-hidden overflow-y-auto p-3 text-sm text-slate-700 focus:outline-none"
          onKeyDown={(event) => {
            if (event.key === "Tab") {
              event.preventDefault();
            }
          }}
        />
      </div>
    </Slate>
  );
};

export default SlateEditor;
