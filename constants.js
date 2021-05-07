const { generateGuid } = require("./src/services/guid");
const constants = {
  appConfig: {
    appName: "Image to Text (OCR)",
    urls: {
      chrome:
        "https://chrome.google.com/webstore/detail/image-to-text/jgjlejdhmfpimggbicpffmpbnalcnhoo",
      firefox: "https://addons.mozilla.org/addon/image-to-text-pro-ocr/",
      edge:
        "https://microsoftedge.microsoft.com/addons/detail/icgbomdceijejlokdmjpmgkojiliphma",
    },
    // put extension key here if required which would only be used in development mode
    key:
      "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhnjCHD79hDbWfqjnP9SW\nN0AXmXHh5eVk2D0oMILadmj/2uRQm/jNpnlvjVHY+899gdYRH/k7v4f+qF6gV3Yh\nwb/2PnW9PEo2VksgiixSesccvcwRXEJSngtxNWOARYSOTqTCCum9rjFVPZL+voh7\ndUsTN45D+RBLQORYbu5NtSM6RcGhUbYvhAosKwo+lsOAjM5niQDLJi//dZ9R32tc\n6tht4XrP59CTWBo8JCpIcHT6edN2HQ2vRiO5CHVb2jfT1hrO82WZ9LWsErzo/gCr\nXyIvnnXjg1wif7++WTi5mQl05Ohv3vKazNLeFpl/2XxvJ1xw4Pfh7m2qMaBJd7ll\n3QIDAQAB\n-----END PUBLIC KEY-----",
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
        apiKey: "AIzaSyC3VS7MKRMiPcCxcey-LgfSdWSV7GaWo70",
        authDomain: "chrome-extension-dev-229111.firebaseapp.com",
        projectId: "chrome-extension-dev-229111",
        storageBucket: "chrome-extension-dev-229111.appspot.com",
        messagingSenderId: "546869382919",
        appId: "1:546869382919:web:e95aaba9e8d137f4bfffa2",
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
