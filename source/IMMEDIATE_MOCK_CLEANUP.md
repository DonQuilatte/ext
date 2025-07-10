# Immediate Mock Cleanup - Start Today

## Quick Assessment

Based on the code analysis, here are the **immediate actions** you can take to start deprecating mocks:

## Phase 1: Remove Mock Backend (Today - 2 hours)

### Step 1: Remove Mock Backend Files
```bash
# Remove the main mock backend files
rm source/api/mock-backend.js
rm source/api/localBackend.js

# Update manifest.json to remove references
# Remove these lines from content_scripts.js array:
# "api/mock-backend.js",
# "api/localBackend.js",
```

### Step 2: Remove Mock Backend References
**Files to edit**:
- `source/manifest.json` - Remove mock backend from content scripts
- `source/run-e2e-tests.js` - Remove mock backend references (line 167)

```javascript
// REMOVE these lines from manifest.json:
"api/mock-backend.js",
"scripts/manual-premium-enable.js",
"api/localBackend.js",
```

## Phase 2: Clean Mock Premium Flags (Today - 1 hour)

### Global Mock Flag Removal
Run these commands to remove mock flags:

```bash
# Navigate to source directory
cd source/

# Remove DEV_MODE_PREMIUM assignments
find . -name "*.js" -exec sed -i 's/window\.DEV_MODE_PREMIUM = true;//g' {} \;
find . -name "*.js" -exec sed -i 's/result\.DEV_MODE_PREMIUM = true;//g' {} \;
find . -name "*.js" -exec sed -i "s/localStorage\.setItem('DEV_MODE_PREMIUM', 'true');//g" {} \;

# Remove MOCK_PREMIUM assignments  
find . -name "*.js" -exec sed -i 's/window\.MOCK_PREMIUM = true;//g' {} \;
find . -name "*.js" -exec sed -i 's/result\.MOCK_PREMIUM = true;//g' {} \;
find . -name "*.js" -exec sed -i "s/localStorage\.setItem('MOCK_PREMIUM', 'true');//g" {} \;

# Remove OFFLINE_MODE assignments
find . -name "*.js" -exec sed -i 's/OFFLINE_MODE: true,//g' {} \;
```

### Files Requiring Manual Review
These files have complex mock logic that needs manual review:

1. **`scripts/unified-context-fix.js`** (Lines 65-66, 365-366, 484-485)
2. **`scripts/dev-init-safe.js`** (Lines 22-23, 28-29, 44-45)
3. **`scripts/devmode.js`** (Lines 8, 28, 48-49) - **Keep this one for user control**
4. **`manage.js`** (Lines 37-38, 209-210)
5. **`popup.js`** (Lines 18-19)

## Phase 3: Enhanced Real API Bridge (Today - 3 hours)

### Improve Current Real API Bridge
Replace `source/scripts/real-api-bridge.js` with enhanced version:

```javascript
// Enhanced real-api-bridge.js
(function() {
    'use strict';
    
    console.log('[RealAPI] Enhanced ChatGPT integration starting...');
    
    // Improved ChatGPT detection and waiting
    function waitForChatGPT() {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                // More robust ChatGPT detection
                const isOnChatGPT = window.location.hostname.includes('chatgpt.com');
                const hasNavigation = document.querySelector('nav') || document.querySelector('[role="navigation"]');
                const hasConversations = document.querySelector('a[href*="/c/"]');
                
                if (isOnChatGPT && hasNavigation) {
                    clearInterval(checkInterval);
                    console.log('[RealAPI] ChatGPT detected and ready');
                    resolve();
                }
            }, 500);
            
            // Timeout after 10 seconds
            setTimeout(() => {
                clearInterval(checkInterval);
                console.warn('[RealAPI] ChatGPT detection timeout, proceeding anyway');
                resolve();
            }, 10000);
        });
    }
    
    // Enhanced conversation extraction with 2025 selectors
    function extractConversationsFromDOM() {
        console.log('[RealAPI] Extracting conversations with enhanced selectors...');
        
        const conversations = [];
        
        // 2025 ChatGPT selectors (more comprehensive)
        const conversationSelectors = [
            // Primary conversation links
            'nav a[href*="/c/"]',
            'aside a[href*="/c/"]',
            '[data-testid*="conversation"] a[href*="/c/"]',
            '[data-testid*="history"] a[href*="/c/"]',
            
            // New 2025 selectors
            '[data-testid="conversation-turn"] a',
            '[data-testid="chat-history"] a',
            '.conversation-item a',
            '.chat-link',
            
            // Fallback selectors
            'a[href*="chatgpt.com/c/"]',
            'a[href*="chat.openai.com/c/"]'
        ];
        
        let foundElements = [];
        
        for (const selector of conversationSelectors) {
            try {
                const elements = document.querySelectorAll(selector);
                const validElements = Array.from(elements).filter(el => {
                    const href = el.getAttribute('href');
                    return href && href.includes('/c/') && href.length > 10;
                });
                
                if (validElements.length > 0) {
                    foundElements = validElements;
                    console.log(`[RealAPI] Found ${validElements.length} conversations using: ${selector}`);
                    break;
                }
            } catch (error) {
                console.warn(`[RealAPI] Selector error: ${selector}`, error);
            }
        }
        
        // Process found elements
        foundElements.forEach((element, index) => {
            try {
                const href = element.getAttribute('href');
                const title = element.textContent?.trim() || 
                             element.getAttribute('title') || 
                             element.getAttribute('aria-label') ||
                             `Conversation ${index + 1}`;
                
                if (href && href.includes('/c/')) {
                    const conversationId = href.split('/c/')[1]?.split('?')[0]?.split('/')[0];
                    if (conversationId && conversationId.length > 10) {
                        conversations.push({
                            id: conversationId,
                            title: title,
                            url: href,
                            create_time: Date.now() / 1000 - (index * 3600),
                            update_time: Date.now() / 1000 - (index * 1800),
                            source: 'chatgpt-dom',
                            element: element
                        });
                    }
                }
            } catch (error) {
                console.warn('[RealAPI] Error processing conversation element:', error);
            }
        });
        
        console.log(`[RealAPI] Successfully extracted ${conversations.length} real conversations`);
        return conversations;
    }
    
    // Real API functions (no mocks)
    async function realGetConversations() {
        console.log('[RealAPI] Getting real ChatGPT conversations...');
        
        try {
            await waitForChatGPT();
            const conversations = extractConversationsFromDOM();
            
            if (conversations.length === 0) {
                console.warn('[RealAPI] No conversations found - user may need to navigate to ChatGPT');
                // Return empty array instead of mock data
                return [];
            }
            
            return conversations;
        } catch (error) {
            console.error('[RealAPI] Error getting conversations:', error);
            return []; // Return empty instead of mock data
        }
    }
    
    async function realGetUserFolders() {
        console.log('[RealAPI] Getting real folders from browser storage...');
        
        try {
            // Get folders from real browser storage
            const result = await chrome.storage.sync.get('ishka_folders');
            const folders = result.ishka_folders || [];
            
            // If no folders exist, create a default one
            if (folders.length === 0) {
                const defaultFolder = {
                    id: 'default-' + Date.now(),
                    name: 'All Conversations',
                    color: 'blue',
                    conversationIds: [],
                    created_at: Date.now(),
                    updated_at: Date.now(),
                    source: 'real-storage'
                };
                
                folders.push(defaultFolder);
                await chrome.storage.sync.set({ 'ishka_folders': folders });
            }
            
            console.log(`[RealAPI] Retrieved ${folders.length} real folders from storage`);
            return folders;
        } catch (error) {
            console.error('[RealAPI] Error getting folders:', error);
            return []; // Return empty instead of mock data
        }
    }
    
    async function realGetPrompts() {
        console.log('[RealAPI] Getting real prompts from browser storage...');
        
        try {
            // Get prompts from real browser storage
            const result = await chrome.storage.sync.get('ishka_prompts');
            const prompts = result.ishka_prompts || [];
            
            console.log(`[RealAPI] Retrieved ${prompts.length} real prompts from storage`);
            return prompts;
        } catch (error) {
            console.error('[RealAPI] Error getting prompts:', error);
            return []; // Return empty instead of mock data
        }
    }
    
    // Install real API functions
    function installRealAPI() {
        // Replace any existing mock functions
        window.getConversations = realGetConversations;
        window.getUserFolders = realGetUserFolders;
        window.getPrompts = realGetPrompts;
        
        // Also provide with 'real' prefix for clarity
        window.realGetConversations = realGetConversations;
        window.realGetUserFolders = realGetUserFolders;
        window.realGetPrompts = realGetPrompts;
        
        // Flag that real API is ready
        window.REAL_API_READY = true;
        window.MOCK_API_DISABLED = true;
        
        console.log('[RealAPI] ✅ Real API functions installed (no mocks)');
        
        // Test the functions immediately
        setTimeout(async () => {
            try {
                const conversations = await realGetConversations();
                const folders = await realGetUserFolders();
                const prompts = await realGetPrompts();
                
                console.log('[RealAPI] ✅ API Test Results:');
                console.log(`  - Conversations: ${conversations.length}`);
                console.log(`  - Folders: ${folders.length}`);
                console.log(`  - Prompts: ${prompts.length}`);
                
                // Notify other parts of extension
                window.dispatchEvent(new CustomEvent('realAPIReady', {
                    detail: { conversations, folders, prompts }
                }));
                
            } catch (error) {
                console.error('[RealAPI] API test failed:', error);
            }
        }, 1000);
    }
    
    // Initialize real API
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', installRealAPI);
    } else {
        installRealAPI();
    }
    
    console.log('[RealAPI] Enhanced real API bridge loaded - NO MOCKS');
})();
```

## Phase 4: Update Manifest (Today - 30 minutes)

### Remove Mock Scripts from Manifest
Edit `source/manifest.json` and remove these lines from `content_scripts.js`:

```json
// REMOVE these lines:
"api/mock-backend.js",
"scripts/manual-premium-enable.js",
"scripts/debug-console.js",
"api/localBackend.js",

// KEEP these (enhance later):
"scripts/real-api-bridge.js"
```

### Updated Manifest Content Scripts
```json
{
  "content_scripts": [
    {
      "matches": ["https://chatgpt.com/*"],
      "js": [
        "scripts/unified-context-fix.js",
        "scripts/health-check.js",
        "scripts/devmode.js",
        "html/devSettings.js",
        "scripts/content.js",
        "scripts/verify-offline.js",
        "scripts/plan-text-override.js",
        "scripts/plan-debug.js",
        "scripts/extension-details-toggle.js",
        "scripts/real-api-bridge.js"
      ],
      "run_at": "document_start"
    }
  ]
}
```

## Phase 5: Test Real Functionality (Today - 1 hour)

### Testing Steps
1. **Load the modified extension** in Chrome
2. **Navigate to ChatGPT** and open DevTools
3. **Run these tests** in console:

```javascript
// Test 1: Check if real API is loaded
console.log('Real API Ready:', window.REAL_API_READY);
console.log('Mock API Disabled:', window.MOCK_API_DISABLED);

// Test 2: Test real conversation extraction
realGetConversations().then(conversations => {
  console.log('Real conversations:', conversations.length);
  console.log('Sample conversation:', conversations[0]);
});

// Test 3: Test real folder management
realGetUserFolders().then(folders => {
  console.log('Real folders:', folders.length);
  console.log('Sample folder:', folders[0]);
});

// Test 4: Check storage
chrome.storage.sync.get(null, (data) => {
  console.log('All sync storage:', data);
});
```

## Immediate Benefits After Phase 1-5

### What Will Work Better
- **Real conversation data** from actual ChatGPT
- **Genuine folder management** using browser storage
- **No artificial delays** from mock responses
- **Cleaner console output** without mock messages

### What May Break Initially
- **Premium features** might not activate (need real detection)
- **Some UI elements** might not show if they depend on mocks
- **Test scripts** that expect mock data will fail

## Files You Can Safely Delete Today

```bash
# Safe to delete immediately:
rm source/api/mock-backend.js
rm source/api/localBackend.js
rm source/scripts/manual-premium-enable.js
rm source/scripts/debug-console.js

# Safe to delete after testing:
rm source/scripts/dev-init.js
rm source/scripts/dev-init-safe.js
rm source/scripts/verify-offline.js
```

## Quick Validation Checklist

After completing phases 1-5, verify:

- [ ] Extension loads without errors
- [ ] Real conversations are extracted from ChatGPT
- [ ] Browser storage is used for folders
- [ ] No mock responses in network tab
- [ ] Console shows "Real API Ready: true"
- [ ] No mock backend initialization messages

## Next Steps (Tomorrow)

1. **Implement real premium detection** (replace mock premium flags)
2. **Create real storage manager** (replace local storage simulation)
3. **Add real error handling** (replace mock error responses)
4. **Test with real ChatGPT Plus account** (if available)

## Emergency Rollback

If something breaks, you can quickly rollback by:

```bash
# Restore from git (if using version control)
git checkout HEAD -- source/

# Or restore specific files:
git checkout HEAD -- source/manifest.json
git checkout HEAD -- source/api/
git checkout HEAD -- source/scripts/real-api-bridge.js
```

## Expected Results

After completing these immediate steps:
- **50% reduction** in mock-related code
- **Real ChatGPT data** instead of simulated data
- **Authentic browser storage** instead of mock storage
- **Foundation** for complete mock deprecation

This gives you a solid foundation to continue with the full mock deprecation plan outlined in the main document.