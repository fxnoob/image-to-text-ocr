import React, { useCallback, useRef } from "react";
import pdfService from "../../services/pdfService";
import { useDropzone } from "react-dropzone";
import Share from "./Share";
import chromeService from "../../services/chromeService";
import messagePassing from "../../services/messagePassing";
import constants from "../../../constants";
const extUrl = constants.appConfig.url;
let canvas = null;
export default function PdfCard() {
  const [pdfSettings, setPdfSettings] = React.useState({
    pdf: null,
    initialPage: 0,
    currentPage: 0,
    pageCount: 0,
  });
  const canvasRef = useRef();
  const [loaderExtractText, setloaderExtractText] = React.useState(false);
  const [ocrText, setOcrText] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const [playing, togglePlay] = React.useState(false);
  const [pdfLoaded, setPdfLoaded] = React.useState(false);
  const appName = chromeService.getI18nMessage("appName"); // Image to Text pro (OCR).
  const ocrResultsLabel = chromeService.getI18nMessage("ocrResultsLabel"); // OCR Results
  const speakLabel = chromeService.getI18nMessage("speakLabel"); // Speak
  const translateLabel = chromeService.getI18nMessage("translateLabel"); // Translate
  const copyLabel = chromeService.getI18nMessage("copyLabel"); // Copy
  const contactLabel = chromeService.getI18nMessage("contactLabel"); // Contact
  const littleInfoPdfLabel = chromeService.getI18nMessage("littleInfoPdfLabel"); //Pdf taken for OCR (Optical Character Recognition).
  const pdfDragInfoLabel = chromeService.getI18nMessage("pdfDragInfoLabel"); // Drag 'n' drop some files here, or click to select files
  const renderPdf = (pdf, num) => {
    pdf.getPage(num).then((page) => {
      const scale = 0.8;
      const viewport = page.getViewport({ scale: scale });
      canvas = canvasRef.current;
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      const ctx = canvas.getContext("2d");
      // Render PDF page into canvas context
      var renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      };
      var renderTask = page.render(renderContext);

      // Wait for rendering to finish
      renderTask.promise.then(function () {
        pageRendering = false;
        if (pageNumPending !== null) {
          // New page rendering is pending
          renderPage(pageNumPending);
          pageNumPending = null;
        }
      });
    });
  };
  const extractText = () => {
    if (canvas) {
      setloaderExtractText(true);
      const url = canvas.toDataURL();
      messagePassing.sendMessage("/recognize", { url }, (response) => {
        const { status, error, data } = response;
        if (url == response.url) {
          if (status == "SUCCESS") {
            setOcrText(data);
          } else {
            setOcrText("Error Occurred!");
          }
          setloaderExtractText(false);
        }
      });
    }
  };
  const onPrevPage = () => {
    let { currentPage } = pdfSettings;
    if (currentPage <= 1) {
      return;
    }
    currentPage--;
    setPdfSettings({ ...pdfSettings, currentPage });
    renderPdf(pdfSettings.pdf, currentPage);
  };
  const onNextPage = () => {
    let { currentPage, pdf } = pdfSettings;
    if (currentPage >= pdf.numPages) {
      return;
    }
    currentPage++;
    setPdfSettings({ ...pdfSettings, currentPage });
    renderPdf(pdfSettings.pdf, currentPage);
  };
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        const typedarray = new Uint8Array(reader.result);
        pdfService.getDocument(typedarray).promise.then((pdf) => {
          setPdfLoaded(true);
          setPdfSettings({
            pdf: pdf,
            currentPage: 0,
            pageCount: pdf.numPages,
          });
          renderPdf(pdf, 1);
          console.log(pdf.numPages);
        });
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const toggleTTS = () => {
    if (playing) {
      chromeService.stop();
      togglePlay(false);
    } else {
      togglePlay(true);
      chromeService.speak(ocrText, () => {
        togglePlay(false);
      });
    }
  };
  const copyText = (text) => {
    const dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  return (
    <React.Fragment>
      {loaderExtractText && <div id="spinner-1"></div>}
      <div className="bg-white overflow-hidden">
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="hidden lg:block bg-gray-50 absolute top-0 bottom-0 left-3/4 w-screen"></div>
          <div className="mx-auto text-base max-w-prose lg:max-w-none">
            <a
              className="text-base leading-6 font-semibold tracking-wide uppercase"
              style={{ color: "var(--main-color)" }}
              href={extUrl}
              target="_blank"
            >
              {appName}
            </a>
            <h1 className="mt-2 mb-8 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
              {ocrResultsLabel}
            </h1>
          </div>
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div className="relative mb-8 lg:mb-0 lg:row-start-1 lg:col-start-2">
              <svg
                className="hidden lg:block absolute top-0 right-0 -mt-20 -mr-20"
                width="404"
                height="384"
                fill="none"
                viewBox="0 0 404 384"
              >
                <defs>
                  <pattern
                    id="de316486-4a29-4312-bdfc-fbce2132a2c1"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="4"
                      height="4"
                      className="text-gray-200"
                      fill="currentColor"
                    />
                  </pattern>
                </defs>
                <rect
                  width="404"
                  height="384"
                  fill="url(#de316486-4a29-4312-bdfc-fbce2132a2c1)"
                />
              </svg>
              <div className="relative text-base mx-auto max-w-prose lg:max-w-none">
                <figure>
                  <div className="relative pb-7/12 lg:pb-0">
                    {!pdfLoaded ? (
                      <section
                        className="container"
                        style={{ marginTop: "2rem" }}
                      >
                        <div {...getRootProps({ className: "dropzone" })}>
                          <input {...getInputProps()} />
                          <p>{pdfDragInfoLabel}</p>
                        </div>
                      </section>
                    ) : (
                      <div>
                        <div style={{ marginBottom: "0.5rem" }}>
                          <button
                            onClick={onPrevPage}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white focus:outline-none transition duration-150 ease-in-out btn-lite"
                          >
                            {"<-"}
                          </button>
                          <button
                            onClick={onNextPage}
                            style={{ marginLeft: "1rem" }}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white focus:outline-none transition duration-150 ease-in-out btn-lite"
                          >
                            {"->"}
                          </button>
                          <span style={{ marginLeft: "1rem" }}>
                            Page: {pdfSettings.currentPage}/
                            {pdfSettings.pageCount}
                          </span>
                          <button
                            onClick={extractText}
                            style={{ marginLeft: "1rem" }}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white focus:outline-none transition duration-150 ease-in-out btn"
                          >
                            Extract Text
                          </button>
                        </div>
                        <canvas
                          ref={canvasRef}
                          className="container"
                          id="the-canvas"
                        />
                      </div>
                    )}
                  </div>
                  <figcaption className="flex mt-3 text-sm text-gray-500">
                    <svg
                      className="flex-none w-5 h-5 mr-2 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {littleInfoPdfLabel}
                  </figcaption>
                </figure>
              </div>
            </div>
            <div>
              <div className="text-base max-w-prose mx-auto lg:max-w-none">
                <button
                  onClick={toggleTTS}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white focus:outline-none transition duration-150 ease-in-out btn"
                >
                  {playing ? "Speaking" : speakLabel}
                </button>
                <a
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white focus:outline-none transition duration-150 ease-in-out btn"
                  href={`https://translate.google.com/#auto/en/${encodeURIComponent(
                    ocrText
                  )}`}
                  target="_blank"
                  style={{ marginLeft: "1rem" }}
                >
                  {translateLabel}
                </a>
                <button
                  onClick={() => {
                    copyText(ocrText);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white focus:outline-none transition duration-150 ease-in-out btn-lite"
                  style={{ marginLeft: "1rem" }}
                >
                  {copyLabel}
                </button>
                <a
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white focus:outline-none transition duration-150 ease-in-out btn-lite"
                  href="mailto:fxnoob71@gmail.com"
                  target="_blank"
                  style={{ marginLeft: "1rem" }}
                >
                  {contactLabel}
                </a>
                {copied && <span style={{ marginLeft: "1rem" }}>Copied!</span>}
              </div>
              <div
                style={{
                  marginTop: "2rem",
                  border: "1px solid",
                  padding: "1rem",
                }}
                className="prose text-gray-500 mx-auto lg:max-w-none lg:row-start-1 lg:col-start-1"
              >
                {ocrText}
              </div>
              <hr style={{ marginTop: "2rem" }} />
              <div
                style={{ marginTop: "1rem" }}
                className="prose text-gray-500 mx-auto lg:max-w-none lg:row-start-1 lg:col-start-1"
              >
                <Share />
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
