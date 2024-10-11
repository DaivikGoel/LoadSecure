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
