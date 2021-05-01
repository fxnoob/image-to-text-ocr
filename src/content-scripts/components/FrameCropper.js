import React from "react";
import IFrame, { FrameContextConsumer } from "react-frame-component";
import Cropper from "./Cropper";

function IFrameCropper(props) {
  const instanceRef = React.useRef();
  const handleRef = React.useCallback(ref => {
    instanceRef.current = {
      contentDocument: ref ? ref.node.contentDocument : null,
      contentWindow: ref ? ref.node.contentWindow : null
    };
  }, []);
  const onContentDidMount = () => {};
  return (
    <IFrame ref={handleRef} contentDidMount={onContentDidMount} {...props}>
      <FrameContextConsumer>
        {({ document, window }) => (
          <Cropper
            onCropEnd={props.onCropEnd}
            window={window}
            src={props.src}
          />
        )}
      </FrameContextConsumer>
    </IFrame>
  );
}

export default IFrameCropper;
