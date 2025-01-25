// Detect device type
function getDeviceType() {
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

  // Check for VR devices like Oculus Quest
  const isVRDevice =
    userAgent.includes('Oculus') ||
    userAgent.includes('Pico') ||
    userAgent.includes('VR') ||
    userAgent.includes('HTC Vive') ||
    userAgent.includes('Windows Phone');

  const userAgentDataPlatform = window.navigator.userAgentData
    ? SupportedPlatform.includes(window.navigator.userAgentData.platform)
    : false;

  if (isVRDevice) {
    return 'vr';
  } else if (
    !SupportedPlatform.includes(window.navigator.platform) &&
    !userAgentDataPlatform
  ) {
    return 'mobile';
  } else {
    return 'desktop';
  }
}

// Update asset sources based on device type
function updateAssetSources() {
  const assetItems = document.querySelectorAll('a-asset-item');
  const deviceType = getDeviceType();

  assetItems.forEach((asset) => {
    const defaultSrc = asset.getAttribute('src');
    const mobileSrc = asset.getAttribute('data-mobile');
    const vrSrc = asset.getAttribute('data-vr');

    if (deviceType === 'mobile' && mobileSrc) {
      asset.setAttribute('src', mobileSrc);
    } else if (deviceType === 'vr' && vrSrc) {
      // Use mobile-quality assets for VR devices
      asset.setAttribute('src', vrSrc);
    } else if (defaultSrc) {
      // Default to desktop-quality assets
      asset.setAttribute('src', defaultSrc);
    }
  });
}

// Ensure this runs before assets load
window.onload = function () {
  updateAssetSources();
};
