import { getCreatorProfile } from './helpers/getCreator';
import ApiClient from '../../../lib/api/apiclient';

export const exportCreator = (CreatorURL) => {
  const creatorUsername = getCreatorProfile(CreatorURL);

  chrome.runtime.sendMessage(
    {
      action: 'setCurrentCreator',
      currentCreator: creatorUsername,
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

export const importBusinessCreatorList = (id) => {
  console.log('TRYING');
  ApiClient.get(`/v1/businesses/${id}/creators/metrics`).then((res) => {
    console.log('CREATORS', res);
  });
};
