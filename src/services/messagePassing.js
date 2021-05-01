import chromeService from "./chromeService";

class MessagePassing {
  constructor() {
    this.routes = {};
    this.options = {};
    this.addListener();
  }
  setOptions(options) {
    this.options = options;
  }
  on(path, callback) {
    this.routes[path] = callback;
  }
  addListener() {
    chrome.runtime.onMessage.addListener((req, sender, res) => {
      try {
        this.routes[req.path](req, res, this.options);
      } catch (e) {}
      return true;
    });
  }
  sendMessage(path, payload, callback) {
    const data = payload;
    data.path = path;
    chrome.runtime.sendMessage(data, callback);
  }
  async sendMessageToActiveTab(path, payload, callback) {
    const data = payload;
    data.path = path;
    await chromeService.sendMessageToActiveTab(data, callback);
  }
}

const mp = new MessagePassing();

export default mp;
