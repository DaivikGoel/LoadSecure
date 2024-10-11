import { getCreatorProfile } from './helpers/getCreator';

export const exportCreator = (CreatorURL) => {
  const creatorUsername = getCreatorProfile(CreatorURL);
  const platform = getPlatform(CreatorURL);

  chrome.runtime.sendMessage(
    {
      action: 'setCurrentCreator',
      currentCreator: creatorUsername,
      currentCreatorURL: CreatorURL,
      currentCreatorPlatform: platform,
    },
    (response) => {
      if (chrome.runtime.lastError) {
        console.log(
          'Failed to send message:',
          chrome.runtime.lastError.message
        );
      } else {
        console.log('Message sent successfully:', response);
      }
    }
  );

  return creatorUsername;
};

const getPlatform = (CreatorURL) => {
  if (CreatorURL.includes('youtube.com')) {
    return 'YouTube';
  } else if (CreatorURL.includes('tiktok.com')) {
    return 'TikTok';
  } else if (CreatorURL.includes('instagram.com')) {
    return 'Instagram';
  } else {
    return null;
  }
};
