import React from "react";
/**
 * Created by https://codepen.io/slobaum/pen/NRmgWJ
 * Extended work done by fxnoob.
 * #### BEGIN APP-SPECIFIC CODE (not included in reusable component)
 */
const preloadImage = (url, crossOrigin = "anonymous") =>
  new Promise((resolve, reject) => {
    let img = new Image();

    img.crossOrigin = crossOrigin;
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.setAttribute("src", url);
  });

const getCroppedImageUrl = (url, cropMask) =>
  preloadImage(url).then(image => {
    let canvas = document.createElement("canvas");
    canvas.setAttribute("width", cropMask.width);
    canvas.setAttribute("height", cropMask.height);

    let context = canvas.getContext("2d");
    context.drawImage(
      image,
      cropMask.x,
      cropMask.y,
      cropMask.width,
      cropMask.height,
      0,
      0,
      cropMask.width,
      cropMask.height
    );
    return canvas.toDataURL("image/png");
  });

/**
 * #### BEGIN COMPONENT CODE
 */

const CROP_HANDLE_NE = "crop-handle-ne";
const CROP_HANDLE_SE = "crop-handle-se";
const CROP_HANDLE_SW = "crop-handle-sw";
const CROP_HANDLE_NW = "crop-handle-nw";
const CROP_HANDLE_DIRECTIONS = [
  CROP_HANDLE_NE,
  CROP_HANDLE_SE,
  CROP_HANDLE_SW,
  CROP_HANDLE_NW
];
const MINIMUM_CROP_DIMENSION = 30;
const DIRECTION_TO_CLASSNAME_MAP = {
  [CROP_HANDLE_NE]: "cropper__handle--ne",
  [CROP_HANDLE_SE]: "cropper__handle--se",
  [CROP_HANDLE_SW]: "cropper__handle--sw",
  [CROP_HANDLE_NW]: "cropper__handle--nw"
};

const getScaledCropMask = ({ x, y, width, height }, scale = 1) => ({
  x: Math.round(x / scale),
  y: Math.round(y / scale),
  width: Math.round(width / scale),
  height: Math.round(height / scale)
});

const pxToStyles = ({ x, y, width, height }) => ({
  left: `${x}px`,
  top: `${y}px`,
  width: `${width}px`,
  height: `${height}px`
});

const getCropMaskPolygon = (
  naturalWidth,
  naturalHeight,
  cropMask,
  scale = 1
) => {
  let width = Math.round(naturalWidth / scale);
  let height = Math.round(naturalHeight / scale);
  let top = Math.round(cropMask.y / scale);
  let left = Math.round(cropMask.x / scale);
  let bottom = Math.round((cropMask.y + cropMask.height) / scale);
  let right = Math.round((cropMask.x + cropMask.width) / scale);

  return [
    "0,0",
    `${left},0`,
    `${left},${bottom}`,
    `${right},${bottom}`,
    `${right},${top}`,
    `${left},${top}`,
    `${left},0`,
    `${width},0`,
    `${width},${height}`,
    `0,${height}`,
    "0,0"
  ].join(" ");
};

const getDefaultCropMask = (width, height, multiplier = 0.1) => {
  let percentWidth = Math.floor(width * multiplier);
  let percentHeight = Math.floor(height * multiplier);

  return {
    x: percentWidth,
    y: percentHeight,
    width: width - percentWidth * 2,
    height: height - percentHeight * 2
  };
};

const getScale = (currentWidth, naturalWidth) => naturalWidth / currentWidth;

const getNextMovedCropMask = (
  dragStartPosition,
  dragStartCrop,
  newPosition,
  scale
) => {
  let { pageX: startPageX, pageY: startPageY } = dragStartPosition;
  let { pageX: newPageX, pageY: newPageY } = newPosition;
  let { x, y, width, height } = dragStartCrop;

  return {
    x: Math.floor(x - (startPageX - newPageX) * scale),
    y: Math.floor(y - (startPageY - newPageY) * scale),
    width,
    height
  };
};

const correctAspectRatio = (
  width,
  aspectRatio,
  naturalWidth,
  naturalHeight,
  maxAcceptableChunk = 10
) => {
  let getDimensions = width => {
    let height = width / aspectRatio;
    return { width, height, intOffset: height % 1 };
  };
  let potentialDimensions = [];
  let preliminaryHeight = width / aspectRatio;

  if (preliminaryHeight > naturalHeight) {
    width = Math.floor(naturalHeight * aspectRatio);
    if (width > naturalWidth) {
      // this should only ever shrink the width because we generated a height from the width that was too tall and therefore we must LOWER the width to lower the height.
      // this function assumes the implementer has provided a valid width to start, so the width it just shrank should still be valid.
      throw new Error(
        "not really sure what happened here, need to give it some thought.  feel free to report a bug!"
      );
    }
  }

  for (let i = 0; i <= maxAcceptableChunk; i++) {
    potentialDimensions.push(getDimensions(width - i));
    if (potentialDimensions[i].intOffset === 0) {
      return potentialDimensions[i];
    }
  }

  // couldn't find a perfect integer, find the one that's closest
  // could improve this by sorting instead?
  //     let smallestIntOffset = Math.min.apply(Math, potentialDimensions.map((o) => o.intOffset));
  //     let dimensionWithSmallestOffset = potentialDimensions.find((dim) => dim.intOffset === smallestIntOffset);

  //     return dimensionWithSmallestOffset;

  // run a test against these to see which is fastest
  let sorted = potentialDimensions.sort(({ intOffset: a }, { intOffset: b }) =>
    a < b ? -1 : a > b ? 1 : 0
  );
  return sorted[0];
};

const constrainCropMaskXY = (
  naturalWidth,
  naturalHeight,
  { x, y, width, height }
) => {
  if (x + width > naturalWidth) {
    x = naturalWidth - width;
  }
  if (y + height > naturalHeight) {
    y = naturalHeight - height;
  }
  return {
    x: Math.floor(Math.max(0, x)),
    y: Math.floor(Math.max(0, y)),
    width,
    height
  };
};

const constrainCropMask = (
  naturalWidth,
  naturalHeight,
  { x, y, width, height },
  aspectRatio,
  maxChunkSize
) => {
  width = Math.max(MINIMUM_CROP_DIMENSION, Math.min(naturalWidth, width));
  height = Math.max(MINIMUM_CROP_DIMENSION, Math.min(naturalHeight, height));
  if (aspectRatio) {
    // http://stackoverflow.com/questions/8038605/resizing-while-maintaining-aspect-ratio-and-rounding-to-even-integers
    let corrected = correctAspectRatio(
      width,
      aspectRatio,
      naturalWidth,
      naturalHeight,
      maxChunkSize
    );
    width = corrected.width;
    height = corrected.height;
  }
  width = Math.floor(width);
  height = Math.floor(height);

  return {
    ...constrainCropMaskXY(naturalWidth, naturalHeight, {
      x,
      y,
      width,
      height
    }),
    width,
    height
  };
};

const centerCropMask = (
  naturalWidth,
  naturalHeight,
  { x, y, width, height }
) => ({
  x: Math.floor((naturalWidth - width) / 2),
  y: Math.floor((naturalHeight - height) / 2),
  width,
  height
});

const getEventCoords = ({ touches, pageX, pageY }) => {
  return touches
    ? {
        pageX: touches[0].pageX,
        pageY: touches[0].pageY
      }
    : { pageX, pageY };
};

const HAS_WINDOW = typeof window !== "undefined";

const addWindowHandler = (windowObj, eventName, handler) => {
  if (HAS_WINDOW) {
    windowObj.addEventListener(eventName, handler);
  }
};
const removeWindowHandler = (windowObj, eventName, handler) => {
  if (HAS_WINDOW) {
    windowObj.removeEventListener(eventName, handler);
  }
};
const addMoveHandler = (window, handler) => {
  addWindowHandler(window, "mousemove", handler);
  addWindowHandler(window, "touchmove", handler);
};
const removeMoveHandler = (window, handler) => {
  removeWindowHandler(window, "mousemove", handler);
  removeWindowHandler(window, "touchmove", handler);
};
const addActionEndHandler = (window, handler) => {
  addWindowHandler(window, "mouseup", handler);
  addWindowHandler(window, "touchend", handler);
};
const removeActionEndHandler = (window, handler) => {
  removeWindowHandler(window, "mouseup", handler);
  removeWindowHandler(window, "touchend", handler);
};

class Cropper extends React.Component {
  static defaultProps = {
    crossOrigin: "anonymous",
    aggressiveCallbacks: false,
    altText: "",
    aspectRatioMaxChunkSize: 10
  };

  constructor(props) {
    super(props);
  }

  state = {
    naturalWidth: 0,
    naturalHeight: 0,
    cropMask: undefined,
    scale: 1
  };

  componentWillMount() {
    this._handleWindowSize = this._handleWindowSize.bind(this);

    addWindowHandler(this.props.window, "resize", this._handleWindowSize);
  }

  componentWillUnmount() {
    removeWindowHandler(this.props.window, "resize", this._handleWindowSize);
  }

  _handleWindowSize() {
    this._setScale();
  }

  _handleImageLoaded(event) {
    let {
      onCrop,
      aspectRatio,
      defaultCropMask: cropMask,
      aspectRatioMaxChunkSize
    } = this.props;
    let { naturalWidth, naturalHeight } = this.refs.image;

    if (cropMask) {
      cropMask = constrainCropMask(
        naturalWidth,
        naturalHeight,
        cropMask,
        aspectRatio,
        aspectRatioMaxChunkSize
      );
    } else {
      cropMask = centerCropMask(
        naturalWidth,
        naturalHeight,
        constrainCropMask(
          naturalWidth,
          naturalHeight,
          getDefaultCropMask(naturalWidth, naturalHeight),
          aspectRatio,
          aspectRatioMaxChunkSize
        )
      );
    }

    this.setState({
      naturalWidth,
      naturalHeight,
      cropMask
    });
    this._setScale();
    onCrop(cropMask);
  }

  _getScale() {
    let scale = 1;

    // window could be scaled before image loads
    if (this.refs.image) {
      let { clientWidth, naturalWidth } = this.refs.image;

      scale = getScale(clientWidth, naturalWidth);
    }
    return scale;
  }

  _setScale() {
    this.setState({
      scale: this._getScale()
    });
  }

  _handlePortholeMouseDown(event) {
    if (event.target.getAttribute("data-handle")) {
      return;
    }

    event.preventDefault();

    let { cropMask } = this.state;
    let handleMouseMove = this._handlePortholeMouseMove.bind(
      this,
      getEventCoords(event),
      cropMask
    );
    let handleMouseUp = this._handlePortholeMouseUp.bind(this);

    // if the user dragged the mouse into some other context (like a frame) then mouseup,
    // it's possible they could get in a state in which they're still moving things.
    // clicking should release their drag action.
    if (this._finishMoveAction) {
      this._finishMoveAction();
    }
    this._finishMoveAction = () => {
      removeMoveHandler(this.props.window, handleMouseMove);
      removeActionEndHandler(this.props.window, handleMouseUp);
      this._finishMoveAction = () => {};

      let { onCrop } = this.props;
      let { cropMask } = this.state;

      // invoke oncrop here in case the scenario above plays out.
      // when they click to release the drag action, invoke their callback.
      // if we do this in the mouseUp, it could be missed if they mouseUp in
      // a different context.
      onCrop(cropMask);
    };

    addMoveHandler(this.props.window, handleMouseMove);
    addActionEndHandler(this.props.window, handleMouseUp);
  }

  _handlePortholeMouseMove(dragStartPosition, dragStartCrop, event) {
    event.preventDefault();

    let { aspectRatio, aggressiveCallbacks, onCrop } = this.props;
    let { naturalWidth, naturalHeight, scale } = this.state;
    let unconstrainedNextCropMask = getNextMovedCropMask(
      dragStartPosition,
      dragStartCrop,
      getEventCoords(event),
      scale
    );
    let cropMask = constrainCropMaskXY(
      naturalWidth,
      naturalHeight,
      unconstrainedNextCropMask
    );

    this.setState({ cropMask });
    if (aggressiveCallbacks) {
      onCrop(cropMask);
    }
  }

  _handlePortholeMouseUp(event) {
    event.preventDefault();
    this._finishMoveAction();
  }

  _handleHandleMouseDown(direction, event) {
    event.preventDefault();

    let { cropMask } = this.state;
    let handleMouseMove = this._handleHandleMouseMove.bind(
      this,
      getEventCoords(event),
      cropMask,
      direction
    );
    let handleMouseUp = this._handleHandleMouseUp.bind(this);

    // if the user dragged the mouse into some other context (like a frame) then mouseup,
    // it's possible they could get in a state in which they're still moving things.
    // clicking should release their resize action.
    if (this._finishSizeAction) {
      this._finishSizeAction();
    }
    this._finishSizeAction = () => {
      removeMoveHandler(this.props.window, handleMouseMove);
      removeActionEndHandler(this.props.window, handleMouseUp);
      this._finishSizeAction = () => {};

      let { onCrop } = this.props;
      let { cropMask } = this.state;

      // invoke oncrop here in case the scenario above plays out.
      // when they click to release the resize action, invoke their callback.
      // if we do this in the mouseUp, it could be missed if they mouseUp in
      // a different context.
      onCrop(cropMask);
    };
    addMoveHandler(this.props.window, handleMouseMove);
    addActionEndHandler(this.props.window, handleMouseUp);
  }

  _handleHandleMouseMove(dragStartPosition, dragStartCrop, direction, event) {
    event.preventDefault();

    let {
      aspectRatio,
      aggressiveCallbacks,
      onCrop,
      aspectRatioMaxChunkSize
    } = this.props;
    let { pageX: startPageX, pageY: startPageY } = dragStartPosition;
    let { pageX: newPageX, pageY: newPageY } = getEventCoords(event);
    let { x, y, width, height } = dragStartCrop;
    let { naturalWidth, naturalHeight, scale } = this.state;
    let invertWidth =
      direction === CROP_HANDLE_SW || direction === CROP_HANDLE_NW;
    let invertHeight =
      direction === CROP_HANDLE_NW || direction === CROP_HANDLE_NE;
    let widthAdjustment =
      (startPageX - newPageX) * scale * (invertWidth ? -1 : 1);
    let heightAdjustment =
      (startPageY - newPageY) * scale * (invertHeight ? -1 : 1);
    let adjustedWidth = Math.floor(width - widthAdjustment);
    let adjustedHeight = Math.floor(height - heightAdjustment);
    // the following prevents the box from getting larger when it hits the edge (still needs tweaking for resizing off the bottom)
    if (adjustedWidth + x > naturalWidth) {
      adjustedWidth = naturalWidth - x;
    }
    if (adjustedHeight + y > naturalHeight) {
      adjustedHeight = naturalHeight - y;
    }
    // the preceding prevents the box from getting larger when it hits the edge
    let sizeConstrainedMask = constrainCropMask(
      naturalWidth,
      naturalHeight,
      {
        x,
        y,
        width: adjustedWidth,
        height: adjustedHeight
      },
      aspectRatio,
      aspectRatioMaxChunkSize
    );

    let xAdjustment = invertWidth ? sizeConstrainedMask.width - width : 0;
    let yAdjustment = invertHeight ? sizeConstrainedMask.height - height : 0;
    let cropMask = constrainCropMaskXY(naturalWidth, naturalHeight, {
      ...sizeConstrainedMask,
      x: x - xAdjustment,
      y: y - yAdjustment
    });

    this.setState({ cropMask });
    if (aggressiveCallbacks) {
      onCrop(cropMask);
    }
  }

  _handleHandleMouseUp(event) {
    event.preventDefault();
    this._finishSizeAction();
  }

  onCropEnd = () => {
    this.props.onCropEnd();
  };

  render() {
    let { src, crossOrigin, altText } = this.props;
    let { naturalWidth, naturalHeight, cropMask } = this.state;
    let svgCropMask;
    let porthole;
    let scale = this._getScale();

    // image is loaded and we have a mask to show
    if (naturalWidth && naturalHeight && cropMask) {
      let scaledCropMask = getScaledCropMask(cropMask, scale);

      svgCropMask = (
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          className="cropper__cover"
        >
          <polygon
            className="cropper__mask"
            points={getCropMaskPolygon(
              naturalWidth,
              naturalHeight,
              cropMask,
              scale
            )}
          />
          <rect className="cropper__ants--dark" {...scaledCropMask} />
          <rect className="cropper__ants" {...scaledCropMask} />
        </svg>
      );

      let handles = CROP_HANDLE_DIRECTIONS.map(direction => (
        <div
          className={"cropper__handle " + DIRECTION_TO_CLASSNAME_MAP[direction]}
          data-handle="true"
          onMouseDown={this._handleHandleMouseDown.bind(this, direction)}
          onTouchStart={this._handleHandleMouseDown.bind(this, direction)}
        />
      ));

      porthole = (
        <div
          className="cropper__porthole"
          style={pxToStyles(scaledCropMask)}
          onMouseDown={this._handlePortholeMouseDown.bind(this)}
          onTouchStart={this._handlePortholeMouseDown.bind(this)}
        >
          <button className="btn-on-crop-end" onClick={this.onCropEnd}>
            +
          </button>
          {handles}
        </div>
      );
    }

    return (
      <div className="cropper">
        {svgCropMask}
        {porthole}
        <img
          src={src}
          alt={altText}
          className="cropper__image"
          crossOrigin={crossOrigin}
          ref="image"
          onLoad={this._handleImageLoaded.bind(this)}
        />
      </div>
    );
  }
}

export default class App extends React.Component {
  state = {
    previewUri: "",
    cropMask: undefined
  };
  constructor(props) {
    super(props);
  }
  _handleCrop = cropMask => {
    this.setState({ cropMask });
    if (cropMask) {
      getCroppedImageUrl(this.props.src, cropMask).then(result => {
        this.setState({
          previewUri: result
        });
      });
    } else {
      this.setState({ previewUri: "" });
    }
  };
  onCropEnd = () => {
    this.props.onCropEnd(this.state.previewUri);
  };
  render() {
    let maxChunkSize = 30;
    return (
      <Cropper
        window={this.props.window}
        src={this.props.src}
        onCropEnd={this.onCropEnd}
        onCrop={this._handleCrop.bind(this)}
        aspectRatioMaxChunkSize={maxChunkSize}
        aggressiveCallbacks={false}
      />
    );
  }
}
