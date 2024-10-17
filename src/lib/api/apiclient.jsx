import axios from 'axios';
import JSONBig from 'json-bigint';
import secrets from 'secrets';

const baseURL = secrets.API_URL;

JSON.parse = JSONBig.parse;
JSON.stringify = JSONBig.stringify;

const isContentScript = () => {
  return typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage;
};

const ApiClient = {
  async request(config) {
    if (isContentScript()) {
      // We're in a content script, use the background script
      return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({
          type: 'API_REQUEST',
          config: {
            ...config,
            baseURL,
          }
        }, response => {
          if (response.error) {
            reject(response.error);
          } else {
            resolve(response);
          }
        });
      });
    } else {
      // We're not in a content script, use axios directly
      const axiosInstance = axios.create({ baseURL, withCredentials: true });
      return axiosInstance(config);
    }
  },
  get(url, config = {}) {
    return this.request({ ...config, method: 'get', url });
  },
  post(url, data, config = {}) {
    return this.request({ ...config, method: 'post', url, data });
  },
  // Add other methods (put, delete, etc.) as needed
};

export default ApiClient;

