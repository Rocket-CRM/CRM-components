/**
 * Debug script for Polaris Navigation Component
 * Run this in Node.js or browser console to test image loading logic
 */

// Mock test data
const testItem = {
  id: "rewards",
  href: "/reward",
  icon: null,
  badge: null,
  image: "https://api.iconify.design/lucide/gift.svg",
  activeImage: "https://api.iconify.design/lucide/gift.svg?color=%234F46E5",
  label: "Reward",
  active: false,
  isActive: false
};

// Mock processImageSource function
function processImageSource(imageSource) {
  console.log('[Debug] processImageSource called with:', imageSource, 'type:', typeof imageSource);
  
  if (!imageSource) {
    console.log('[Debug] processImageSource: imageSource is falsy, returning null');
    return null;
  }
  
  // Treat default placeholder as empty
  if (imageSource === 'https://cdn.weweb.app/public/images/no_image_selected.png') {
    console.log('[Debug] processImageSource: detected placeholder image, returning null');
    return null;
  }
  
  // Handle WeWeb design paths
  if (typeof imageSource === 'string' && imageSource.startsWith('designs/')) {
    const cdnPrefix = ''; // Mock
    const result = `${cdnPrefix}${imageSource}`;
    console.log('[Debug] processImageSource: WeWeb design path, returning:', result);
    return result;
  }
  
  console.log('[Debug] processImageSource: returning original imageSource:', imageSource);
  return imageSource;
}

// Mock getItemImageSource function
function getItemImageSource(item) {
  console.log('\n=== getItemImageSource Debug ===');
  console.log('Input item:', JSON.stringify(item, null, 2));
  
  if (!item) {
    console.log('[Debug] getItemImageSource: item is null/undefined');
    return null;
  }
  
  console.log('[Debug] Item properties:', {
    id: item.id,
    label: item.label,
    isActive: item.isActive,
    hasImage: !!item.image,
    hasActiveImage: !!item.activeImage,
    image: item.image,
    activeImage: item.activeImage,
    imageType: typeof item.image,
    activeImageType: typeof item.activeImage
  });
  
  // Get the appropriate image based on active state
  let imageSource = null;
  
  // If item is active, prefer activeImage
  if (item.isActive && item.activeImage) {
    const activeImg = String(item.activeImage).trim();
    console.log('[Debug] Checking activeImage:', activeImg);
    if (activeImg && activeImg !== '') {
      imageSource = activeImg;
      console.log('[Debug] ✓ Using activeImage:', imageSource);
    } else {
      console.log('[Debug] ✗ activeImage is empty after trim');
    }
  } else {
    console.log('[Debug] Skipping activeImage (isActive:', item.isActive, ', hasActiveImage:', !!item.activeImage, ')');
  }
  
  // If no activeImage or item is not active, use regular image
  if (!imageSource && item.image) {
    const regularImg = String(item.image).trim();
    console.log('[Debug] Checking regular image:', regularImg);
    if (regularImg && regularImg !== '') {
      imageSource = regularImg;
      console.log('[Debug] ✓ Using regular image:', imageSource);
    } else {
      console.log('[Debug] ✗ regular image is empty after trim');
    }
  } else if (!imageSource) {
    console.log('[Debug] ✗ No image property found');
  }
  
  // If no valid image source, return null
  if (!imageSource) {
    console.log('[Debug] ✗ No valid image source found, returning null');
    return null;
  }

  // Process and return
  const processed = processImageSource(imageSource);
  console.log('[Debug] Final processed image source:', processed);
  console.log('=== End Debug ===\n');
  return processed;
}

// Test cases
console.log('🧪 Testing Image Loading Logic\n');

// Test 1: Item with image, not active
console.log('Test 1: Item with image, active=false');
const result1 = getItemImageSource(testItem);
console.log('Result:', result1);
console.log('Expected: https://api.iconify.design/lucide/gift.svg');
console.log('Match:', result1 === 'https://api.iconify.design/lucide/gift.svg' ? '✅' : '❌');
console.log('\n');

// Test 2: Item with image, active=true
console.log('Test 2: Item with image, active=true');
const testItem2 = { ...testItem, active: true, isActive: true };
const result2 = getItemImageSource(testItem2);
console.log('Result:', result2);
console.log('Expected: https://api.iconify.design/lucide/gift.svg?color=%234F46E5');
console.log('Match:', result2 === 'https://api.iconify.design/lucide/gift.svg?color=%234F46E5' ? '✅' : '❌');
console.log('\n');

// Test 3: Item with empty activeImage
console.log('Test 3: Item with empty activeImage string');
const testItem3 = { ...testItem, activeImage: '' };
const result3 = getItemImageSource(testItem3);
console.log('Result:', result3);
console.log('Expected: https://api.iconify.design/lucide/gift.svg');
console.log('Match:', result3 === 'https://api.iconify.design/lucide/gift.svg' ? '✅' : '❌');
console.log('\n');

// Test 4: Item with null image
console.log('Test 4: Item with null image');
const testItem4 = { ...testItem, image: null };
const result4 = getItemImageSource(testItem4);
console.log('Result:', result4);
console.log('Expected: null');
console.log('Match:', result4 === null ? '✅' : '❌');
console.log('\n');

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.debugNavigation = {
    getItemImageSource,
    processImageSource,
    testItem
  };
  console.log('\n💡 Debug functions available in window.debugNavigation');
  console.log('Try: window.debugNavigation.getItemImageSource(window.debugNavigation.testItem)');
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getItemImageSource,
    processImageSource,
    testItem
  };
}
