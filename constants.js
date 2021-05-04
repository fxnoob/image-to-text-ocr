const { generateGuid } = require("./src/services/guid");
const constants = {
  appConfig: {
    appName: "Image to Text Pro (OCR)",
    urls: {
      chrome:
        "https://chrome.google.com/webstore/detail/image-to-text/jgjlejdhmfpimggbicpffmpbnalcnhoo",
      firefox: "https://addons.mozilla.org/addon/image-to-text-pro-ocr/",
      edge:
        "https://microsoftedge.microsoft.com/addons/detail/icgbomdceijejlokdmjpmgkojiliphma",
    },
    // put extension key here if required which would only be used in development mode
    key:
      "-----BEGIN PUBLIC KEY-----\n" +
      "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwDIDqs43GocJ9rQkIdi5\n" +
      "WEzj4vGkr/zATAqaOMEyxNrf05cOBDpkBmi+m4eCmvR+MRPG3dhFAopTGS23HFsx\n" +
      "QH/ke/4ClvxIfcM3G6QYalMZTIM+qoPr59WQUQgirSJvgszO/RxyUyTOXeh7u7z3\n" +
      "8UffFl7JZ3gPrOIIYed/VkAfrFg2IfivgW+GkrWXfuztj8MndIfEfqFKWomgiOx1\n" +
      "BAXkrM8GzaMtiPRiV9CECK4zDJvzIC3KKsnuHZn/dDD8VVFg3/17fgMVd+SX++EC\n" +
      "XSII42yAxwaEbNEc+JGCIXC2vdclXgDoa982cOLzJA0KDrplKODDT16nzemq5O94\n" +
      "4wIDAQAB\n" +
      "-----END PUBLIC KEY-----",
  },
  contentScript: {
    mountId: generateGuid(),
  },
  browser: {
    firefox: {
      manifest: {
        browser_specific_settings: {
          gecko: {
            id: "fxnoob71@gmail.com",
            strict_min_version: "42.0",
          },
        },
      },
    },
  },
  google: {
    firebase: {
      config: {
        apiKey: "AIzaSyC2ZzuonwqL8IpzaOTbhwe_r0PO0IrUVM8",
        authDomain: "image-to-text-pro.firebaseapp.com",
        projectId: "image-to-text-pro",
        storageBucket: "image-to-text-pro.appspot.com",
        messagingSenderId: "500214874087",
        appId: "1:500214874087:web:2d41b42301ab04abd8c742",
        measurementId: "G-ZK3S0NVC3F",
      },
    },
  },
  support: {
    donate: "https://www.patreon.com/fxnoob",
    howToVideoLink: "https://www.youtube.com/watch?v=0BnUis2H_Kc",
    uninstallFeedbackForm: "https://forms.gle/iaFrarBtMp2YDFhB6",
  },
};

module.exports = constants;
