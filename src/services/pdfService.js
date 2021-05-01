const pdf = require("pdfjs-dist");
pdf.GlobalWorkerOptions.workerSrc = chrome.runtime.getURL("js/pdf.worker.js");

export default pdf;
