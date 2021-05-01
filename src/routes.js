import chromeService from "./services/chromeService";
import visionService from "./services/visionService";
import MessagePassingService from "./services/messagePassing";
import { loadImage } from "./services/helper";

const Routes = async () => {
  // set extra options
  MessagePassingService.setOptions({});
  // recognize text from an Image and return text data
  MessagePassingService.on("/recognize", async (req, res, options) => {
    const response = {
      status: "SUCCESS",
      error: "",
      data: "",
    };
    try {
      const imageb64Data = await loadImage(req.url);
      const data = await visionService.detect("TEXT_DETECTION", imageb64Data);
      response.data =
        ((data.responses || [{}])[0].textAnnotations || [{}])[0].description ||
        "";
    } catch (e) {
      console.log({ e });
      response.status = "ERROR";
      response.error = e;
    }
    response.url = req.url;
    res(response);
  });
  //open new tab
  MessagePassingService.on("/open_tab", (req, res, options) => {
    chromeService.openHelpPage("home", encodeURIComponent(req.imgSrc));
  });
};

export default Routes;
