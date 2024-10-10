import { exportCreator } from './ExportAccount/exporter';

const currentUrl = window.location.href;

console.log(currentUrl);
console.log('CHROME EXTENSION: HERE 2');

if (
  currentUrl.includes('instagram.com') ||
  currentUrl.includes('tiktok.com') ||
  currentUrl.includes('youtube.com')
) {
  exportCreator(currentUrl);
}
