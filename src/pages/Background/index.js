import axios from 'axios';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'API_REQUEST') {
    const axiosInstance = axios.create({
      baseURL: request.config.baseURL,
      withCredentials: true,
    });

    axiosInstance(request.config)
      .then((response) => {
        sendResponse({
          data: response.data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          config: response.config,
        });
      })
      .catch((error) => {
        sendResponse({
          error: {
            message: error.message,
            response: error.response
              ? {
                  data: error.response.data,
                  status: error.response.status,
                  headers: error.response.headers,
                }
              : null,
          },
        });
      });

    return true; // Indicates that the response is asynchronous
  }
});

// Store the current creator
let currentCreator = null;
let currentCreatorURL = null;
let currentCreatorPlatform = null;

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'setCurrentCreator') {
    currentCreator = message.currentCreator;
    currentCreatorURL = message.currentCreatorURL;
    currentCreatorPlatform = message.currentCreatorPlatform;
    console.log(
      `Current creator set to: ${currentCreator} (${currentCreatorURL}) on platform: ${currentCreatorPlatform}`
    );

    // Send the updated info to all tabs
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          action: 'setCurrentCreator',
          currentCreator: currentCreator,
          currentCreatorURL: currentCreatorURL,
          currentCreatorPlatform: currentCreatorPlatform,
        });
      });
    });

    sendResponse({ status: 'Creator set successfully' });
  } else if (message.action === 'getCurrentCreator') {
    sendResponse({
      currentCreator: currentCreator,
      currentCreatorURL: currentCreatorURL,
      currentCreatorPlatform: currentCreatorPlatform,
    });
  }
  return true; // Indicates we will send a response asynchronously
});

// When a new tab is created or updated, send the current creator info
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && currentCreator) {
    chrome.tabs.sendMessage(tabId, {
      action: 'setCurrentCreator',
      currentCreator: currentCreator,
      currentCreatorURL: currentCreatorURL,
      currentCreatorPlatform: currentCreatorPlatform,
    });
  }
});
