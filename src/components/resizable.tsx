// This component is to create a re-sizable code editor screen/cell
import { useEffect, useState } from 'react';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';
import './resizable.css';

// interface
interface ResizableProps {
  direction: 'horizontal' | 'vertical';
}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  let resizableProps: ResizableBoxProps;

  // useState, to track window size
  const [innerHeight, setInnerHeight] = useState(window.innerHeight);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

  // useState to resize editor & preview screen when user drags them
  const [width, setWidth] = useState(window.innerWidth * 0.8);

  // useEffect, only runs when user re-size the window
  useEffect(() => {
    // debouncing?? It is a practice used to improve browser performanc
    let timer: any;

    // event listener
    const listener = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setInnerHeight(window.innerHeight);
        setInnerWidth(window.innerWidth);
        if (window.innerWidth * 0.8 < width) {
          setWidth(window.innerWidth * 0.8);
        }
      }, 100);
    };
    window.addEventListener('resize', listener);

    // cleanup listener function
    return () => {
      window.removeEventListener('resize', listener);
    };
  }, []);

  // logic
  if (direction === 'horizontal') {
    resizableProps = {
      className: 'resize-horizontal',
      height: Infinity,
      width: width,
      resizeHandles: ['e'],
      maxConstraints: [innerWidth * 0.8, Infinity],
      minConstraints: [innerWidth * 0.2, Infinity],
      // This func is called when user stop dragging screen size
      onResizeStop: (event, data) => {
        setWidth(data.size.width);
      },
    };
  } else {
    resizableProps = {
      height: 300,
      width: Infinity,
      resizeHandles: ['s'],
      maxConstraints: [Infinity, innerHeight * 0.9],
      minConstraints: [Infinity, 48],
    };
  }

  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
