export const getCreatorProfile = (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes('tiktok.com')) {
    return getTikTokProfile(url);
  } else if (lowerUrl.includes('instagram.com')) {
    return getInstagramProfile(url);
  } else if (
    lowerUrl.includes('youtube.com') ||
    lowerUrl.includes('youtu.be')
  ) {
    return getYouTubeProfile(url);
  } else {
    return null;
  }
};

const getTikTokProfile = (url) => {
  const regex = /@([^/?]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const getInstagramProfile = (url) => {
  const regex = /instagram\.com\/([^/?]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const getYouTubeProfile = (url) => {
  let regex;
  if (url.includes('/channel/')) {
    regex = /youtube\.com\/channel\/([^/?]+)/;
  } else if (url.includes('/c/')) {
    regex = /youtube\.com\/c\/([^/?]+)/;
  } else if (url.includes('/user/')) {
    regex = /youtube\.com\/user\/([^/?]+)/;
  } else if (url.includes('youtu.be/')) {
    regex = /youtu\.be\/([^/?]+)/;
  } else {
    regex = /youtube\.com\/([^/?]+)/;
  }
  const match = url.match(regex);
  return match ? match[1] : null;
};
