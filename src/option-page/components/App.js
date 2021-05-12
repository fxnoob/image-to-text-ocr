import React, { useEffect, useState } from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Container from "@material-ui/core/Container";
import messagePassingService from "../../services/messagePassing";
import Home from "./Home";
import WindTurbineAnimation from "../../assets/WindTurbine";
import Loader from "./Loader";
import ErrorComponent from "./Error";
import chromeService from "../../services/chromeService";
import { isGoogleChrome } from "../../services/helper";
import firebaseService from "../../services/firebaseService";
const queryString = require("query-string");
const parsed = queryString.parse(location.search);
const urlString = decodeURIComponent(parsed.url ? parsed.url : "");
const ocrLoadingLabel = chromeService.getI18nMessage("ocrLoadingLabel"); // Doing OCR stuff for You....
function App() {
  const [ocr, setOcr] = useState("Recognizing...");
  const [err, setError] = useState("");
  const [url, setUrl] = useState(urlString);
  const [loading, setLoading] = useState(true);
  const createEntry = async () => {
    try {
      firebaseService.firebase.auth().onAuthStateChanged((user) => {
        firebaseService.createEntry("usage", user.uid);
      });
    } catch (e) {}
  };
  const doOCR = async () => {
    setUrl(urlString);
    messagePassingService.sendMessage(
      "/recognize",
      { url: url },
      (response) => {
        const { status, error, data } = response;
        if (url == response.url) {
          if (status == "SUCCESS") {
            setOcr(data);
            // Create Entry
            if (isGoogleChrome) {
              createEntry().catch(() => {});
            }
          } else {
            setError("Error!");
            setOcr("Error Occurred!");
          }
          setLoading(false);
        }
      }
    );
  };
  useEffect(() => {
    doOCR();
  }, []);
  return (
    <React.Fragment>
      <CssBaseline />
      {loading ? (
        <Container maxWidth="sm">
          <Loader json={WindTurbineAnimation} text={ocrLoadingLabel} />
        </Container>
      ) : err != "" ? (
        <Container maxWidth="sm">
          <ErrorComponent text="" />
        </Container>
      ) : (
        <Home ocrText={ocr} url={url} />
      )}
    </React.Fragment>
  );
}

export default App;
