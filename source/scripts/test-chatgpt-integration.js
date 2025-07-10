// ChatGPT Integration Test - Tests core functionality with real ChatGPT
// This test focuses on the actual integration capabilities

(function() {
    'use strict';
    
    console.log('🧪 [CHATGPT-TEST] Starting ChatGPT Integration Tests...');
    
    let testResults = {
        passed: 0,
        failed: 0,
        warnings: 0,
        details: []
    };
    
    function logTest(testName, status, message, isWarning = false) {
        const emoji = status ? '✅' : (isWarning ? '⚠️' : '❌');
        const statusText = status ? 'PASS' : (isWarning ? 'WARN' : 'FAIL');
        
        console.log(`🧪 [CHATGPT-TEST] ${emoji} ${testName}: ${statusText} - ${message}`);
        
        testResults.details.push({
            test: testName,
            status: statusText,
            message: message
        });
        
        if (status) {
            testResults.passed++;
        } else if (isWarning) {
            testResults.warnings++;
        } else {
            testResults.failed++;
        }
    }
    
    // Test 1: Check if we're on ChatGPT
    function testChatGPTDetection() {
        console.log('🧪 [CHATGPT-TEST] Testing ChatGPT Detection...');
        
        const isChatGPT = window.location.hostname.includes('chatgpt.com') || 
                         window.location.hostname.includes('chat.openai.com');
        
        if (isChatGPT) {
            logTest('ChatGPT Detection', true, `Detected ChatGPT site: ${window.location.hostname}`);
        } else {
            logTest('ChatGPT Detection', false, `Not on ChatGPT site: ${window.location.hostname}`, true);
        }
        
        return isChatGPT;
    }
    
    // Test 2: Check for CORS blocking effectiveness
    function testCORSBlocking() {
        console.log('🧪 [CHATGPT-TEST] Testing CORS Blocking...');
        
        let corsBlocked = false;
        
        // Test if problematic requests are blocked
        try {
            fetch('https://api.infi-dev.com/ai-toolbox/auth/jwks?test=1')
                .then(() => {
                    logTest('CORS Blocking', false, 'CORS request went through - blocking failed');
                })
                .catch((error) => {
                    if (error.message.includes('blocked') || error.message.includes('Request blocked')) {
                        logTest('CORS Blocking', true, 'CORS request properly blocked');
                        corsBlocked = true;
                    } else {
                        logTest('CORS Blocking', false, `CORS request failed but not blocked: ${error.message}`, true);
                    }
                });
        } catch (error) {
            if (error.message.includes('blocked')) {
                logTest('CORS Blocking', true, 'CORS request blocked immediately');
                corsBlocked = true;
            } else {
                logTest('CORS Blocking', false, `Unexpected error: ${error.message}`);
            }
        }
        
        return corsBlocked;
    }
    
    // Test 3: Test Extension Context Stability
    function testExtensionContext() {
        console.log('🧪 [CHATGPT-TEST] Testing Extension Context...');
        
        try {
            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
                // Test chrome.storage access
                chrome.storage.local.get(['test'], function(result) {
                    if (chrome.runtime.lastError) {
                        logTest('Extension Context', false, `Chrome storage error: ${chrome.runtime.lastError.message}`, true);
                    } else {
                        logTest('Extension Context', true, 'Chrome extension context is stable');
                    }
                });
                
                // Test manifest access
                try {
                    const manifest = chrome.runtime.getManifest();
                    if (manifest && manifest.name === 'Ishka') {
                        logTest('Extension Manifest', true, 'Extension manifest accessible and correct');
                    } else {
                        logTest('Extension Manifest', false, 'Extension manifest incorrect or inaccessible', true);
                    }
                } catch (error) {
                    logTest('Extension Manifest', false, `Manifest access error: ${error.message}`, true);
                }
                
                return true;
            } else {
                logTest('Extension Context', false, 'Chrome extension context not available');
                return false;
            }
        } catch (error) {
            logTest('Extension Context', false, `Extension context error: ${error.message}`);
            return false;
        }
    }
    
    // Test 4: Test Real API Bridge
    function testRealAPIBridge() {
        console.log('🧪 [CHATGPT-TEST] Testing Real API Bridge...');
        
        // Check if real API functions exist
        const realAPIFunctions = ['realGetConversations', 'realGetUserFolders', 'realGetPrompts'];
        let functionsFound = 0;
        
        realAPIFunctions.forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                logTest(`Real API ${funcName}`, true, `${funcName} function is available`);
                functionsFound++;
            } else {
                logTest(`Real API ${funcName}`, false, `${funcName} function not found`);
            }
        });
        
        // Test actual conversation extraction
        if (typeof window.realGetConversations === 'function') {
            setTimeout(async () => {
                try {
                    console.log('🧪 [CHATGPT-TEST] Testing conversation extraction...');
                    const conversations = await window.realGetConversations();
                    
                    if (conversations && conversations.length > 0) {
                        logTest('Conversation Extraction', true, `Successfully extracted ${conversations.length} conversations`);
                        
                        // Test conversation structure
                        const firstConv = conversations[0];
                        if (firstConv.id && firstConv.title) {
                            logTest('Conversation Structure', true, `Conversation has proper structure: ${firstConv.title}`);
                        } else {
                            logTest('Conversation Structure', false, 'Conversation missing required fields', true);
                        }
                    } else {
                        logTest('Conversation Extraction', false, 'No conversations extracted - may need to be on ChatGPT with conversations', true);
                    }
                } catch (error) {
                    logTest('Conversation Extraction', false, `Error extracting conversations: ${error.message}`);
                }
            }, 2000);
        }
        
        return functionsFound === realAPIFunctions.length;
    }
    
    // Test 5: Test DOM Integration
    function testDOMIntegration() {
        console.log('🧪 [CHATGPT-TEST] Testing DOM Integration...');
        
        // Check for ChatGPT UI elements
        const chatGPTSelectors = [
            'nav',
            'aside',
            '[role="navigation"]',
            '[data-testid*="conversation"]',
            'main',
            '[role="main"]'
        ];
        
        let elementsFound = 0;
        chatGPTSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                logTest(`DOM Element ${selector}`, true, `Found ${elements.length} elements`);
                elementsFound++;
            } else {
                logTest(`DOM Element ${selector}`, false, `No elements found for ${selector}`, true);
            }
        });
        
        // Check for conversation links specifically
        const conversationLinks = document.querySelectorAll('a[href*="/c/"]');
        if (conversationLinks.length > 0) {
            logTest('Conversation Links', true, `Found ${conversationLinks.length} conversation links in DOM`);
        } else {
            logTest('Conversation Links', false, 'No conversation links found in DOM - user may need conversations', true);
        }
        
        return elementsFound > 0;
    }
    
    // Test 6: Test Premium Feature Integration
    function testPremiumIntegration() {
        console.log('🧪 [CHATGPT-TEST] Testing Premium Feature Integration...');
        
        // Check premium status
        const premiumChecks = [
            { key: 'DEV_MODE_PREMIUM', expected: true },
            { key: 'isPremiumUser', expected: true },
            { key: 'userPlan', expected: 'premium' },
            { key: 'subscriptionStatus', expected: 'active' }
        ];
        
        let premiumActive = true;
        premiumChecks.forEach(check => {
            const value = window[check.key];
            if (value === check.expected) {
                logTest(`Premium ${check.key}`, true, `${check.key} is correctly set to ${value}`);
            } else {
                logTest(`Premium ${check.key}`, false, `${check.key} is ${value}, expected ${check.expected}`);
                premiumActive = false;
            }
        });
        
        // Test premium functions
        const premiumFunctions = ['getConversations', 'getUserFolders', 'getPrompts'];
        premiumFunctions.forEach(funcName => {
            if (typeof window[funcName] === 'function') {
                logTest(`Premium Function ${funcName}`, true, `${funcName} is available`);
            } else {
                logTest(`Premium Function ${funcName}`, false, `${funcName} not available`, true);
            }
        });
        
        return premiumActive;
    }
    
    // Test 7: Test Error Suppression
    function testErrorSuppression() {
        console.log('🧪 [CHATGPT-TEST] Testing Error Suppression...');
        
        // Check if error handlers are installed
        const hasWindowError = typeof window.onerror === 'function';
        const hasUnhandledRejection = window.onunhandledrejection !== null;
        
        logTest('Global Error Handler', hasWindowError, hasWindowError ? 'Global error handler installed' : 'No global error handler');
        logTest('Promise Rejection Handler', hasUnhandledRejection, hasUnhandledRejection ? 'Promise rejection handler installed' : 'No promise rejection handler');
        
        // Test that console.error is overridden
        const originalConsoleError = console.error.toString();
        const isOverridden = !originalConsoleError.includes('[native code]');
        
        logTest('Console Error Override', isOverridden, isOverridden ? 'Console.error is overridden for filtering' : 'Console.error not overridden');
        
        return hasWindowError && hasUnhandledRejection && isOverridden;
    }
    
    // Run all tests
    function runChatGPTTests() {
        console.log('🧪 [CHATGPT-TEST] ==========================================');
        console.log('🧪 [CHATGPT-TEST] STARTING CHATGPT INTEGRATION TESTS');
        console.log('🧪 [CHATGPT-TEST] ==========================================');
        
        const isChatGPT = testChatGPTDetection();
        const corsBlocked = testCORSBlocking();
        const contextStable = testExtensionContext();
        const realAPIWorking = testRealAPIBridge();
        const domIntegrated = testDOMIntegration();
        const premiumActive = testPremiumIntegration();
        const errorsSupressed = testErrorSuppression();
        
        // Final results after delay for async tests
        setTimeout(() => {
            console.log('🧪 [CHATGPT-TEST] ==========================================');
            console.log('🧪 [CHATGPT-TEST] CHATGPT INTEGRATION TEST RESULTS');
            console.log('🧪 [CHATGPT-TEST] ==========================================');
            console.log(`🧪 [CHATGPT-TEST] ✅ PASSED: ${testResults.passed}`);
            console.log(`🧪 [CHATGPT-TEST] ❌ FAILED: ${testResults.failed}`);
            console.log(`🧪 [CHATGPT-TEST] ⚠️  WARNINGS: ${testResults.warnings}`);
            console.log(`🧪 [CHATGPT-TEST] 📊 TOTAL TESTS: ${testResults.passed + testResults.failed + testResults.warnings}`);
            
            const criticalTests = [contextStable, errorsSupressed];
            const functionalTests = [realAPIWorking, premiumActive];
            
            if (criticalTests.every(test => test)) {
                console.log('🧪 [CHATGPT-TEST] ==========================================');
                console.log('🧪 [CHATGPT-TEST] 🎉 CRITICAL SYSTEMS WORKING!');
                console.log('🧪 [CHATGPT-TEST] Extension core functionality is operational');
                
                if (functionalTests.every(test => test)) {
                    console.log('🧪 [CHATGPT-TEST] 🚀 ALL SYSTEMS FULLY OPERATIONAL!');
                    console.log('🧪 [CHATGPT-TEST] ChatGPT integration is working perfectly');
                } else {
                    console.log('🧪 [CHATGPT-TEST] ⚠️  Some functional features need attention');
                }
                
                console.log('🧪 [CHATGPT-TEST] ==========================================');
            } else {
                console.log('🧪 [CHATGPT-TEST] ==========================================');
                console.log('🧪 [CHATGPT-TEST] ❌ CRITICAL ISSUES DETECTED');
                console.log('🧪 [CHATGPT-TEST] Extension needs fixes before use');
                console.log('🧪 [CHATGPT-TEST] ==========================================');
            }
            
            // Store results globally
            window.chatGPTTestResults = testResults;
            
        }, 5000);
    }
    
    // Start tests
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runChatGPTTests);
    } else {
        runChatGPTTests();
    }
    
    // Also run when page changes
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(runChatGPTTests, 2000);
        }
    }).observe(document, { subtree: true, childList: true });
    
})();