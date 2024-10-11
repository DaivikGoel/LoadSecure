import { exportCreator } from './ExportAccount/exporter';

const currentUrl = window.location.href;

if (
  currentUrl.includes('instagram.com') ||
  currentUrl.includes('tiktok.com') ||
  currentUrl.includes('youtube.com')
) {
  exportCreator(currentUrl);
}
