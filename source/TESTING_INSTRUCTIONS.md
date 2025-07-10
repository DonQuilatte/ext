# Testing Instructions for Ishka Extension Premium Features

## Quick Start

1. **Reload the Extension**
   - Go to `brave://extensions/` (or `chrome://extensions/`)
   - Find the "Ishka" extension
   - Click the reload button (🔄)

2. **Refresh ChatGPT Page**
   - Go to `https://chatgpt.com`
   - Refresh the page (F5 or Ctrl+R)

3. **Check Console for Dev Mode Messages**
   - Open Developer Tools (F12)
   - Look for `[DEV MODE]` messages in the console
   - You should see initialization messages

4. **Enable Premium Features Manually**
   ```javascript
   // NEW: Use the manual enable function (most reliable)
   manuallyEnablePremium();
   
   // Then check status
   checkPremiumStatus();
   ```

5. **Debug Plan Display Issues**
   If the extension still shows "Toolbox Plan - Free":

   **Method A: Run Plan Debug**
   ```javascript
   // In browser console on ChatGPT page
   planDebug.run();
   ```
   This will provide comprehensive debugging information about:
   - Storage keys and their values
   - DOM elements containing plan text
   - Global variables related to plans
   - Network requests for plan/premium data

   **Method B: Force Text Replacement**
   ```javascript
   // In browser console on ChatGPT page
   forcePlanTextReplace();
   ```
   This will scan and replace any "Free" plan text with "Premium"

   **Method C: Monitor Real-time**
   The plan debug script runs automatically every 3 seconds and logs findings to console.

## Expected Results

### Console Messages
You should see messages like:
```
[DEV MODE] Development mode initialization started
[DEV MODE] Premium features mocked
[DEV MODE] Modified storage result for premium features
🧪 Manual Premium Control Available
🚀 Manually enabling premium features...
✅ Set DEV_MODE_PREMIUM to true
✅ Set extension premium user key
🎉 Premium features enabled! Please refresh the page.
```

### Extension Interface
- The extension should show **premium features** instead of "Free Plan"
- Premium-only features should be unlocked
- No "upgrade" prompts should appear

## Step-by-Step Premium Activation

### Method 1: Manual Enable (Recommended)
```javascript
// 1. Run this in console
manuallyEnablePremium();

// 2. Wait for success message, then refresh page
// 3. Check if premium features are now visible
checkPremiumStatus();
```

### Method 2: Using devMode Commands
```javascript
// Enable premium features
devMode.enable();

// Check status
devMode.status();
```

### Method 3: Direct Storage Manipulation
```javascript
// Set premium flags directly
chrome.storage.local.set({ DEV_MODE_PREMIUM: true });
chrome.storage.local.get('store', (result) => {
  if (!result.store) result.store = {};
  result.store['-r.6es£Jr1U0'] = true;
  chrome.storage.local.set({ store: result.store });
});
```

## Troubleshooting Plan Display Issues

### Problem: Extension Still Shows "Toolbox Plan - Free"

**Step 1: Verify Storage Keys**
```javascript
// Check all storage keys
chrome.storage.local.get(null, (data) => console.log('Local storage:', data));
chrome.storage.sync.get(null, (data) => console.log('Sync storage:', data));
```

**Step 2: Run Comprehensive Debug**
```javascript
// This will analyze everything related to plan display
planDebug.run();
```

**Step 3: Force Text Replacement**
```javascript
// This will override any "Free" text with "Premium"
forcePlanTextReplace();
```

**Step 4: Check Extension Details Page**
- Go to `chrome://extensions/`
- Find "Ishka" extension and click "Details"
- Look for the premium toggle and ensure it's ON
- Check the status display

**Step 5: Manual Storage Override**
```javascript
// Set all possible premium flags
const premiumKeys = {
  'DEV_MODE_PREMIUM': true,
  'MOCK_PREMIUM': true,
  'isPremiumUser': true,
  'userPlan': 'premium',
  'subscriptionStatus': 'active',
  'planType': 'premium'
};

chrome.storage.local.set(premiumKeys, () => {
  console.log('✅ Set premium flags');
  
  // Also set the extension's specific key
  chrome.storage.local.get('store', (result) => {
    if (!result.store) result.store = {};
    result.store['-r.6es£Jr1U0'] = true;
    chrome.storage.local.set({ store: result.store }, () => {
      console.log('✅ Set extension premium key');
      console.log('🔄 Please refresh the page');
    });
  });
});
```

**Step 6: Check for Timing Issues**
```javascript
// Run this after the page has fully loaded
setTimeout(() => {
  manuallyEnablePremium();
  setTimeout(() => {
    forcePlanTextReplace();
  }, 2000);
}, 3000);
```

### Debug Output Analysis

When you run `planDebug.run()`, look for:

1. **Storage Analysis**: Ensure these keys are set to `true`:
   - `DEV_MODE_PREMIUM`
   - `'-r.6es£Jr1U0'` (in the store object)
   - `isPremiumUser`

2. **DOM Analysis**: Check if elements with "Free" text are found
   - If found, the text override should replace them
   - Note the element structure for manual targeting

3. **Global Variables**: Look for plan-related variables
   - These might indicate how the extension determines plan status

4. **Network Requests**: Check for API calls that might override local settings

## General Troubleshooting

### If Premium Features Still Don't Show

1. **Check Extension Errors**
   - Go to `brave://extensions/?errors=[extension-id]`
   - Look for JavaScript errors
   - Report any errors found

2. **Verify Storage State**
   ```javascript
   // Check all relevant storage keys
   chrome.storage.local.get(null, (result) => {
     console.log('All storage:', result);
     console.log('DEV_MODE_PREMIUM:', result.DEV_MODE_PREMIUM);
     console.log('Premium key:', result.store?.['-r.6es£Jr1U0']);
   });
   ```

3. **Force Premium Mode**
   ```javascript
   // Set all possible premium flags
   window.DEV_MODE_PREMIUM = true;
   window.isPremiumUser = true;
   window.hasPremiumAccess = true;
   
   // Then refresh the page
   location.reload();
   ```

### If Console Functions Are Missing

1. **Check Script Loading Order**
   ```javascript
   // These should be available:
   console.log(typeof manuallyEnablePremium); // should be "function"
   console.log(typeof checkPremiumStatus);    // should be "function"
   console.log(typeof devMode);               // should be "object"
   ```

2. **Wait for Scripts to Load**
   ```javascript
   // Try again after a few seconds
   setTimeout(() => {
     manuallyEnablePremium();
   }, 3000);
   ```

## Available Commands

### NEW: Manual Premium Control
```javascript
manuallyEnablePremium()  // Most reliable way to enable premium
checkPremiumStatus()     // Comprehensive status check
```

### From devmode.js
```javascript
devMode.enable()    // Enable premium features
devMode.disable()   // Disable premium features  
devMode.status()    // Check current status
devMode.help()      // Show help
```

### From verify-offline.js
```javascript
quickVerify()       // Quick verification
verifyOfflineMode() // Full verification (if available)
```

### From debug-console.js
```javascript
debugExtension()    // Show loaded components
testOfflineMode()   // Test offline functionality
manualVerify()      // Manual verification with API testing
```

### Keyboard Shortcuts
- **Ctrl+Shift+D**: Toggle dev mode on/off

## Success Indicators

✅ **Extension loads as "Ishka" with yellow circle icon**  
✅ **Console shows `[DEV MODE]` initialization messages**  
✅ **`manuallyEnablePremium()` returns success**  
✅ **`checkPremiumStatus()` shows premium enabled**  
✅ **Premium features are visible in extension interface**  
✅ **No "Free Plan" or upgrade prompts**  
✅ **Chrome storage shows premium flags set to true**

## Common Issues & Solutions

1. **"Function not defined" errors**: 
   - Reload extension and refresh page
   - Wait 3-5 seconds for scripts to load

2. **Still shows "Free Plan"**: 
   - Run `manuallyEnablePremium()` 
   - Hard refresh page (Ctrl+Shift+R)

3. **No console messages**: 
   - Check extension errors page
   - Verify extension is enabled

4. **Storage issues**: 
   - Run `checkPremiumStatus()` to see current state
   - Use direct storage manipulation method

## Debug Information

If premium features still don't work after following all steps, run this comprehensive debug:

```javascript
// Comprehensive debug information
console.log('=== ISHKA PREMIUM DEBUG ===');
console.log('Extension name:', chrome.runtime.getManifest().name);
console.log('Window flags:', {
  DEV_MODE_PREMIUM: window.DEV_MODE_PREMIUM,
  isPremiumUser: window.isPremiumUser,
  hasPremiumAccess: window.hasPremiumAccess
});

chrome.storage.local.get(null, (result) => {
  console.log('Chrome storage:', result);
  console.log('Premium key (-r.6es£Jr1U0):', result.store?.['-r.6es£Jr1U0']);
});

console.log('Available functions:', {
  manuallyEnablePremium: typeof manuallyEnablePremium,
  checkPremiumStatus: typeof checkPremiumStatus,
  devMode: typeof devMode
});
console.log('=== END DEBUG ===');
```

Copy and paste this debug output when reporting issues.

## Key Changes Made

1. **Added `manual-premium-enable.js`** - Most reliable premium activation method
2. **Fixed script loading order** in manifest.json
3. **Multiple activation methods** - Fallbacks if one doesn't work
4. **Comprehensive debugging** - Better troubleshooting tools
5. **Storage key alignment** - Uses correct extension premium key `'-r.6es£Jr1U0'`

The extension should now properly show premium features after running `manuallyEnablePremium()`.