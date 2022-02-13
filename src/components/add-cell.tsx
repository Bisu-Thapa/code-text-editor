import './add-cell.css';
import { useActions } from '../hooks/use-actions';

interface AddCellProps {
  idForPreviousCell: string | null;
  forceVisible?: boolean;
}
const AddCell: React.FC<AddCellProps> = ({
  idForPreviousCell,
  forceVisible,
}) => {
  const { insertCellAfter } = useActions();
  return (
    <div className={`add-cell ${forceVisible && 'force-visible'}`}>
      <div className="add-buttons">
        <button
          className="button is-rounded is-primary is-small"
          onClick={() => insertCellAfter(idForPreviousCell, 'code')}
        >
          <span className="icon is-small ">
            <i className="fas fa-plus" />
          </span>
          <span>Code-editor</span>
        </button>
        <button
          className="button is-rounded is-primary is-small"
          onClick={() => insertCellAfter(idForPreviousCell, 'text')}
        >
          <span className="icon is-small ">
            <i className="fas fa-plus" />
          </span>
          <span>Text-editor</span>
        </button>
      </div>
      <div className="divider"></div>
    </div>
  );
};
export default AddCell;
