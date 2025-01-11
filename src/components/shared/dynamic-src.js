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

  const userAgent = window.navigator.userAgent || '';

  // Check for VR devices like Oculus Quest, which we do not want to be considered as mobile
  const isVRDevice =
    userAgent.includes('Oculus') ||
    userAgent.includes('Pico') ||
    userAgent.includes('VR') ||
    userAgent.includes('HTC Vive') ||
    userAgent.includes('Windows Phone');

  const userAgentDataPlatform = window.navigator.userAgentData
    ? SupportedPlatform.includes(window.navigator.userAgentData.platform)
    : false;

  return (
    !isVRDevice && // Exclude VR devices from being considered mobile
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
window.onload = function () {
  updateAssetSources();
};
