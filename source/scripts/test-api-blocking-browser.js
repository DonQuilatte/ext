// Browser-based API Blocking Diagnostic Test
// This script tests if the unified context fix is blocking essential API calls

(function() {
    'use strict';
    
    console.log('🔍 [API-BLOCKING-TEST] Starting browser-based API blocking diagnosis...');
    
    let testResults = {
        passed: 0,
        failed: 0,
        blocked: 0,
        details: []
    };
    
    function logResult(testName, status, message, isBlocked = false) {
        const emoji = status ? '✅' : (isBlocked ? '🚫' : '❌');
        const statusText = status ? 'PASS' : (isBlocked ? 'BLOCKED' : 'FAIL');
        
        console.log(`🔍 [API-BLOCKING-TEST] ${emoji} ${testName}: ${statusText} - ${message}`);
        
        testResults.details.push({
            test: testName,
            status: statusText,
            message: message
        });
        
        if (status) {
            testResults.passed++;
        } else if (isBlocked) {
            testResults.blocked++;
        } else {
            testResults.failed++;
        }
    }
    
    // Test 1: Check if unified context fix is active
    function testUnifiedContextFixActive() {
        const isActive = window.unifiedContextFixActive === true;
        logResult('Unified Context Fix Active', isActive, `unifiedContextFixActive = ${window.unifiedContextFixActive}`);
        return isActive;
    }
    
    // Test 2: Test essential API endpoint blocking
    async function testEssentialAPIBlocking() {
        console.log('🔍 [API-BLOCKING-TEST] Testing essential API endpoints...');
        
        const essentialEndpoints = [
            'https://api.infi-dev.com/example-removed/folder/get',
            'https://api.infi-dev.com/example-removed/conversation/get',
            'https://api.infi-dev.com/example-removed/auth/generate-jwt'
        ];
        
        for (const endpoint of essentialEndpoints) {
            try {
                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                logResult(`Essential API ${endpoint}`, false, 'Request went through - should be blocked for diagnosis', false);
            } catch (error) {
                if (error.message.includes('UNIFIED BLOCK') || 
                    error.message.includes('BLOCKED_BY_UNIFIED_FIX') ||
                    error.message.includes('blocked')) {
                    logResult(`Essential API ${endpoint}`, false, `BLOCKED: ${error.message}`, true);
                } else {
                    logResult(`Essential API ${endpoint}`, false, `Network error: ${error.message}`, false);
                }
            }
        }
    }
    
    // Test 3: Test problematic API endpoint blocking (should be blocked)
    async function testProblematicAPIBlocking() {
        console.log('🔍 [API-BLOCKING-TEST] Testing problematic API endpoints...');
        
        const problematicEndpoints = [
            'https://api.infi-dev.com/example-removed/auth/jwks',
            'https://auth.openai.com/jwks',
            'https://api.infi-dev.com/example-removed/subscription/check'
        ];
        
        for (const endpoint of problematicEndpoints) {
            try {
                const response = await fetch(endpoint);
                logResult(`Problematic API ${endpoint}`, false, 'Request went through - should be blocked', false);
            } catch (error) {
                if (error.message.includes('UNIFIED BLOCK') || 
                    error.message.includes('BLOCKED_BY_UNIFIED_FIX') ||
                    error.message.includes('blocked')) {
                    logResult(`Problematic API ${endpoint}`, true, `Correctly blocked: ${error.message}`, true);
                } else {
                    logResult(`Problematic API ${endpoint}`, false, `Network error: ${error.message}`, false);
                }
            }
        }
    }
    
    // Test 4: Test allowed endpoints (should work)
    async function testAllowedEndpoints() {
        console.log('🔍 [API-BLOCKING-TEST] Testing allowed endpoints...');
        
        const allowedEndpoints = [
            'https://httpbin.org/get',
            'https://jsonplaceholder.typicode.com/posts/1'
        ];
        
        for (const endpoint of allowedEndpoints) {
            try {
                const response = await fetch(endpoint);
                if (response.ok || response.status < 500) {
                    logResult(`Allowed API ${endpoint}`, true, `Request successful: ${response.status}`);
                } else {
                    logResult(`Allowed API ${endpoint}`, false, `Server error: ${response.status}`, false);
                }
            } catch (error) {
                if (error.message.includes('UNIFIED BLOCK') || 
                    error.message.includes('BLOCKED_BY_UNIFIED_FIX')) {
                    logResult(`Allowed API ${endpoint}`, false, `Incorrectly blocked: ${error.message}`, true);
                } else {
                    logResult(`Allowed API ${endpoint}`, false, `Network error: ${error.message}`, false);
                }
            }
        }
    }
    
    // Test 5: Test folder retrieval function
    async function testFolderRetrieval() {
        console.log('🔍 [API-BLOCKING-TEST] Testing folder retrieval...');
        
        if (typeof window.getUserFolders === 'function') {
            try {
                const folders = await window.getUserFolders();
                if (folders && folders.length > 0) {
                    logResult('Folder Retrieval', true, `Retrieved ${folders.length} folders`);
                } else {
                    logResult('Folder Retrieval', false, 'No folders retrieved - API may be blocked', false);
                }
            } catch (error) {
                logResult('Folder Retrieval', false, `Error: ${error.message}`, false);
            }
        } else {
            logResult('Folder Retrieval', false, 'getUserFolders function not available', false);
        }
    }
    
    // Test 6: Test conversation retrieval function
    async function testConversationRetrieval() {
        console.log('🔍 [API-BLOCKING-TEST] Testing conversation retrieval...');
        
        if (typeof window.getConversations === 'function') {
            try {
                const conversations = await window.getConversations();
                if (conversations && conversations.length > 0) {
                    logResult('Conversation Retrieval', true, `Retrieved ${conversations.length} conversations`);
                } else {
                    logResult('Conversation Retrieval', false, 'No conversations retrieved - API may be blocked', false);
                }
            } catch (error) {
                logResult('Conversation Retrieval', false, `Error: ${error.message}`, false);
            }
        } else {
            logResult('Conversation Retrieval', false, 'getConversations function not available', false);
        }
    }
    
    // Run all tests
    async function runDiagnosticTests() {
        console.log('🔍 [API-BLOCKING-TEST] ==========================================');
        console.log('🔍 [API-BLOCKING-TEST] STARTING API BLOCKING DIAGNOSTIC TESTS');
        console.log('🔍 [API-BLOCKING-TEST] ==========================================');
        
        // Test unified context fix status
        const fixActive = testUnifiedContextFixActive();
        
        // Test API endpoints
        await testEssentialAPIBlocking();
        await testProblematicAPIBlocking();
        await testAllowedEndpoints();
        
        // Test core functionality
        await testFolderRetrieval();
        await testConversationRetrieval();
        
        // Results
        console.log('🔍 [API-BLOCKING-TEST] ==========================================');
        console.log('🔍 [API-BLOCKING-TEST] DIAGNOSTIC TEST RESULTS');
        console.log('🔍 [API-BLOCKING-TEST] ==========================================');
        console.log(`🔍 [API-BLOCKING-TEST] ✅ PASSED: ${testResults.passed}`);
        console.log(`🔍 [API-BLOCKING-TEST] ❌ FAILED: ${testResults.failed}`);
        console.log(`🔍 [API-BLOCKING-TEST] 🚫 BLOCKED: ${testResults.blocked}`);
        console.log(`🔍 [API-BLOCKING-TEST] 📊 TOTAL: ${testResults.passed + testResults.failed + testResults.blocked}`);
        
        // Diagnosis
        if (testResults.blocked > 0 && testResults.passed === 0) {
            console.log('🔍 [API-BLOCKING-TEST] ==========================================');
            console.log('🔍 [API-BLOCKING-TEST] 🚨 DIAGNOSIS: API BLOCKING CONFIRMED');
            console.log('🔍 [API-BLOCKING-TEST] The unified context fix is blocking essential API calls');
            console.log('🔍 [API-BLOCKING-TEST] Core functionality (folders/chats) will not work');
            console.log('🔍 [API-BLOCKING-TEST] SOLUTION: Modify blocking logic to allow essential endpoints');
            console.log('🔍 [API-BLOCKING-TEST] ==========================================');
        } else if (testResults.passed > 0 && testResults.blocked === 0) {
            console.log('🔍 [API-BLOCKING-TEST] ==========================================');
            console.log('🔍 [API-BLOCKING-TEST] ✅ DIAGNOSIS: API BLOCKING NOT ACTIVE');
            console.log('🔍 [API-BLOCKING-TEST] Essential API calls are working');
            console.log('🔍 [API-BLOCKING-TEST] Issue may be elsewhere in the system');
            console.log('🔍 [API-BLOCKING-TEST] ==========================================');
        } else {
            console.log('🔍 [API-BLOCKING-TEST] ==========================================');
            console.log('🔍 [API-BLOCKING-TEST] ⚠️ DIAGNOSIS: MIXED RESULTS');
            console.log('🔍 [API-BLOCKING-TEST] Some APIs blocked, some working - check individual results');
            console.log('🔍 [API-BLOCKING-TEST] ==========================================');
        }
        
        // Store results globally
        window.apiBlockingTestResults = testResults;
        
        return testResults;
    }
    
    // Start tests when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runDiagnosticTests);
    } else {
        runDiagnosticTests();
    }
    
    // Export test function
    window.runAPIBlockingDiagnostic = runDiagnosticTests;
    
})();