import React, { useRef, useEffect } from 'react';
import './preview.css';

// interface
interface PreviewProps {
  code: string;
  err: string;
}

// This will listen user-input coming from parent document and display in preview iframe
const html = ` 
<html>
  <head>
  <style>html{background-color:white;}</style>
  </head>
  <body>
    <div id="root"></div>
    <script>
      const handleError = (err) =>{
        const root = document.getElementById('root');
        root.innerHTML = '<div style="color: red;"> <h3>Runtime Error:</h3> '+ err +' </div>';
        console.error(err);
      };

      window.addEventListener('error', (event) => {
        event.preventDefault();
        handleError(event.error);
      });

      window.addEventListener('message', (event) => {
      try{
        eval(event.data);
      }catch(err){
        handleError(err);
      }},false);
      </script>
  </body>
</html>`;

// component function
const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  // useRef
  const iframeRef = useRef<any>();

  // useEffect
  useEffect(() => {
    iframeRef.current.srcdoc = html;
    setTimeout(() => {
      iframeRef.current.contentWindow.postMessage(code, '*');
    }, 50);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        title="Code Preview"
        sandbox="allow-scripts"
        srcDoc={html}
        ref={iframeRef}
      />
      {err && <div className="preview-error">{err}</div>}
    </div>
  );
};

export default Preview;
