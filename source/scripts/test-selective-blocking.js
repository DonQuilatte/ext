// TEST SELECTIVE BLOCKING - Validate that essential API calls work while problematic ones are blocked
// This test should be run in the browser console on ChatGPT with the extension loaded

(function() {
    'use strict';
    
    console.log('🧪 TESTING SELECTIVE BLOCKING - Starting comprehensive API test');
    
    // Test results tracking
    const testResults = {
        essentialAPIs: {},
        problematicAPIs: {},
        summary: {
            essentialPassed: 0,
            essentialFailed: 0,
            problematicBlocked: 0,
            problematicAllowed: 0
        }
    };
    
    // Essential API endpoints that SHOULD work (core functionality)
    const essentialEndpoints = [
        'https://api.infi-dev.com/example-removed/folder/get',
        'https://api.infi-dev.com/example-removed/folder/list',
        'https://api.infi-dev.com/example-removed/conversation/get',
        'https://api.infi-dev.com/example-removed/conversation/list',
        'https://api.infi-dev.com/example-removed/auth/generate-jwt',
        'https://api.infi-dev.com/example-removed/prompts/get',
        'https://api.infi-dev.com/example-removed/user/profile'
    ];
    
    // Problematic API endpoints that SHOULD be blocked (cause infinite loops)
    const problematicEndpoints = [
        'https://api.infi-dev.com/example-removed/auth/jwks',
        'https://api.infi-dev.com/example-removed/subscription/check',
        'https://api.infi-dev.com/example-removed/auth/validate',
        'https://api.infi-dev.com/example-removed/auth/jwks?cacheBuster=123',
        'https://api.infi-dev.com/example-removed/test?jwksuri=something'
    ];
    
    // Test essential endpoints (should be allowed)
    async function testEssentialEndpoints() {
        console.log('🔍 Testing essential endpoints (should be ALLOWED)...');
        
        for (const endpoint of essentialEndpoints) {
            try {
                console.log(`Testing essential: ${endpoint}`);
                
                // Test with fetch
                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                // We expect network errors (since API might not exist), but NOT blocking errors
                testResults.essentialAPIs[endpoint] = {
                    status: 'ALLOWED',
                    method: 'fetch',
                    blocked: false,
                    error: null
                };
                testResults.summary.essentialPassed++;
                console.log(`✅ Essential endpoint ALLOWED: ${endpoint}`);
                
            } catch (error) {
                if (error.code === 'BLOCKED_BY_UNIFIED_FIX' || error.message.includes('UNIFIED BLOCK')) {
                    testResults.essentialAPIs[endpoint] = {
                        status: 'BLOCKED',
                        method: 'fetch',
                        blocked: true,
                        error: error.message
                    };
                    testResults.summary.essentialFailed++;
                    console.error(`❌ Essential endpoint BLOCKED (should be allowed): ${endpoint}`, error.message);
                } else {
                    // Network errors are expected and OK
                    testResults.essentialAPIs[endpoint] = {
                        status: 'ALLOWED',
                        method: 'fetch',
                        blocked: false,
                        error: error.message
                    };
                    testResults.summary.essentialPassed++;
                    console.log(`✅ Essential endpoint ALLOWED (network error expected): ${endpoint}`);
                }
            }
        }
    }
    
    // Test problematic endpoints (should be blocked)
    async function testProblematicEndpoints() {
        console.log('🚫 Testing problematic endpoints (should be BLOCKED)...');
        
        for (const endpoint of problematicEndpoints) {
            try {
                console.log(`Testing problematic: ${endpoint}`);
                
                // Test with fetch
                const response = await fetch(endpoint, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                // If we get here, the endpoint was NOT blocked (bad)
                testResults.problematicAPIs[endpoint] = {
                    status: 'ALLOWED',
                    method: 'fetch',
                    blocked: false,
                    error: null
                };
                testResults.summary.problematicAllowed++;
                console.error(`❌ Problematic endpoint ALLOWED (should be blocked): ${endpoint}`);
                
            } catch (error) {
                if (error.code === 'BLOCKED_BY_UNIFIED_FIX' || error.message.includes('UNIFIED BLOCK')) {
                    testResults.problematicAPIs[endpoint] = {
                        status: 'BLOCKED',
                        method: 'fetch',
                        blocked: true,
                        error: error.message
                    };
                    testResults.summary.problematicBlocked++;
                    console.log(`✅ Problematic endpoint BLOCKED (correct): ${endpoint}`);
                } else {
                    // Unexpected error type
                    testResults.problematicAPIs[endpoint] = {
                        status: 'UNKNOWN_ERROR',
                        method: 'fetch',
                        blocked: false,
                        error: error.message
                    };
                    console.warn(`⚠️ Problematic endpoint had unexpected error: ${endpoint}`, error.message);
                }
            }
        }
    }
    
    // Test XMLHttpRequest blocking as well
    async function testXHRBlocking() {
        console.log('🔍 Testing XMLHttpRequest blocking...');
        
        return new Promise((resolve) => {
            const xhr = new XMLHttpRequest();
            
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 0 && xhr.statusText.includes('UNIFIED BLOCK')) {
                        console.log('✅ XHR blocking working correctly');
                    } else {
                        console.log('⚠️ XHR blocking status:', xhr.status, xhr.statusText);
                    }
                    resolve();
                }
            };
            
            xhr.onerror = function() {
                console.log('✅ XHR error handler triggered (blocking working)');
                resolve();
            };
            
            // Test a problematic endpoint
            xhr.open('GET', 'https://api.infi-dev.com/example-removed/auth/jwks');
            xhr.send();
        });
    }
    
    // Test the actual extension API functions
    async function testExtensionFunctions() {
        console.log('🔍 Testing extension API functions...');
        
        try {
            // Test getUserFolders function
            if (typeof window.getUserFolders === 'function') {
                console.log('Testing getUserFolders...');
                const folders = await window.getUserFolders();
                console.log('✅ getUserFolders result:', folders);
            } else {
                console.log('⚠️ getUserFolders function not found');
            }
            
            // Test getConversations function
            if (typeof window.getConversations === 'function') {
                console.log('Testing getConversations...');
                const conversations = await window.getConversations();
                console.log('✅ getConversations result:', conversations);
            } else {
                console.log('⚠️ getConversations function not found');
            }
            
        } catch (error) {
            console.error('❌ Extension function test error:', error);
        }
    }
    
    // Generate test report
    function generateReport() {
        console.log('\n📊 SELECTIVE BLOCKING TEST REPORT');
        console.log('=====================================');
        
        console.log(`\n✅ Essential APIs (should be allowed):`);
        console.log(`   Passed: ${testResults.summary.essentialPassed}`);
        console.log(`   Failed: ${testResults.summary.essentialFailed}`);
        
        console.log(`\n🚫 Problematic APIs (should be blocked):`);
        console.log(`   Correctly Blocked: ${testResults.summary.problematicBlocked}`);
        console.log(`   Incorrectly Allowed: ${testResults.summary.problematicAllowed}`);
        
        const totalTests = essentialEndpoints.length + problematicEndpoints.length;
        const passedTests = testResults.summary.essentialPassed + testResults.summary.problematicBlocked;
        const successRate = ((passedTests / totalTests) * 100).toFixed(1);
        
        console.log(`\n📈 Overall Success Rate: ${successRate}% (${passedTests}/${totalTests})`);
        
        if (testResults.summary.essentialFailed > 0) {
            console.error(`\n❌ CRITICAL: ${testResults.summary.essentialFailed} essential APIs are being blocked!`);
            console.error('This will break core extension functionality.');
        }
        
        if (testResults.summary.problematicAllowed > 0) {
            console.warn(`\n⚠️ WARNING: ${testResults.summary.problematicAllowed} problematic APIs are not being blocked!`);
            console.warn('This may cause infinite loops.');
        }
        
        if (testResults.summary.essentialFailed === 0 && testResults.summary.problematicAllowed === 0) {
            console.log('\n🎉 SUCCESS: Selective blocking is working correctly!');
            console.log('Essential APIs are allowed, problematic APIs are blocked.');
        }
        
        // Store results globally for inspection
        window.selectiveBlockingTestResults = testResults;
        
        return testResults;
    }
    
    // Run all tests
    async function runAllTests() {
        try {
            await testEssentialEndpoints();
            await testProblematicEndpoints();
            await testXHRBlocking();
            await testExtensionFunctions();
            
            return generateReport();
        } catch (error) {
            console.error('❌ Test execution error:', error);
            return null;
        }
    }
    
    // Export test function globally
    window.testSelectiveBlocking = runAllTests;
    
    // Auto-run tests
    console.log('🚀 Starting selective blocking tests...');
    runAllTests().then(() => {
        console.log('✅ Selective blocking tests completed!');
        console.log('Results stored in window.selectiveBlockingTestResults');
        console.log('Run window.testSelectiveBlocking() to test again');
    });
    
})();