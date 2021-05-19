import chromeService from "./services/chromeService";
import visionService from "./services/visionService";
import MessagePassingService from "./services/messagePassing";
import MessagePassingExternalService from "./services/messagePassingExternal";
import Constants from "../constants";
import { loadImage, generateGuid, DataStore } from "./services/helper";

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
  MessagePassingService.on("/open_tab", async (req, res, options) => {
    const uid = generateGuid();
    DataStore.set(uid, req.imgSrc);
    const url = `${Constants.appConfig.endpoint}/screen?id=${uid}`;
    chrome.tabs.query({ url: "https://imagetext.xyz/*" }, (tabs) => {
      const [tab] = tabs;
      if (tab) {
        chrome.tabs.update(tab.id, { url, active: true });
      } else {
        chrome.tabs.create({ url }, () => {});
      }
    });
  });
  MessagePassingExternalService.on(
    "/get_image_data",
    async (req, res, options) => {
      const { id } = req;
      const imgData = DataStore.get(id);
      if (imgData) {
        const imageb64Data = await loadImage(imgData);
        res(imageb64Data);
      } else {
        res(null);
      }
    }
  );
  MessagePassingExternalService.on("/clear_image_data", (req, res, options) => {
    const { id } = req;
    if (DataStore[id]) {
      delete DataStore[id];
    }
  });
};

export default Routes;
