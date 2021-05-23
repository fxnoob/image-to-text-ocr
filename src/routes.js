import MessagePassingService from "./services/messagePassing";
import MessagePassingExternalService from "./services/messagePassingExternal";
import Constants from "../constants";
import {
  loadImage,
  generateGuid,
  DataStore,
  getBrowserLocale,
} from "./services/helper";

const Routes = async () => {
  // set extra options
  MessagePassingService.setOptions({});
  //open new tab
  MessagePassingService.on("/open_tab", async (req, res, options) => {
    const uid = generateGuid();
    DataStore.set(uid, req.imgSrc);
    const locale = getBrowserLocale();
    const url = `${Constants.appConfig.endpoint}/screen?id=${uid}&hl=${locale}`;
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
  MessagePassingService.on("/get_image_data", async (req, res, options) => {
    const { id } = req;
    const imgData = DataStore.get(id);
    if (imgData) {
      const imageb64Data = await loadImage(imgData);
      res(imageb64Data);
    } else {
      res(null);
    }
  });
  MessagePassingExternalService.on("/clear_image_data", (req, res, options) => {
    const { id } = req;
    if (DataStore[id]) {
      delete DataStore[id];
    }
  });
};

export default Routes;
