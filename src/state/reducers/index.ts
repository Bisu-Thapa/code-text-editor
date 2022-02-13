import { combineReducers } from 'redux';
import cellsReducer from './cellsReducer';
import bundlesReducer from './bundlesReducer';

const reducers = combineReducers({
  cells: cellsReducer,
  bundles: bundlesReducer,
});
export default reducers;

// In order to apply some types to the useSelector hook from react-redux
export type RootState = ReturnType<typeof reducers>;
