// components/RichTextEditor.tsx
import { Editor } from "@tinymce/tinymce-react";
// import { useRef } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  id = "rich-editor",
}: Props) {
  // const editorRef = useRef(null);

  return (
    <Editor
      id={id}
      value={value}
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      licenseKey="60c8xtr6d3xijq6tkx1kv0zjzba7aalbpeniidz0221gtl84"
      onEditorChange={onChange}
      init={{
        height: 180,
        menubar: false,
        plugins: "lists link image preview",
        toolbar:
          "undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist outdent indent | link",
        branding: false,
      }}
    />
  );
}
