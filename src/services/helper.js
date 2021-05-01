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
export { http, loadImage };
