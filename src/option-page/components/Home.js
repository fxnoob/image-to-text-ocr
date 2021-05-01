import React from "react";
import Share from "./Share";
import chromeService from "../../services/chromeService";
import constants from "../../../constants";
const extUrl = constants.appConfig.url;
export default function OCRCard(props) {
  const [copied, setCopied] = React.useState(false);
  const [playing, togglePlay] = React.useState(false);
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
  const openPdfPage = () => {
    chromeService.openHelpPage("pdf");
  };
  const { url, ocrText } = props;
  return (
    <React.Fragment>
      <div class="bg-white overflow-hidden">
        <div class="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div class="hidden lg:block bg-gray-50 absolute top-0 bottom-0 left-3/4 w-screen"></div>
          <div class="mx-auto text-base max-w-prose lg:max-w-none">
            <a
              class="text-base leading-6 font-semibold tracking-wide uppercase"
              style={{ color: "var(--main-color)" }}
              href={extUrl}
              target="_blank"
            >
              {constants.appConfig.appName}
            </a>
            <h1 class="mt-2 mb-8 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10">
              OCR Results
            </h1>
          </div>
          <div class="lg:grid lg:grid-cols-2 lg:gap-8">
            <div class="relative mb-8 lg:mb-0 lg:row-start-1 lg:col-start-2">
              <svg
                class="hidden lg:block absolute top-0 right-0 -mt-20 -mr-20"
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
                      class="text-gray-200"
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
              <div class="relative text-base mx-auto max-w-prose lg:max-w-none">
                <figure>
                  <div class="relative pb-7/12 lg:pb-0">
                    <img
                      src={url}
                      alt=""
                      width="1184"
                      height="1376"
                      class="rounded-lg shadow-lg object-cover object-center absolute inset-0 w-full h-full lg:static lg:h-auto"
                    />
                  </div>
                  <figcaption class="flex mt-3 text-sm text-gray-500">
                    <svg
                      class="flex-none w-5 h-5 mr-2 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                        clip-rule="evenodd"
                      />
                    </svg>
                    Image taken for OCR (Optical Character Recognition)
                  </figcaption>
                  <a
                    className="flex-none text-3xl"
                    href={extUrl}
                    style={{
                      lineHeight: "2rem",
                      marginLeft: "0rem",
                      textDecoration: "underline",
                      color: "#00a774 !important",
                    }}
                  >
                    <span className="star"></span>
                    <span className="star"></span>
                    <span className="star"></span>
                    <span className="star"></span>
                    <span className="star"></span>
                    <p>Rate us</p>
                  </a>
                </figure>
              </div>
            </div>
            <div>
              <div class="text-base max-w-prose mx-auto lg:max-w-none">
                <button
                  onClick={toggleTTS}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white focus:outline-none transition duration-150 ease-in-out btn"
                >
                  {playing ? "Speaking" : "Speak"}
                </button>
                <a
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white focus:outline-none transition duration-150 ease-in-out btn"
                  href={`https://translate.google.com/#auto/en/${encodeURIComponent(
                    ocrText
                  )}`}
                  target="_blank"
                  style={{ marginLeft: "1rem" }}
                >
                  Translate
                </a>
                <button
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white focus:outline-none transition duration-150 ease-in-out btn"
                  onClick={openPdfPage}
                  style={{ marginLeft: "1rem" }}
                >
                  Extract Pdf
                </button>
                <button
                  onClick={() => {
                    copyText(ocrText);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white focus:outline-none transition duration-150 ease-in-out btn-lite"
                  style={{ marginLeft: "1rem" }}
                >
                  Copy
                </button>
                <a
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white focus:outline-none transition duration-150 ease-in-out btn-lite"
                  href="mailto:fxnoob71@gmail.com"
                  target="_blank"
                  style={{ marginLeft: "1rem" }}
                >
                  Contact
                </a>
                {copied && <span style={{ marginLeft: "1rem" }}>Copied!</span>}
              </div>
              <div
                style={{
                  marginTop: "2rem",
                  border: "1px solid",
                  padding: "1rem",
                  whiteSpace: "pre",
                }}
                class="prose text-gray-500 mx-auto lg:max-w-none lg:row-start-1 lg:col-start-1"
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
