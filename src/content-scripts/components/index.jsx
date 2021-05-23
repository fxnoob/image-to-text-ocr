import React from "react";
import Dialog from "@material-ui/core/Dialog";

import IFrame from "./IFrame";
import messagePassing from "../../services/messagePassing";
import mediaControl from "../../services/MediaControl";
import { isFirefox } from "../../services/helper";

const queryString = require("query-string");

export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imgSrc: "",
      isModalOpen: false,
    };
  }
  componentDidMount() {
    /** logic specific to firefox browser */
    if (
      isFirefox &&
      window.location.href.startsWith("https://imagetext.xyz/screen")
    ) {
      const parsed = queryString.parse(window.location.search);
      const uId = decodeURIComponent(parsed.id ? parsed.id : "");
      messagePassing.sendMessage(
        "/get_image_data",
        { id: uId },
        (imageb64Data) => {
          const event = new CustomEvent("CROPPEDIMAGEDATA", {
            detail: imageb64Data,
          });
          window.dispatchEvent(event);
        }
      );
    }
    /** Check for content script mount acknowledgement from background script */
    messagePassing.on("/cs_mounted", async (req, res) => {
      res({ mounted: true });
    });
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
    mediaControl.unmutePage();
    this.setState({ isModalOpen: false });
  };
  onCropEnd = (imgSrc) => {
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
        <IFrame imgSrc={this.state.imgSrc} onCropEnd={this.onCropEnd} />
      </Dialog>
    );
  }
}
