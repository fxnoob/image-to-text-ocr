const http = async (method, url, data) => {
  const response = await fetch(url, {
    method: method, // *GET, POST, PUT, DELETE, etc.
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
};
const loadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => {
      const canvas = document.createElement("canvas");
      canvas.height = img.naturalHeight;
      canvas.width = img.naturalWidth;
      canvas.getContext("2d").drawImage(img, 0, 0);
      const b64data = canvas
        .toDataURL("image/png")
        .replace(/^data:image\/(png|jpg);base64,/, "");
      resolve(b64data);
    });
    img.addEventListener("error", (err) => reject(err));
    img.src = src;
  });
};
/**
 *@method  urlWithoutQueryParameters
 * @param urlString string
 * @returns string url without get query parameters
 */
const urlWithoutQueryParameters = (urlString) => {
  let u = new URL(urlString);
  return u.origin + u.pathname;
};

/**
 *@method  extractHostname
 * @param url string
 * @returns string hostname
 */
const extractHostname = (url) => {
  let hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname
  if (url.indexOf("//") > -1) {
    hostname = url.split("/")[2];
  } else {
    hostname = url.split("/")[0];
  }
  //find & remove port number
  hostname = hostname.split(":")[0];
  //find & remove "?"
  hostname = hostname.split("?")[0];

  return hostname;
};
/**
 * return browser name. if it's google chrome than return false.
 * */
const isBadBrowser =
  window.navigator.userAgent.indexOf("Edg") > -1
    ? "Microsoft Edge"
    : window.navigator.userAgent.indexOf("Firefox") > -1
    ? "Firefox"
    : void 0 !== window.navigator.brave
    ? "Brave"
    : void 0 !== window.safari
    ? "Safari"
    : !!(function () {
        for (let a = 0; a < navigator.plugins.length; a += 1)
          if (
            null != navigator.plugins[a].name &&
            -1 !== navigator.plugins[a].name.indexOf("Chromium")
          )
            return !0;
        return !1;
      })() && "Chromium";
const isGoogleChrome = isBadBrowser == false;
export {
  http,
  loadImage,
  urlWithoutQueryParameters,
  extractHostname,
  isGoogleChrome,
};
