export const getAssetUrl = (assetPath) => {
  if (chrome && chrome.runtime && chrome.runtime.getURL) {
    return chrome.runtime.getURL(assetPath);
  }
  return assetPath;
};
