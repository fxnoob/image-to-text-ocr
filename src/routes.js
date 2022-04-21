import MessagePassingService from "./services/messagePassing";
import MessagePassingExternalService from "./services/messagePassingExternal";
import { generateGuid, DataStore, getBrowserLocale } from "./services/helper";
import dbService from "./services/dbService";

const Routes = () => {
  // set extra options
  MessagePassingService.setOptions({});
  //open new tab
  MessagePassingService.on("/open_tab", async (req, res, options) => {
    console.log({ req });
    const uid = generateGuid();
    DataStore.set(uid, req.imgSrc);
    const locale = getBrowserLocale();
    const { endpoint } = await dbService.get("endpoint");
    const url = `${endpoint}/screen?id=${uid}&hl=${locale}`;
    chrome.tabs.query({ url: `${endpoint}/*` }, (tabs) => {
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
        res(imgData.replace(/^data:image\/(png|jpg);base64,/, ""));
      } else {
        res(null);
      }
    }
  );
  MessagePassingExternalService.on("/upgrade", async (req, res, options) => {
    const { endpoint } = req;
    await dbService.set({
      endpoint: endpoint ? endpoint : "https://imagetext.xyz",
    });
  });
  MessagePassingService.on("/get_image_data", async (req, res, options) => {
    const { id } = req;
    const imgData = DataStore.get(id);
    if (imgData) {
      res(imgData.replace(/^data:image\/(png|jpg);base64,/, ""));
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
