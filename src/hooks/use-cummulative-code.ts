import { useTypedSelector } from './use-typed-selector';

export const useCummulativeCode = (cellId: string) => {
  // return value below is a array of strings
  return useTypedSelector((state) => {
    // logic to get all the code from current and previous cells
    const { order, data } = state.cells;
    const orderedCells = order.map((id) => data[id]);
    // Custom console.log
    const showFunc = `import _React from 'react';
    import _ReactDOM from 'react-dom';
    var show = (value) =>{
      const root = document.getElementById('root');
      if(typeof value === 'object'){
        if(value.$$typeof && value.props){
            _ReactDOM.render(value, root);
        }else{
          root.innerHTML = JSON.stringify(value);
        }
      }else{
        root.innerHTML = value;
      } 
    };
    `;
    const showFuncDisplayNothing = 'var show = () =>{}';
    const cumulativeCode = [];
    for (let i of orderedCells) {
      if (i.type === 'code') {
        if (i.id === cellId) {
          cumulativeCode.push(showFunc);
        } else {
          cumulativeCode.push(showFuncDisplayNothing);
        }
        cumulativeCode.push(i.content);
      } else if (i.id === cellId) {
        break;
      }
    }
    return cumulativeCode;
  }).join('\n');
};
