import React, { useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import Constant from "../../../constants";
import db from "../../services/dbService";

export default function Promotion() {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const init = async () => {
    const { promotionalTileShown } = await db.get("promotionalTileShown");
    if (!promotionalTileShown) {
      setOpen(true);
      db.set({ promotionalTileShown: true });
    }
  };
  useEffect(() => {
    init().catch(() => {});
  }, []);
  const handleClose = () => {
    setOpen(false);
  };
  const handleDownload = () => {
    handleClose();
    window.location.href = Constant.promotion.voiceTypingExtension;
  };
  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {"Want to use your Voice to Type ?"}
        </DialogTitle>
        <DialogContent>
          <p>
            We have created "
            <a
              style={{ textDecoration: "underline" }}
              href={Constant.promotion.voiceTypingExtension}
            >
              <b>Voice Typing</b>
            </a>
            " by using which, you can type with your voice on any website.
          </p>
          <br />
          <h3>
            <b>Features: </b>
          </h3>
          <p>(1) Type Text with your voice.</p>
          <p>(2) Type emoji with your voice.</p>
          <p>(3) Format Text with your voice (undo, redo etc.).</p>
          <p>(4) Auto Text Expander.</p>
          <p>(5) Text Replacement.</p>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDownload} color="primary" autoFocus>
            Download
          </Button>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
