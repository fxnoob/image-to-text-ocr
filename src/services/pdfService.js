const pdf = require("pdfjs-dist/es5/build/pdf");

pdf.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL("js/pdf.worker.js");
export default pdf;
