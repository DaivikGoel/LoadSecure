import ApiClient from './apiclient';

export const fetchCreators = async (businessId) => {
  try {
    const response = await ApiClient.get(
      `/v1/businesses/${businessId}/creators/metrics`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching creators:', error);
    return null;
  }
};
