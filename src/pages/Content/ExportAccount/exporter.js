import secrets from 'secrets';

import { getCreatorProfile } from './helpers/getCreator';
import ApiClient from '../../../lib/api/apiclient';

export const exportCreator = (CreatorURL) => {
  const userid = 1; // Replace with the actual user ID if needed

  const creatorUsername = getCreatorProfile(CreatorURL);
  console.log(creatorUsername);
  console.log(secrets.API_URL);

  importCreatorList('bus_14mxSRqShXADSfSVfys3uT');
};

export const importCreatorList = (id) => {
  console.log('TRYING');
  ApiClient.get(`/v1/businesses/${id}/creators/metrics`).then((res) => {
    console.log('CREATORS', res);
  });
};
