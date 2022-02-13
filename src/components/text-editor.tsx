import { useState, useEffect, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';
import './text-editor.css';
import { Cell } from '../state';
import { useActions } from '../hooks/use-actions';

// interface
interface TextEditorProps {
  cell: Cell;
}
const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  // local useState
  const [editing, setEditing] = useState(false);
  // custom state from redux
  const { updateCell } = useActions();

  // useRef
  const ref = useRef<HTMLDivElement | null>(null);

  // useEffect
  useEffect(() => {
    // This func will be called when user clicks inside of a document
    const listener = (event: MouseEvent) => {
      // logic: to open/close editing/document view depending where user clicks
      if (
        ref.current &&
        event.target &&
        ref.current.contains(event.target as Node)
      ) {
        return;
      }
      setEditing(false);
    };
    document.addEventListener('click', listener, { capture: true });

    // cleanup
    return () => {
      document.removeEventListener('click', listener, { capture: true });
    };
  }, []);

  // logic: if true - display edit mode, if false - display view mode
  if (editing) {
    return (
      <div ref={ref} className="text-editor">
        <MDEditor
          value={cell.content}
          onChange={(userVal) => updateCell(cell.id, userVal || '')}
        />
      </div>
    );
  }
  return (
    <div onClick={() => setEditing(true)} className="text-editor card">
      <div className="card-content">
        <MDEditor.Markdown source={cell.content || 'Click to edit'} />
      </div>
    </div>
  );
};
export default TextEditor;
