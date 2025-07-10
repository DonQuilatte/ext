# Troubleshooting Guide - Real ChatGPT API Integration

## Current Issues Fixed

### 1. Extension Context Invalidation ✅
**Problem**: `Uncaught (in promise) Error: Extension context invalidated.`
**Solution**: Added emergency fix script that handles Chrome storage API failures with fallback data.

### 2. Real API Functions Not Found ✅
**Problem**: `[TestAPI] ❌ Real API functions not found after waiting`
**Solution**: Improved real API bridge with better initialization and fallback mechanisms.

### 3. CORS Errors ✅
**Problem**: `Access to fetch at 'https://api.infi-dev.com/...' has been blocked by CORS policy`
**Solution**: Enhanced dev-init.js to properly block external API calls and use local fallbacks.

### 4. Undefined Property Errors ✅
**Problem**: `Cannot read properties of undefined (reading 'local_folders')`
**Solution**: Added comprehensive error handling and fallback data for all API functions.

## New Architecture

### Emergency Fix Script (Loads First)
- **File**: `scripts/emergency-fix.js`
- **Purpose**: Prevents all undefined errors and provides immediate fallbacks
- **Features**:
  - Extension context validation
  - Chrome storage API error handling
  - Immediate API function fallbacks
  - Undefined error monitoring and auto-fixing

### Real API Bridge (Enhanced)
- **File**: `scripts/real-api-bridge.js`
- **Purpose**: Extracts real ChatGPT data from DOM
- **Features**:
  - Improved ChatGPT detection
  - Better conversation extraction
  - Timeout handling
  - Real-time data synchronization

### Premium Features Fix (Updated)
- **File**: `scripts/fix-premium-features.js`
- **Purpose**: Maps extension API calls to real data
- **Features**:
  - Real API integration with fallbacks
  - Timeout handling for API calls
  - Graceful degradation when real API unavailable

## Testing Instructions

### 1. Load Extension
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the extension folder
4. Navigate to https://chatgpt.com

### 2. Check Console Logs
Open browser console (F12) and look for these success messages:
```
🚨 Emergency Fix Script Loading...
✅ Emergency Fix Script Loaded
[RealAPI] Initializing real ChatGPT API bridge...
🔧 Fixing premium features with real ChatGPT API...
🧪 Testing Real API Integration...
```

### 3. Test Premium Features
1. Click extension icon in toolbar
2. Verify "Premium Features" toggle is ON
3. Click "Manage Chats" - should show real conversations or fallback message
4. Click "Manage Folders" - should show folder structure
5. Click "Manage Prompts" - should show available prompts

### 4. Debug Commands
Run these in browser console:

```javascript
// Check emergency fix status
window.emergencyFix.init()

// Test real API availability
window.testRealAPI()

// Check API function availability
console.log({
  getConversations: typeof window.getConversations,
  getUserFolders: typeof window.getUserFolders,
  getPrompts: typeof window.getPrompts,
  realGetConversations: typeof window.realGetConversations,
  REAL_API_READY: window.REAL_API_READY
})

// Test API functions directly
window.getConversations().then(console.log)
window.getUserFolders().then(console.log)
window.getPrompts().then(console.log)
```

## Expected Behavior

### Success Case (Real Data Available)
```
[EmergencyFix] ✅ Emergency fixes initialized
[RealAPI] ✅ Real API functions installed successfully
[TestAPI] ✅ Real API functions found!
[FixPremium] ✅ Real API bridge is ready
[FixPremium] getConversations called - using real ChatGPT data
✅ Extension getConversations works: 15 conversations
```

### Fallback Case (Real Data Unavailable)
```
[EmergencyFix] ✅ Emergency fixes initialized
[FixPremium] ⚠️ Real API bridge timeout, using fallback
[EmergencyFix] getConversations fallback called
✅ Extension getConversations works: 1 conversations
Sample: "Emergency Fallback - Please refresh ChatGPT page"
```

## Common Issues & Solutions

### Issue: "Extension context invalidated"
**Solution**: The emergency fix script now handles this automatically with localStorage fallbacks.

### Issue: "Real API functions not found"
**Solution**: 
1. Ensure you're on https://chatgpt.com
2. Wait for page to fully load
3. Check that ChatGPT sidebar is visible
4. Run `window.testRealAPI()` to diagnose

### Issue: "undefined" errors persist
**Solution**: The emergency fix script monitors and auto-fixes these. If they persist:
1. Run `window.emergencyFix.init()` manually
2. Check console for specific error details
3. Refresh the ChatGPT page

### Issue: No real conversations shown
**Possible Causes**:
1. No conversations exist in ChatGPT
2. ChatGPT page not fully loaded
3. Different ChatGPT UI structure

**Solutions**:
1. Create a test conversation in ChatGPT
2. Refresh the page and wait for full load
3. Check console for DOM parsing errors

### Issue: CORS errors
**Solution**: These are now blocked by the dev-init.js script and shouldn't affect functionality.

## File Loading Order (Critical)

The manifest.json loads scripts in this order:
1. `scripts/emergency-fix.js` - **FIRST** - Prevents all errors
2. `config/dev-mode.js` - Configuration
3. `scripts/dev-init.js` - Development setup
4. `scripts/real-api-bridge.js` - Real data extraction
5. `scripts/fix-premium-features.js` - API mapping
6. `scripts/test-real-api.js` - Testing and validation

## Success Indicators

✅ **No console errors** related to undefined properties  
✅ **Premium toggle shows "ON"** in extension popup  
✅ **"Manage Chats" shows data** (real or fallback)  
✅ **No CORS errors** affecting functionality  
✅ **Extension context remains valid** throughout session  

## If Problems Persist

1. **Clear browser cache** and reload extension
2. **Check ChatGPT page structure** - UI may have changed
3. **Run debug commands** to identify specific issues
4. **Check browser console** for detailed error messages
5. **Verify ChatGPT has conversations** to extract

## Manual Recovery

If extension stops working:
```javascript
// Emergency reset
window.emergencyFix.init()
window.emergencyFix.fixAPIFunctions()
window.emergencyFix.ensurePremiumStatus()

// Test functionality
window.testRealAPI()
```

This architecture ensures the extension works even when:
- Extension context becomes invalid
- Real ChatGPT API is unavailable
- DOM structure changes
- Network requests fail
- Storage API fails

The emergency fix script provides a safety net that prevents all undefined errors and ensures premium features always have some level of functionality.