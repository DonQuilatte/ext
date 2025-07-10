// Test All Fixes Script
// Comprehensive testing of all implemented fixes

(function() {
    'use strict';
    
    console.log('[Test All Fixes] Starting comprehensive fix testing...');
    
    // Test results storage
    const testResults = {
        emergencyFix: false,
        undefinedProperties: false,
        corsIssues: false,
        devInitSafe: false,
        realApiIntegration: false,
        premiumFeatures: false,
        overallStatus: 'TESTING'
    };
    
    // Test emergency fix functionality
    function testEmergencyFix() {
        console.log('[Test All Fixes] Testing emergency fix...');
        
        try {
            // Check if emergency fix flag is set
            if (window.emergencyFixActive) {
                console.log('✅ Emergency fix is active');
                testResults.emergencyFix = true;
            } else {
                console.log('❌ Emergency fix is not active');
            }
            
            // Test Chrome API availability
            if (typeof chrome !== 'undefined' && chrome.storage) {
                console.log('✅ Chrome APIs are available');
            } else {
                console.log('⚠️ Chrome APIs may not be fully available');
            }
            
        } catch (error) {
            console.error('❌ Emergency fix test failed:', error);
        }
    }
    
    // Test undefined properties fix
    function testUndefinedProperties() {
        console.log('[Test All Fixes] Testing undefined properties fix...');
        
        try {
            const requiredProperties = [
                'local_folders',
                'isResetChatHistory',
                'conversations',
                'userFolders',
                'prompts',
                'isPremium',
                'premiumStatus'
            ];
            
            let allPropertiesDefined = true;
            
            requiredProperties.forEach(prop => {
                if (typeof window[prop] === 'undefined') {
                    console.log(`❌ Property ${prop} is undefined`);
                    allPropertiesDefined = false;
                } else {
                    console.log(`✅ Property ${prop} is defined:`, typeof window[prop]);
                }
            });
            
            if (allPropertiesDefined) {
                console.log('✅ All required properties are defined');
                testResults.undefinedProperties = true;
            } else {
                console.log('❌ Some properties are still undefined');
            }
            
            // Test property access
            try {
                const testAccess = window.local_folders.length;
                console.log('✅ Property access test passed');
            } catch (error) {
                console.log('❌ Property access test failed:', error.message);
            }
            
        } catch (error) {
            console.error('❌ Undefined properties test failed:', error);
        }
    }
    
    // Test CORS issues fix
    function testCORSIssues() {
        console.log('[Test All Fixes] Testing CORS issues fix...');
        
        try {
            // Check if CORS fix flag is set
            if (window.corsIssuesFixed) {
                console.log('✅ CORS fixes are active');
                testResults.corsIssues = true;
            } else {
                console.log('❌ CORS fixes are not active');
            }
            
            // Test blocked domain request (should not cause CORS error)
            fetch('https://api.infi-dev.com/test')
                .then(response => response.json())
                .then(data => {
                    if (data.blocked_url) {
                        console.log('✅ CORS blocking is working correctly');
                    } else {
                        console.log('⚠️ CORS blocking may not be working');
                    }
                })
                .catch(error => {
                    console.log('⚠️ Fetch test error (expected):', error.message);
                });
            
        } catch (error) {
            console.error('❌ CORS issues test failed:', error);
        }
    }
    
    // Test dev init safe functionality
    function testDevInitSafe() {
        console.log('[Test All Fixes] Testing dev init safe...');
        
        try {
            // Check localStorage access
            if (typeof Storage !== 'undefined' && localStorage) {
                const isPremium = localStorage.getItem('isPremium');
                if (isPremium) {
                    console.log('✅ localStorage premium status:', isPremium);
                    testResults.devInitSafe = true;
                } else {
                    console.log('⚠️ localStorage premium status not set');
                }
            } else {
                console.log('❌ localStorage not available');
            }
            
            // Test Chrome storage fallback
            if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
                chrome.storage.local.get(['isPremium'], (result) => {
                    if (chrome.runtime.lastError) {
                        console.log('⚠️ Chrome storage error (using fallback):', chrome.runtime.lastError.message);
                    } else {
                        console.log('✅ Chrome storage access working:', result);
                    }
                });
            }
            
        } catch (error) {
            console.error('❌ Dev init safe test failed:', error);
        }
    }
    
    // Test real API integration
    function testRealApiIntegration() {
        console.log('[Test All Fixes] Testing real API integration...');
        
        try {
            // Check if real API functions are available
            const realApiFunctions = [
                'realGetConversations',
                'realGetUserFolders',
                'realGetPrompts'
            ];
            
            let allFunctionsAvailable = true;
            
            realApiFunctions.forEach(func => {
                if (typeof window[func] === 'function') {
                    console.log(`✅ Function ${func} is available`);
                } else {
                    console.log(`❌ Function ${func} is not available`);
                    allFunctionsAvailable = false;
                }
            });
            
            if (allFunctionsAvailable) {
                console.log('✅ All real API functions are available');
                testResults.realApiIntegration = true;
                
                // Test a real API call
                if (typeof window.realGetConversations === 'function') {
                    window.realGetConversations()
                        .then(conversations => {
                            console.log('✅ Real API call successful, conversations:', conversations.length);
                        })
                        .catch(error => {
                            console.log('⚠️ Real API call error:', error.message);
                        });
                }
            } else {
                console.log('❌ Some real API functions are missing');
            }
            
        } catch (error) {
            console.error('❌ Real API integration test failed:', error);
        }
    }
    
    // Test premium features
    function testPremiumFeatures() {
        console.log('[Test All Fixes] Testing premium features...');
        
        try {
            // Check premium status
            if (window.isPremium === true) {
                console.log('✅ Premium status is active');
            } else {
                console.log('❌ Premium status is not active');
            }
            
            // Check premium status object
            if (window.premiumStatus && window.premiumStatus.active) {
                console.log('✅ Premium status object is valid');
                testResults.premiumFeatures = true;
            } else {
                console.log('❌ Premium status object is invalid');
            }
            
            // Test premium feature functions
            const premiumFunctions = ['getConversations', 'getUserFolders', 'getPrompts'];
            
            premiumFunctions.forEach(func => {
                if (typeof window[func] === 'function') {
                    console.log(`✅ Premium function ${func} is available`);
                } else {
                    console.log(`❌ Premium function ${func} is not available`);
                }
            });
            
        } catch (error) {
            console.error('❌ Premium features test failed:', error);
        }
    }
    
    // Generate test report
    function generateTestReport() {
        console.log('\n[Test All Fixes] === COMPREHENSIVE TEST REPORT ===');
        
        const passedTests = Object.values(testResults).filter(result => result === true).length;
        const totalTests = Object.keys(testResults).length - 1; // Exclude overallStatus
        
        console.log(`Tests Passed: ${passedTests}/${totalTests}`);
        console.log('Detailed Results:');
        
        Object.entries(testResults).forEach(([test, result]) => {
            if (test !== 'overallStatus') {
                const status = result ? '✅ PASS' : '❌ FAIL';
                console.log(`  ${test}: ${status}`);
            }
        });
        
        // Determine overall status
        if (passedTests === totalTests) {
            testResults.overallStatus = 'ALL_TESTS_PASSED';
            console.log('\n🎉 ALL TESTS PASSED - Extension should be working correctly!');
        } else if (passedTests >= totalTests * 0.7) {
            testResults.overallStatus = 'MOSTLY_WORKING';
            console.log('\n⚠️ MOST TESTS PASSED - Extension should be mostly functional');
        } else {
            testResults.overallStatus = 'NEEDS_ATTENTION';
            console.log('\n❌ MULTIPLE TESTS FAILED - Extension needs attention');
        }
        
        // Store results globally for debugging
        window.testAllFixesResults = testResults;
        
        console.log('\n[Test All Fixes] Test results stored in window.testAllFixesResults');
        console.log('[Test All Fixes] === END TEST REPORT ===\n');
    }
    
    // Run all tests
    function runAllTests() {
        console.log('[Test All Fixes] Running all tests...');
        
        testEmergencyFix();
        testUndefinedProperties();
        testCORSIssues();
        testDevInitSafe();
        testRealApiIntegration();
        testPremiumFeatures();
        
        // Generate report after a short delay to allow async tests
        setTimeout(generateTestReport, 1000);
    }
    
    // Initialize testing
    function initializeTesting() {
        console.log('[Test All Fixes] Initializing comprehensive testing...');
        
        // Run tests immediately
        runAllTests();
        
        // Also run tests after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runAllTests);
        }
        
        // Run tests again after other scripts have loaded
        setTimeout(runAllTests, 2000);
        setTimeout(runAllTests, 5000);
        
        // Set up periodic testing
        setInterval(() => {
            console.log('[Test All Fixes] Running periodic test check...');
            runAllTests();
        }, 30000); // Every 30 seconds
    }
    
    // Start testing
    initializeTesting();
    
})();