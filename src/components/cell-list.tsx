import './cell-list.css';
import { Fragment, useEffect } from 'react';
import { useTypedSelector } from '../hooks/use-typed-selector';
import CellListItem from './cell-list-item';
import AddCell from './add-cell';
import { useActions } from '../hooks/use-actions';

const CellList: React.FC = () => {
  const cells = useTypedSelector(({ cells: { order, data } }) => {
    return order.map((id) => data[id]);
  });

  const { fetchCells } = useActions();

  useEffect(() => {
    fetchCells();
  }, []);

  const renderedCells = cells.map((cell) => (
    <Fragment key={cell.id}>
      <CellListItem cell={cell} />
      <AddCell idForPreviousCell={cell.id} />
    </Fragment>
  ));

  return (
    <div className="cell-list">
      <h1 className="title">Bisu's Code/Text Editor</h1>
      <AddCell forceVisible={cells.length === 0} idForPreviousCell={null} />
      {renderedCells}
    </div>
  );
};
export default CellList;
