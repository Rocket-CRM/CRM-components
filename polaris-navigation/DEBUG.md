# Debug Guide for Polaris Navigation

## Quick Debug Setup

### Option 1: Use WeWeb Serve (Recommended)

1. **Start the development server:**
   ```bash
   npm run serve --port=3000
   ```

2. **Open WeWeb Editor** and add the component via Developer popup

3. **Bind your navigation items** with test data:
   ```json
   [
     {
       "id": "rewards",
       "href": "/reward",
       "icon": null,
       "badge": null,
       "image": "https://api.iconify.design/lucide/gift.svg",
       "activeImage": "https://api.iconify.design/lucide/gift.svg?color=%234F46E5",
       "label": "Reward",
       "active": false,
       "subItems": [...]
     }
   ]
   ```

4. **Open Browser Console** (F12) and look for logs prefixed with `[Navigation]`

### Option 2: Test Image Logic Directly

1. **Run the debug script in Node.js:**
   ```bash
   node debug.js
   ```

2. **Or paste in browser console:**
   ```javascript
   // Copy and paste the contents of debug.js into browser console
   // Then test:
   window.debugNavigation.getItemImageSource(window.debugNavigation.testItem)
   ```

## What to Check in Console

### Expected Logs

When images should load, you should see:
```
[Navigation] Processed item: { id: "rewards", image: "https://...", ... }
[Navigation] getItemImageSource for item: { id: "rewards", hasImage: true, ... }
[Navigation] Using regular image: https://api.iconify.design/lucide/gift.svg
[Navigation] processImageSource: returning original imageSource: https://...
[Navigation] Image loaded successfully: { itemId: "rewards", imageSource: "https://..." }
```

### Error Indicators

If images don't load, check for:
- `[Navigation] No valid image source found` - Image property is missing/empty
- `[Navigation] Image failed to load` - URL is invalid or CORS blocked
- No logs at all - Component not rendering or function not being called

## Common Issues

### 1. Images Not Showing
- **Check**: Console for `getItemImageSource` logs
- **Verify**: `item.image` is a non-empty string
- **Verify**: `item.isActive` matches your expectation

### 2. Wrong Image Showing
- **Check**: Which image source is selected (activeImage vs image)
- **Verify**: `item.isActive` value is correct

### 3. CORS Errors
- **Issue**: Iconify API might block direct image loading
- **Solution**: Use a proxy or host images yourself

### 4. Empty String Handling
- **Check**: `activeImage: ""` should fallback to `image`
- **Verify**: Empty strings are being trimmed correctly

## Test Data

Use this test data structure:
```json
{
  "id": "rewards",
  "href": "/reward",
  "icon": null,
  "badge": null,
  "image": "https://api.iconify.design/lucide/gift.svg",
  "activeImage": "https://api.iconify.design/lucide/gift.svg?color=%234F46E5",
  "label": "Reward",
  "active": false,
  "isActive": false
}
```

## Debugging Steps

1. ✅ Check console logs for item processing
2. ✅ Verify `getItemImageSource` is called
3. ✅ Check which image source is selected
4. ✅ Verify `processImageSource` returns the URL
5. ✅ Check if image element is in DOM
6. ✅ Check Network tab for image requests
7. ✅ Verify no CORS errors

## Removing Debug Logs

Once debugging is complete, remove or comment out the `console.log` statements in:
- `getItemImageSource` function
- `processImageSource` function
- `processedItems` computed property
- Image `@load` and `@error` handlers
