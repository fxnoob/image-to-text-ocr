import { http } from "./helper";
class Vision {
  detect = async (type, b64data) => {
    const apiKey = process.env.vision_api_key;
    const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;
    const data = {
      requests: [
        {
          image: { content: b64data },
          features: [{ type: type }],
        },
      ],
    };
    return await http("POST", url, data);
  };
}
const visionService = new Vision();
export default visionService;
