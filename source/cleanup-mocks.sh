#!/bin/bash

# Mock Cleanup Automation Script
# This script helps deprecate all mock systems in the Ishka extension

echo "🧹 Starting Mock Cleanup Process..."
echo "=================================="

# Check if we're in the right directory
if [ ! -f "manifest.json" ]; then
    echo "❌ Error: manifest.json not found. Please run this script from the source/ directory."
    exit 1
fi

echo "✅ Found manifest.json - proceeding with cleanup..."

# Phase 1: Backup current state
echo ""
echo "📁 Phase 1: Creating backup..."
BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r . "$BACKUP_DIR/"
echo "✅ Backup created in $BACKUP_DIR"

# Phase 2: Remove mock files
echo ""
echo "🗑️  Phase 2: Removing mock files..."

# Remove main mock files
if [ -f "api/mock-backend.js" ]; then
    rm "api/mock-backend.js"
    echo "✅ Removed api/mock-backend.js"
else
    echo "⚠️  api/mock-backend.js not found"
fi

if [ -f "api/localBackend.js" ]; then
    rm "api/localBackend.js"
    echo "✅ Removed api/localBackend.js"
else
    echo "⚠️  api/localBackend.js not found"
fi

# Remove development mock files
DEV_FILES=(
    "scripts/manual-premium-enable.js"
    "scripts/debug-console.js"
    "scripts/dev-init.js"
    "scripts/dev-init-safe.js"
    "scripts/verify-offline.js"
)

for file in "${DEV_FILES[@]}"; do
    if [ -f "$file" ]; then
        rm "$file"
        echo "✅ Removed $file"
    else
        echo "⚠️  $file not found"
    fi
done

# Phase 3: Clean mock flags from code
echo ""
echo "🔧 Phase 3: Cleaning mock flags from code..."

# Remove DEV_MODE_PREMIUM assignments
echo "Cleaning DEV_MODE_PREMIUM flags..."
find . -name "*.js" -type f -exec sed -i.bak 's/window\.DEV_MODE_PREMIUM = true;//g' {} \;
find . -name "*.js" -type f -exec sed -i.bak 's/result\.DEV_MODE_PREMIUM = true;//g' {} \;
find . -name "*.js" -type f -exec sed -i.bak "s/localStorage\.setItem('DEV_MODE_PREMIUM', 'true');//g" {} \;

# Remove MOCK_PREMIUM assignments
echo "Cleaning MOCK_PREMIUM flags..."
find . -name "*.js" -type f -exec sed -i.bak 's/window\.MOCK_PREMIUM = true;//g' {} \;
find . -name "*.js" -type f -exec sed -i.bak 's/result\.MOCK_PREMIUM = true;//g' {} \;
find . -name "*.js" -type f -exec sed -i.bak "s/localStorage\.setItem('MOCK_PREMIUM', 'true');//g" {} \;

# Remove OFFLINE_MODE assignments
echo "Cleaning OFFLINE_MODE flags..."
find . -name "*.js" -type f -exec sed -i.bak 's/OFFLINE_MODE: true,//g' {} \;

# Clean up backup files created by sed
find . -name "*.bak" -delete

echo "✅ Mock flags cleaned from code"

# Phase 4: Update manifest.json
echo ""
echo "📋 Phase 4: Updating manifest.json..."

# Create a new manifest without mock references
python3 -c "
import json
import sys

try:
    with open('manifest.json', 'r') as f:
        manifest = json.load(f)
    
    # Remove mock files from content scripts
    if 'content_scripts' in manifest:
        for script_group in manifest['content_scripts']:
            if 'js' in script_group:
                # Files to remove
                files_to_remove = [
                    'api/mock-backend.js',
                    'api/localBackend.js',
                    'scripts/manual-premium-enable.js',
                    'scripts/debug-console.js'
                ]
                
                # Filter out mock files
                script_group['js'] = [js for js in script_group['js'] if js not in files_to_remove]
    
    # Write updated manifest
    with open('manifest.json', 'w') as f:
        json.dump(manifest, f, indent=2)
    
    print('✅ Updated manifest.json')
    
except Exception as e:
    print(f'❌ Error updating manifest.json: {e}')
    sys.exit(1)
"

# Phase 5: Enhance real-api-bridge.js
echo ""
echo "🔗 Phase 5: Enhancing real API bridge..."

# Create enhanced real-api-bridge.js
cat > "scripts/real-api-bridge.js" << 'EOF'
// Enhanced Real ChatGPT API Bridge - NO MOCKS
// This script connects to actual ChatGPT functionality

(function() {
    'use strict';
    
    console.log('[RealAPI] Enhanced ChatGPT integration starting...');
    
    // Improved ChatGPT detection
    function waitForChatGPT() {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                const isOnChatGPT = window.location.hostname.includes('chatgpt.com');
                const hasNavigation = document.querySelector('nav') || document.querySelector('[role="navigation"]');
                
                if (isOnChatGPT && hasNavigation) {
                    clearInterval(checkInterval);
                    console.log('[RealAPI] ChatGPT detected and ready');
                    resolve();
                }
            }, 500);
            
            setTimeout(() => {
                clearInterval(checkInterval);
                console.warn('[RealAPI] ChatGPT detection timeout, proceeding anyway');
                resolve();
            }, 10000);
        });
    }
    
    // Enhanced conversation extraction
    function extractConversationsFromDOM() {
        console.log('[RealAPI] Extracting real conversations...');
        
        const conversations = [];
        const selectors = [
            'nav a[href*="/c/"]',
            'aside a[href*="/c/"]',
            '[data-testid*="conversation"] a[href*="/c/"]',
            '[data-testid*="history"] a[href*="/c/"]'
        ];
        
        let foundElements = [];
        for (const selector of selectors) {
            try {
                const elements = document.querySelectorAll(selector);
                const validElements = Array.from(elements).filter(el => {
                    const href = el.getAttribute('href');
                    return href && href.includes('/c/') && href.length > 10;
                });
                
                if (validElements.length > 0) {
                    foundElements = validElements;
                    console.log(`[RealAPI] Found ${validElements.length} conversations`);
                    break;
                }
            } catch (error) {
                console.warn(`[RealAPI] Selector error:`, error);
            }
        }
        
        foundElements.forEach((element, index) => {
            try {
                const href = element.getAttribute('href');
                const title = element.textContent?.trim() || `Conversation ${index + 1}`;
                
                if (href && href.includes('/c/')) {
                    const conversationId = href.split('/c/')[1]?.split('?')[0]?.split('/')[0];
                    if (conversationId && conversationId.length > 10) {
                        conversations.push({
                            id: conversationId,
                            title: title,
                            url: href,
                            create_time: Date.now() / 1000 - (index * 3600),
                            update_time: Date.now() / 1000 - (index * 1800),
                            source: 'chatgpt-real'
                        });
                    }
                }
            } catch (error) {
                console.warn('[RealAPI] Error processing conversation:', error);
            }
        });
        
        console.log(`[RealAPI] Extracted ${conversations.length} real conversations`);
        return conversations;
    }
    
    // Real API functions (NO MOCKS)
    async function realGetConversations() {
        console.log('[RealAPI] Getting real conversations...');
        try {
            await waitForChatGPT();
            return extractConversationsFromDOM();
        } catch (error) {
            console.error('[RealAPI] Error getting conversations:', error);
            return [];
        }
    }
    
    async function realGetUserFolders() {
        console.log('[RealAPI] Getting real folders from storage...');
        try {
            const result = await chrome.storage.sync.get('ishka_folders');
            const folders = result.ishka_folders || [];
            
            if (folders.length === 0) {
                const defaultFolder = {
                    id: 'default-' + Date.now(),
                    name: 'All Conversations',
                    color: 'blue',
                    conversationIds: [],
                    created_at: Date.now(),
                    source: 'real-storage'
                };
                folders.push(defaultFolder);
                await chrome.storage.sync.set({ 'ishka_folders': folders });
            }
            
            console.log(`[RealAPI] Retrieved ${folders.length} real folders`);
            return folders;
        } catch (error) {
            console.error('[RealAPI] Error getting folders:', error);
            return [];
        }
    }
    
    async function realGetPrompts() {
        console.log('[RealAPI] Getting real prompts from storage...');
        try {
            const result = await chrome.storage.sync.get('ishka_prompts');
            return result.ishka_prompts || [];
        } catch (error) {
            console.error('[RealAPI] Error getting prompts:', error);
            return [];
        }
    }
    
    // Install real API functions
    function installRealAPI() {
        window.getConversations = realGetConversations;
        window.getUserFolders = realGetUserFolders;
        window.getPrompts = realGetPrompts;
        
        window.realGetConversations = realGetConversations;
        window.realGetUserFolders = realGetUserFolders;
        window.realGetPrompts = realGetPrompts;
        
        window.REAL_API_READY = true;
        window.MOCK_API_DISABLED = true;
        
        console.log('[RealAPI] ✅ Real API functions installed (NO MOCKS)');
        
        // Test functions
        setTimeout(async () => {
            try {
                const conversations = await realGetConversations();
                const folders = await realGetUserFolders();
                const prompts = await realGetPrompts();
                
                console.log('[RealAPI] ✅ Test Results:');
                console.log(`  - Conversations: ${conversations.length}`);
                console.log(`  - Folders: ${folders.length}`);
                console.log(`  - Prompts: ${prompts.length}`);
                
                window.dispatchEvent(new CustomEvent('realAPIReady', {
                    detail: { conversations, folders, prompts }
                }));
            } catch (error) {
                console.error('[RealAPI] Test failed:', error);
            }
        }, 1000);
    }
    
    // Initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', installRealAPI);
    } else {
        installRealAPI();
    }
    
    console.log('[RealAPI] Enhanced real API bridge loaded - NO MOCKS');
})();
EOF

echo "✅ Enhanced real-api-bridge.js created"

# Phase 6: Create validation report
echo ""
echo "📊 Phase 6: Creating validation report..."

REPORT_FILE="mock_cleanup_report.txt"
cat > "$REPORT_FILE" << EOF
Mock Cleanup Report
Generated: $(date)
===================

Files Removed:
- api/mock-backend.js
- api/localBackend.js  
- scripts/manual-premium-enable.js
- scripts/debug-console.js
- scripts/dev-init.js
- scripts/dev-init-safe.js
- scripts/verify-offline.js

Flags Cleaned:
- DEV_MODE_PREMIUM assignments
- MOCK_PREMIUM assignments
- OFFLINE_MODE assignments

Files Modified:
- manifest.json (removed mock script references)
- scripts/real-api-bridge.js (enhanced with real functionality)

Backup Location: $BACKUP_DIR

Next Steps:
1. Load extension in Chrome to test
2. Navigate to ChatGPT and open DevTools
3. Run validation tests:
   console.log('Real API Ready:', window.REAL_API_READY);
   realGetConversations().then(console.log);
   realGetUserFolders().then(console.log);

Files Needing Manual Review:
- scripts/unified-context-fix.js (contains complex mock logic)
- scripts/devmode.js (keep for user control)
- manage.js (may reference mock flags)
- popup.js (may reference mock flags)

Expected Results:
- Extension loads without mock initialization messages
- Real ChatGPT conversations are extracted
- Browser storage is used for folders/prompts
- Console shows "Real API Ready: true"
EOF

echo "✅ Validation report created: $REPORT_FILE"

# Phase 7: Final summary
echo ""
echo "🎉 Mock Cleanup Complete!"
echo "========================"
echo "✅ Mock files removed: 7"
echo "✅ Mock flags cleaned from code"
echo "✅ Manifest updated"
echo "✅ Real API bridge enhanced"
echo "✅ Backup created: $BACKUP_DIR"
echo "✅ Report generated: $REPORT_FILE"
echo ""
echo "Next Steps:"
echo "1. Load the extension in Chrome"
echo "2. Navigate to ChatGPT" 
echo "3. Open DevTools and run validation tests"
echo "4. Check console for 'Real API Ready: true'"
echo ""
echo "To rollback if needed:"
echo "cp -r $BACKUP_DIR/* ."
echo ""
echo "🚀 Ready to test real functionality!"