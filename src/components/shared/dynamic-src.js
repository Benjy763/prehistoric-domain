// Detect mobile or desktop device
function isMobileDevice() {
  const SupportedPlatform = [
    'Win32',
    'MacIntel',
    'MacPPC',
    'Mac68K',
    'Win16',
    'Linux i686',
    'Linux x86_64',
    'Windows'
  ];

  const userAgentDataPlatform = window.navigator.userAgentData
    ? SupportedPlatform.includes(window.navigator.userAgentData.platform)
    : false;

  return (
    !SupportedPlatform.includes(window.navigator.platform) &&
    !userAgentDataPlatform
  );
}

function updateAssetSources() {
  const assetItems = document.querySelectorAll('a-asset-item');
  const isMobile = isMobileDevice();

  assetItems.forEach((asset) => {
    const defaultSrc = asset.getAttribute('src');
    const mobileSrc = asset.getAttribute('data-mobile');

    if (isMobile && mobileSrc) {
      asset.setAttribute('src', mobileSrc);
    } else if (defaultSrc) {
      asset.setAttribute('src', defaultSrc);
    }
  });
}

// Ensure this runs before assets load
// document.addEventListener('DOMContentLoaded', updateAssetSources);
window.onload = function () {
  updateAssetSources();
};
