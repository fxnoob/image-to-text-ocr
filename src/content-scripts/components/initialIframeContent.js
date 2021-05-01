const initialContent = () => {
  return `<!DOCTYPE html>
    <html>
      <head>
        <style>
        body {
            margin: 0px;
        }
        html {
          overflow: scroll;
        }
        .cropper {
          position: relative;
          min-width: 100px;
        }
        .cropper__image {
          width: 100%;
          height: auto;
        }
        .cropper__cover {
          position: absolute;
          top: 0;
          left: 0;
        }
        .cropper__mask {
          fill: #333;
          fill-opacity: 0.7;
          cursor: crosshair;
        }
        .cropper__porthole {
          position: absolute;
          cursor: move;
        }
        .cropper__handle {
          position: absolute;
          width: 10px;
          height: 10px;
          background-color: white;
          border-radius: 2px;
          border: 1px solid #333;
          opacity: 0.8;
        }
        .cropper__handle:before {
          content: ' ';
          position: absolute;
          width: 40px;
          height: 40px;
          background: white;
          opacity: 0.2;
          z-index: -1;
        }
        .cropper__handle--ne {
          top: -5px;
          right: -5px;
          cursor: ne-resize;
        }
        .cropper__handle--ne:before {
          bottom: 0;
          left: 0;
          border-radius: 50% 50% 50% 0;
        }
        .cropper__handle--se {
          bottom: -5px;
          right: -5px;
          cursor: se-resize;
        }
        .cropper__handle--se:before {
          top: 0;
          left: 0;
          border-radius: 0 50% 50% 50%;
        }
        .cropper__handle--sw {
          bottom: -5px;
          left: -5px;
          cursor: sw-resize;
        }
        .cropper__handle--sw:before {
          top: 0;
          right: 0;
          border-radius: 50% 0 50% 50%;
        }
        .cropper__handle--nw {
          top: -5px;
          left: -5px;
          cursor: nw-resize;
        }
        .cropper__handle--nw:before {
          bottom: 0;
          right: 0;
          border-radius: 50% 50% 0 50%;
        }
        .cropper__ants {
          fill-opacity: 0;
          stroke: white;
          stroke-dasharray: 8;
          stroke-width: 2;
          -webkit-animation: croppermarchingants 30s linear infinite;
          -webkit-animation-fill-mode: forwards;
          -moz-animation: croppermarchingants 30s linear infinite;
          -moz-animation-fill-mode: forwards;
          animation: croppermarchingants 30s linear infinite;
          animation-fill-mode: forwards;
        }
        .cropper__ants--dark {
          fill-opacity: 0;
          stroke: #333;
          stroke-width: 2;
        }
        @-webkit-keyframes croppermarchingants {
          to {
            stroke-dashoffset: 100%;
          }
        }
        @-moz-keyframes croppermarchingants {
          to {
            stroke-dashoffset: 100%;
          }
        }
        @keyframes croppermarchingants {
          to {
            stroke-dashoffset: 100%;
          }
        }
        
        .btn-on-crop-end {
              position: relative;
              top: 50%;
              left: 50%;
              padding: 0.5rem 1rem;
              border-radius: 9999px;
              box-sizing: border-box;
              border-width: 3px;
              border-color: #22539c;
              cursor: pointer;
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
              margin: 0px;
          }
      </style>
      </head>
      <body>
        <div id="page" class="page"></div>
      </body>
    </html>`;
};

export default initialContent;
