// Test Real API Integration Script
// Tests that real ChatGPT data is being loaded correctly

(function() {
    'use strict';
    
    console.log('🧪 Testing Real API Integration...');
    
    // Test function to verify real API is working
    async function testRealAPI() {
        console.log('[TestAPI] Starting real API tests...');
        
        // Wait for APIs to be available
        let attempts = 0;
        const maxAttempts = 50;
        
        while (attempts < maxAttempts) {
            if (window.realGetConversations && window.realGetUserFolders && window.realGetPrompts && window.REAL_API_READY) {
                console.log('[TestAPI] ✅ Real API functions found!');
                break;
            }
            
            attempts++;
            console.log(`[TestAPI] Waiting for real API... (${attempts}/${maxAttempts})`);
            console.log(`[TestAPI] Status: realGetConversations=${!!window.realGetConversations}, realGetUserFolders=${!!window.realGetUserFolders}, realGetPrompts=${!!window.realGetPrompts}, REAL_API_READY=${!!window.REAL_API_READY}`);
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        if (attempts >= maxAttempts) {
            console.error('[TestAPI] ❌ Real API functions not found after waiting');
            console.error('[TestAPI] Final status:', {
                realGetConversations: !!window.realGetConversations,
                realGetUserFolders: !!window.realGetUserFolders,
                realGetPrompts: !!window.realGetPrompts,
                REAL_API_READY: !!window.REAL_API_READY,
                location: window.location.href
            });
            return false;
        }
        
        // Test real conversations
        try {
            console.log('[TestAPI] Testing real conversations...');
            const conversations = await window.realGetConversations();
            console.log('[TestAPI] ✅ Real conversations loaded:', conversations.length, 'conversations');
            console.log('[TestAPI] Sample conversation:', conversations[0]);
        } catch (error) {
            console.error('[TestAPI] ❌ Error loading real conversations:', error);
        }
        
        // Test real folders
        try {
            console.log('[TestAPI] Testing real folders...');
            const folders = await window.realGetUserFolders();
            console.log('[TestAPI] ✅ Real folders loaded:', folders.length, 'folders');
            console.log('[TestAPI] Sample folder:', folders[0]);
        } catch (error) {
            console.error('[TestAPI] ❌ Error loading real folders:', error);
        }
        
        // Test real prompts
        try {
            console.log('[TestAPI] Testing real prompts...');
            const prompts = await window.realGetPrompts();
            console.log('[TestAPI] ✅ Real prompts loaded:', prompts.length, 'prompts');
            console.log('[TestAPI] Sample prompt:', prompts[0]);
        } catch (error) {
            console.error('[TestAPI] ❌ Error loading real prompts:', error);
        }
        
        // Test that extension API functions are properly mapped
        try {
            console.log('[TestAPI] Testing extension API mapping...');
            
            if (typeof window.getConversations === 'function') {
                const extConversations = await window.getConversations();
                console.log('[TestAPI] ✅ Extension getConversations works:', extConversations.length, 'conversations');
            } else {
                console.error('[TestAPI] ❌ Extension getConversations not found');
            }
            
            if (typeof window.getUserFolders === 'function') {
                const extFolders = await window.getUserFolders();
                console.log('[TestAPI] ✅ Extension getUserFolders works:', extFolders.length, 'folders');
            } else {
                console.error('[TestAPI] ❌ Extension getUserFolders not found');
            }
            
            if (typeof window.getPrompts === 'function') {
                const extPrompts = await window.getPrompts();
                console.log('[TestAPI] ✅ Extension getPrompts works:', extPrompts.length, 'prompts');
            } else {
                console.error('[TestAPI] ❌ Extension getPrompts not found');
            }
            
        } catch (error) {
            console.error('[TestAPI] ❌ Error testing extension API mapping:', error);
        }
        
        console.log('[TestAPI] 🎉 Real API integration test completed!');
        return true;
    }
    
    // Monitor for premium feature clicks and test real data
    function monitorPremiumClicks() {
        document.addEventListener('click', async function(event) {
            const target = event.target;
            const text = target.textContent || target.innerText || '';
            
            if (text.includes('Manage Chats') || 
                text.includes('Manage Folders') || 
                text.includes('Manage Prompts')) {
                
                console.log('[TestAPI] 🎯 Premium feature clicked:', text);
                console.log('[TestAPI] Testing real data availability...');
                
                // Wait a moment for the feature to initialize
                setTimeout(async () => {
                    await testRealAPI();
                }, 1000);
            }
        });
    }
    
    // Initialize testing
    function init() {
        console.log('[TestAPI] Initializing real API testing...');
        
        monitorPremiumClicks();
        
        // Run initial test after a delay
        setTimeout(async () => {
            console.log('[TestAPI] Running initial real API test...');
            await testRealAPI();
        }, 3000);
        
        // Make test function available globally
        window.testRealAPI = testRealAPI;
        
        console.log('[TestAPI] ✅ Real API testing initialized');
        console.log('[TestAPI] 💡 You can manually run tests with: window.testRealAPI()');
    }
    
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();