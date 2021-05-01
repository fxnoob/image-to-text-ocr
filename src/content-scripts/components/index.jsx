import React from "react";
import Dialog from "@material-ui/core/Dialog";
import FrameCropper from "./FrameCropper";
import initialContent from "./initialIframeContent";
import messagePassing from "../../services/messagePassing";
import mediaControl from "../../services/MediaControl";

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgSrc: "",
      isModalOpen: false
    };
  }
  componentDidMount() {
    messagePassing.on("/show_popup", (req, res, options) => {
      const { path, screenshotUrl } = req;
      if (path == "/show_popup") {
        if (!this.state.isModalOpen) {
          mediaControl.mutePage();
          this.setState({ imgSrc: screenshotUrl });
        } else {
          mediaControl.unmutePage();
        }
        this.setState({ isModalOpen: !this.state.isModalOpen });
      }
    });
  }
  handleClose = () => {
    this.setState({ isModalOpen: false });
  };
  onCropEnd = imgSrc => {
    messagePassing.sendMessage("/open_tab", { imgSrc });
    this.handleClose();
  };
  render() {
    return (
      <Dialog
        fullScreen
        style={{ zIndex: 2147483647 }}
        open={this.state.isModalOpen}
        onClose={this.handleClose}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <FrameCropper
          onCropEnd={this.onCropEnd}
          src={this.state.imgSrc}
          initialContent={initialContent()}
          style={{ width: "100%", height: "100%", border: "none" }}
        />
      </Dialog>
    );
  }
}
