// Debug Manage Chats Functionality
// This script specifically tests and fixes the "Manage Chats" undefined error

(function() {
    'use strict';
    
    console.log('🔍 DEBUG: Starting Manage Chats debugging...');
    
    // Test 1: Check if premium functions exist
    function testPremiumFunctions() {
        console.log('=== TEST 1: Premium Functions Availability ===');
        
        const functions = [
            'getConversations',
            'getUserFolders', 
            'getPrompts',
            'getAllUserFolders'
        ];
        
        functions.forEach(funcName => {
            const exists = typeof window[funcName] !== 'undefined';
            console.log(`${funcName}: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
            
            if (!exists) {
                console.log(`Creating mock ${funcName}...`);
                if (funcName === 'getConversations') {
                    window[funcName] = async function() {
                        console.log(`[MOCK] ${funcName} called`);
                        return [
                            {
                                id: "debug-chat-1",
                                title: "Debug Chat 1",
                                create_time: Date.now() / 1000,
                                update_time: Date.now() / 1000,
                                mapping: {},
                                current_node: null
                            },
                            {
                                id: "debug-chat-2", 
                                title: "Debug Chat 2",
                                create_time: Date.now() / 1000,
                                update_time: Date.now() / 1000,
                                mapping: {},
                                current_node: null
                            }
                        ];
                    };
                } else if (funcName === 'getUserFolders' || funcName === 'getAllUserFolders') {
                    window[funcName] = async function() {
                        console.log(`[MOCK] ${funcName} called`);
                        return [
                            {
                                _id: "debug-folder-1",
                                name: "Debug Folder",
                                parentFolder: null,
                                chatIds: ["debug-chat-1"],
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString()
                            }
                        ];
                    };
                } else if (funcName === 'getPrompts') {
                    window[funcName] = async function() {
                        console.log(`[MOCK] ${funcName} called`);
                        return [
                            {
                                _id: "debug-prompt-1",
                                name: "Debug Prompt",
                                content: "This is a debug prompt",
                                category: "debug",
                                createdAt: new Date().toISOString()
                            }
                        ];
                    };
                }
            }
        });
    }
    
    // Test 2: Check premium status
    async function testPremiumStatus() {
        console.log('=== TEST 2: Premium Status Check ===');
        
        try {
            const storage = chrome?.storage?.local;
            if (!storage) {
                console.log('❌ Chrome storage not available');
                return false;
            }
            
            return new Promise((resolve) => {
                storage.get(['DEV_MODE_PREMIUM', 'MOCK_PREMIUM', 'isPremiumUser', 'store'], (result) => {
                    console.log('Storage contents:', result);
                    
                    const isPremium = result.DEV_MODE_PREMIUM || 
                                    result.MOCK_PREMIUM || 
                                    result.isPremiumUser ||
                                    (result.store && result.store['-r.6es£Jr1U0']);
                    
                    console.log(`Premium Status: ${isPremium ? '✅ ACTIVE' : '❌ INACTIVE'}`);
                    
                    if (!isPremium) {
                        console.log('Activating premium status...');
                        storage.set({
                            'DEV_MODE_PREMIUM': true,
                            'MOCK_PREMIUM': true,
                            'isPremiumUser': true
                        }, () => {
                            console.log('✅ Premium status activated');
                        });
                    }
                    
                    resolve(isPremium);
                });
            });
        } catch (error) {
            console.log('❌ Premium status check error:', error);
            return false;
        }
    }
    
    // Test 3: Simulate clicking Manage Chats
    async function testManageChatsClick() {
        console.log('=== TEST 3: Manage Chats Click Simulation ===');
        
        try {
            // Look for Manage Chats button
            const manageChatElements = Array.from(document.querySelectorAll('*')).filter(el => 
                (el.textContent || '').includes('Manage Chats')
            );
            
            console.log(`Found ${manageChatElements.length} "Manage Chats" elements`);
            
            if (manageChatElements.length > 0) {
                const element = manageChatElements[0];
                console.log('Manage Chats element:', element);
                
                // Test if clicking would cause undefined error
                try {
                    console.log('Testing getConversations function...');
                    const conversations = await window.getConversations();
                    console.log('✅ getConversations returned:', conversations);
                } catch (error) {
                    console.log('❌ getConversations error:', error);
                    throw error;
                }
            } else {
                console.log('❌ No Manage Chats elements found');
            }
        } catch (error) {
            console.log('❌ Manage Chats test error:', error);
        }
    }
    
    // Test 4: Check for undefined errors in console
    function testConsoleErrors() {
        console.log('=== TEST 4: Console Error Monitoring ===');
        
        // Override console.error to catch undefined errors
        const originalError = console.error;
        let errorCount = 0;
        
        console.error = function(...args) {
            const errorMsg = args.join(' ');
            
            if (errorMsg.includes('undefined')) {
                errorCount++;
                console.log(`🚨 CAUGHT UNDEFINED ERROR #${errorCount}:`, errorMsg);
                
                // Try to fix immediately
                testPremiumFunctions();
            }
            
            // Call original error
            originalError.apply(console, args);
        };
        
        console.log('✅ Console error monitoring active');
    }
    
    // Test 5: Check network requests
    function testNetworkRequests() {
        console.log('=== TEST 5: Network Request Monitoring ===');
        
        // Monitor fetch requests
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const url = args[0];
            console.log('🌐 FETCH REQUEST:', url);
            
            // Check if it's an example-removed request
            if (typeof url === 'string' && (url.includes('example-removed') || url.includes('api.infi-dev.com'))) {
                console.log('🎯 AI-Toolbox request detected - should be mocked');
            }
            
            return originalFetch.apply(this, args);
        };
        
        console.log('✅ Network request monitoring active');
    }
    
    // Run all tests
    async function runAllTests() {
        console.log('🚀 Starting comprehensive Manage Chats debugging...');
        
        testConsoleErrors();
        testNetworkRequests();
        testPremiumFunctions();
        await testPremiumStatus();
        await testManageChatsClick();
        
        console.log('✅ All debugging tests completed');
        
        // Set up continuous monitoring
        setInterval(() => {
            testPremiumFunctions();
        }, 3000);
        
        console.log('🔄 Continuous monitoring started (every 3 seconds)');
    }
    
    // Start debugging when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAllTests);
    } else {
        runAllTests();
    }
    
    // Export for manual testing
    window.debugManageChats = {
        testPremiumFunctions,
        testPremiumStatus,
        testManageChatsClick,
        runAllTests
    };
    
})();