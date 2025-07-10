# Ishka Extension - Offline Development Mode

This guide explains how to use the Ishka extension (formerly ChatGPT Toolbox) in offline development mode to prevent data leakage and external API calls.

## Overview

The extension has been configured with a comprehensive offline development mode that:
- **Blocks all external API calls** to `api.infi-dev.com`
- **Mocks authentication and payment validation**
- **Enables premium features for testing**
- **Prevents uninstall URL tracking**
- **Provides detailed logging for debugging**

## Quick Start

1. **Load the Extension**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked" and select the `jlalnhjkfiogoeonamcnngdndjbneina_source` folder

2. **Verify Offline Mode**:
   - Go to `https://chatgpt.com`
   - Open Developer Tools (F12)
   - Check the Console tab for `[DEV MODE]` and `[VERIFY]` messages
   - You should see: "🎉 All tests passed! Extension is ready for offline development."

3. **Manual Verification**:
   - In the console, run: `verifyOfflineMode()`
   - This will run comprehensive tests and show results

## Configuration Files

### [`config/dev-mode.js`](config/dev-mode.js)
Main configuration file that enables offline mode:
```javascript
window.DEV_MODE_CONFIG = {
    enabled: true,              // Enable development mode
    offlineMode: true,          // Block external requests
    mockPremiumFeatures: true,  // Enable premium features
    disableUninstallURL: true,  // Prevent tracking
    debugLogging: true          // Enable debug logs
};
```

### [`api/mock-backend.js`](api/mock-backend.js)
Comprehensive mock backend that intercepts and mocks:
- Authentication endpoints (`/auth/generate-jwt`, `/auth/jwks`)
- Payment validation (`/payments/validate-subscription`)
- User management (`/user/cancel-deletion`)

### [`scripts/dev-init.js`](scripts/dev-init.js)
Initialization script that:
- Overrides `fetch()` and `XMLHttpRequest`
- Blocks external requests in offline mode
- Mocks premium user status in storage
- Prevents uninstall URL tracking

### [`scripts/verify-offline.js`](scripts/verify-offline.js)
Verification script that tests:
- Configuration loading
- Mock backend functionality
- External call blocking
- Premium feature enablement
- Authentication mocking
- Payment mocking

## Features Enabled in Development Mode

### ✅ Premium Features
- All premium features are automatically enabled
- No subscription validation required
- Full access to paid functionality

### ✅ Authentication Bypass
- JWT generation is mocked
- JWKS validation is bypassed
- No external authentication calls

### ✅ Payment Bypass
- Subscription validation is mocked
- Premium status is automatically granted
- No payment API calls

### ✅ Privacy Protection
- No data sent to external servers
- Uninstall tracking disabled
- All external requests logged and blocked

## Debugging

### Console Messages
Look for these prefixes in the browser console:
- `[DEV MODE]` - Development mode operations
- `[VERIFY]` - Offline verification tests
- `[MOCK]` - Mock backend responses

### Manual Testing
```javascript
// Test if development mode is active
console.log(window.DEV_MODE_CONFIG);

// Test mock backend
console.log(window.MOCK_BACKEND);

// Run verification tests
verifyOfflineMode();

// Check if premium features are enabled
console.log(window.DEV_MODE_PREMIUM);
```

### Network Tab
- Open Developer Tools → Network tab
- No requests should go to `api.infi-dev.com`
- All external requests should be blocked or mocked

## File Structure

```
jlalnhjkfiogoeonamcnngdndjbneina_source/
├── config/
│   └── dev-mode.js              # Main configuration
├── api/
│   ├── mock-backend.js          # Mock API responses
│   ├── auth.js                  # Original auth (minified)
│   └── payments.js              # Original payments (minified)
├── scripts/
│   ├── dev-init.js              # Development initialization
│   ├── verify-offline.js        # Offline verification tests
│   └── background.js            # Original background (minified)
├── assets/images/
│   ├── icon16.png               # Yellow circle icons
│   ├── icon24.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
├── manifest.json                # Updated with dev scripts
└── OFFLINE_DEVELOPMENT_GUIDE.md # This guide
```

## Security Notes

### What's Blocked
- All requests to `api.infi-dev.com`
- JWT token generation calls
- JWKS validation requests
- Payment validation calls
- User deletion cancellation calls
- Uninstall URL tracking

### What's Allowed
- ChatGPT API calls (`chatgpt.com`)
- Local extension resources
- Chrome extension APIs

### Data Protection
- No user data sent to external servers
- All authentication is mocked locally
- Premium features work without real subscription
- Extension functions normally without internet

## Troubleshooting

### Extension Not Loading
1. Check that all files are present
2. Verify manifest.json syntax
3. Check for JavaScript errors in console

### External Calls Still Going Through
1. Check console for `[DEV MODE]` messages
2. Verify `window.DEV_MODE_CONFIG.enabled` is `true`
3. Run `verifyOfflineMode()` to test

### Premium Features Not Working
1. Check `window.DEV_MODE_PREMIUM` is `true`
2. Verify storage override is working
3. Check payments.js DEV_MODE_PREMIUM flag

### Verification Functions Not Available
If you get "ReferenceError: verifyOfflineMode is not defined":

1. **Try alternative functions**:
   ```javascript
   quickVerify()        // Simple verification
   testOfflineMode()    // Basic tests
   debugExtension()     // Debug information
   manualVerify()       // Manual testing
   ```

2. **Reload the extension**:
   - Go to `chrome://extensions/`
   - Click reload button for "Ishka"
   - Refresh ChatGPT page
   - Try functions again

3. **Check script loading**:
   ```javascript
   debugExtension()     // Shows what's loaded
   ```

### Console Errors
1. Check script loading order in manifest.json
2. Verify all referenced files exist
3. Check for syntax errors in configuration

## Original Extension Info

- **Original Name**: ChatGPT Toolbox
- **New Name**: Ishka
- **Version**: 3.9.6
- **Icons**: Updated to yellow circles
- **Functionality**: All original features preserved

## Development Workflow

1. **Make Changes**: Edit extension files as needed
2. **Reload Extension**: Go to `chrome://extensions/` and click reload
3. **Test**: Visit ChatGPT and verify functionality
4. **Debug**: Check console for any issues
5. **Verify**: Run `verifyOfflineMode()` to ensure offline mode works

This setup ensures complete isolation from external services while maintaining full functionality for development and testing.