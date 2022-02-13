import React, { useRef } from 'react';
import MonacoEditor, { EditorDidMount } from '@monaco-editor/react';
import Prettier from 'prettier';
import parser from 'prettier/parser-babel';
import './code-editor.css';

//interface
interface CodeEditorProps {
  initialValue: string;
  onChange(val: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  // useRef
  const editorRef = useRef<any>();

  // onChange handler, this only invoked when editor is only first displayed on the screen
  const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    // getValue gives whatever in the current editor
    // second argument is the reference of editor itself
    editorRef.current = monacoEditor;
    monacoEditor.onDidChangeModelContent(() => {
      onChange(getValue());
    });
    // change tab size to 2, default was 4
    monacoEditor.getModel()?.updateOptions({ tabSize: 2 });
  };

  // onClick handler
  const onClickFormat = () => {
    // get current value from editor
    const rawValue = editorRef.current.getModel().getValue();

    // format that value
    const formattedValue = Prettier.format(rawValue, {
      parser: 'babel',
      plugins: [parser],
      useTabs: false,
      semi: true,
      singleQuote: true,
    }).replace(/\n$/, '');

    // set the formatted value back in the editor
    editorRef.current.setValue(formattedValue);
  };

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={onClickFormat}
      >
        Format
      </button>
      <MonacoEditor
        editorDidMount={onEditorDidMount}
        value={initialValue}
        language="javascript"
        theme="dark"
        height="100%"
        options={{
          wordWrap: 'on',
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 18,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
