import "@babel/polyfill";
import chromeService from "./services/chromeService";
import Routes from "./routes";
import messagePassing from "./services/messagePassing";
import constants from "../constants";
/**
 * Main extension functionality
 *
 * @class Main
 */
class Main {
  constructor() {
    this.ctxMenuId1 = null;
    this.ctxMenuId2 = null;
    this.ctxMenuId3 = null;
    this.init().catch((e) => {
      console.log("Error loading extension", { e });
    });
    // on install listener callback
    this.onInstallListener();
    // set feedback form url
    this.setFeedbackFormUrl();
  }
  init = async () => {
    await Routes();
    this.initContextMenu();
    this.popUpClickSetup();
  };
  popUpClickSetup = () => {
    chrome.browserAction.onClicked.addListener(async () => {
      const screenshotUrl = await chromeService.takeScreenShot();
      await messagePassing.sendMessageToActiveTab(
        "/show_popup",
        { screenshotUrl },
        () => {}
      );
    });
  };
  /**
   * Context menu option initialization
   *
   * @method
   * @memberof Main
   */
  initContextMenu = () => {
    if (this.ctxMenuId1) return;
    this.ctxMenuId1 = chromeService.createContextMenu({
      title: "Extract Text from this screen",
      contexts: ["all"],
      onclick: this.onContextMenu1Click,
    });
    if (this.ctxMenuId2) return;
    this.ctxMenuId2 = chromeService.createContextMenu({
      title: "Extract Text from this image",
      contexts: ["image"],
      onclick: this.onContextMenu2Click,
    });
    if (this.ctxMenuId3) return;
    this.ctxMenuId3 = chromeService.createContextMenu({
      title: "upload pdf to extract text from",
      contexts: ["all"],
      onclick: this.onContextMenu3Click,
    });
  };
  onContextMenu1Click = async (info, tab) => {
    const screenshotUrl = await chromeService.takeScreenShot();
    await messagePassing.sendMessageToActiveTab(
      "/show_popup",
      { screenshotUrl },
      () => {}
    );
  };
  onContextMenu2Click = (info, tab) => {
    const { srcUrl } = info;
    chromeService.openHelpPage("home", encodeURIComponent(srcUrl));
  };
  onContextMenu3Click = (info, tab) => {
    chromeService.openHelpPage("pdf");
  };

  /**
   *On install extension event
   * */
  onInstallListener = () => {
    chrome.runtime.onInstalled.addListener((details) => {
      // details.reason for install method
      chromeService.openHelpPage("welcome");
    });
  };

  /**
   *set feedback form url shown while uninstalling
   * */
  setFeedbackFormUrl = () => {
    chrome.runtime.setUninstallURL(constants.support.uninstallFeedbackForm);
  };
}

// init main
new Main();
