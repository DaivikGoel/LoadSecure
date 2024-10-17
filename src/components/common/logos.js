import React from 'react';

const Wordmark = () => (
  <img src={chrome.runtime.getURL('assets/img/wordmark.png')} alt="Wordmark" />
);

const Icon = () => (
  <img
    src={chrome.runtime.getURL('assets/img/superstar-icon.png')}
    alt="Icon"
  />
);

export { Wordmark, Icon };
