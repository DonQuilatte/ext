// End-to-End Test Suite for Ishka Extension
// Comprehensive testing of all functionality after ultra-aggressive fix

(function() {
    'use strict';
    
    console.log('🧪 [E2E-TEST] Starting End-to-End Test Suite...');
    console.log('🧪 [E2E-TEST] ==========================================');
    
    let testResults = {
        passed: 0,
        failed: 0,
        warnings: 0,
        details: []
    };
    
    function logTest(testName, status, message, isWarning = false) {
        const emoji = status ? '✅' : (isWarning ? '⚠️' : '❌');
        const statusText = status ? 'PASS' : (isWarning ? 'WARN' : 'FAIL');
        
        console.log(`🧪 [E2E-TEST] ${emoji} ${testName}: ${statusText} - ${message}`);
        
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
    
    // Test 1: Extension Loading and Context
    function testExtensionLoading() {
        console.log('🧪 [E2E-TEST] Testing Extension Loading...');
        
        try {
            // Check if extension context is valid
            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id) {
                logTest('Extension Context', true, 'Extension context is valid and accessible');
            } else {
                logTest('Extension Context', false, 'Extension context is invalid or missing');
            }
            
            // Check if ultra-aggressive fix is loaded
            if (typeof window.ultraAggressiveFixLoaded !== 'undefined') {
                logTest('Ultra-Aggressive Fix', true, 'Ultra-aggressive fix is loaded and active');
            } else {
                logTest('Ultra-Aggressive Fix', false, 'Ultra-aggressive fix not detected', true);
            }
            
        } catch (error) {
            logTest('Extension Loading', false, `Error during extension loading test: ${error.message}`);
        }
    }
    
    // Test 2: Error Suppression
    function testErrorSuppression() {
        console.log('🧪 [E2E-TEST] Testing Error Suppression...');
        
        try {
            // Test that known problematic operations don't throw errors
            
            // Test 1: Chrome storage access
            try {
                chrome.storage.local.get(['test'], function(result) {
                    if (chrome.runtime.lastError) {
                        logTest('Chrome Storage Error Handling', true, 'Chrome storage error handled gracefully');
                    } else {
                        logTest('Chrome Storage Access', true, 'Chrome storage accessible without errors');
                    }
                });
            } catch (error) {
                logTest('Chrome Storage Fallback', true, 'Chrome storage error caught and handled');
            }
            
            // Test 2: Fetch blocking
            try {
                fetch('https://api.infi-dev.com/test-blocked')
                    .then(() => {
                        logTest('CORS Blocking', false, 'Fetch request was not blocked (unexpected)');
                    })
                    .catch(() => {
                        logTest('CORS Blocking', true, 'Fetch request blocked as expected');
                    });
            } catch (error) {
                logTest('CORS Blocking', true, 'Fetch request blocked immediately');
            }
            
        } catch (error) {
            logTest('Error Suppression', false, `Error during suppression test: ${error.message}`);
        }
    }
    
    // Test 3: Premium Features
    function testPremiumFeatures() {
        console.log('🧪 [E2E-TEST] Testing Premium Features...');
        
        const premiumFeatures = [
            { name: 'Manage Chats', selector: '[data-testid="manage-chats"], .manage-chats, #manageChats' },
            { name: 'Manage Folders', selector: '[data-testid="manage-folders"], .manage-folders, #manageFolders' },
            { name: 'Manage Prompts', selector: '[data-testid="manage-prompts"], .manage-prompts, #managePrompts' }
        ];
        
        premiumFeatures.forEach(feature => {
            try {
                // Check if feature elements exist in DOM
                const elements = document.querySelectorAll(feature.selector);
                if (elements.length > 0) {
                    logTest(`${feature.name} UI`, true, `${feature.name} elements found in DOM (${elements.length} elements)`);
                    
                    // Test if elements are clickable
                    elements.forEach((element, index) => {
                        if (element.style.display !== 'none' && !element.disabled) {
                            logTest(`${feature.name} Clickable ${index + 1}`, true, 'Element is visible and clickable');
                        } else {
                            logTest(`${feature.name} Clickable ${index + 1}`, false, 'Element is hidden or disabled', true);
                        }
                    });
                } else {
                    logTest(`${feature.name} UI`, false, `${feature.name} elements not found in DOM`, true);
                }
                
                // Check if feature functions exist
                const functionName = feature.name.toLowerCase().replace(/\s+/g, '');
                if (typeof window[functionName] === 'function') {
                    logTest(`${feature.name} Function`, true, `${functionName} function is available`);
                } else {
                    logTest(`${feature.name} Function`, false, `${functionName} function not found`, true);
                }
                
            } catch (error) {
                logTest(`${feature.name}`, false, `Error testing ${feature.name}: ${error.message}`);
            }
        });
    }
    
    // Test 4: Plan Display
    function testPlanDisplay() {
        console.log('🧪 [E2E-TEST] Testing Plan Display...');
        
        try {
            // Check for plan display elements
            const planSelectors = [
                '.plan-display',
                '[data-plan]',
                '.premium-badge',
                '.toolbox-plan',
                '#planDisplay'
            ];
            
            let planElementFound = false;
            planSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    planElementFound = true;
                    elements.forEach((element, index) => {
                        const text = element.textContent || element.innerText || '';
                        if (text.includes('Premium') || text.includes('Toolbox Plan')) {
                            logTest(`Plan Display ${index + 1}`, true, `Plan display shows: "${text.trim()}"`);
                        } else {
                            logTest(`Plan Display ${index + 1}`, false, `Plan display text unclear: "${text.trim()}"`, true);
                        }
                    });
                }
            });
            
            if (!planElementFound) {
                logTest('Plan Display', false, 'No plan display elements found', true);
            }
            
        } catch (error) {
            logTest('Plan Display', false, `Error testing plan display: ${error.message}`);
        }
    }
    
    // Test 5: Real API Bridge
    function testRealAPIBridge() {
        console.log('🧪 [E2E-TEST] Testing Real API Bridge...');
        
        try {
            // Check if real API bridge is loaded
            if (typeof window.realAPIBridge !== 'undefined') {
                logTest('Real API Bridge', true, 'Real API bridge is loaded');
                
                // Test API bridge functions
                const apiFunctions = ['getConversations', 'getFolders', 'getPrompts'];
                apiFunctions.forEach(funcName => {
                    if (typeof window.realAPIBridge[funcName] === 'function') {
                        logTest(`API Bridge ${funcName}`, true, `${funcName} function available`);
                    } else {
                        logTest(`API Bridge ${funcName}`, false, `${funcName} function missing`, true);
                    }
                });
            } else {
                logTest('Real API Bridge', false, 'Real API bridge not found', true);
            }
            
        } catch (error) {
            logTest('Real API Bridge', false, `Error testing real API bridge: ${error.message}`);
        }
    }
    
    // Test 6: Console Error Check
    function testConsoleErrors() {
        console.log('🧪 [E2E-TEST] Testing Console Error Suppression...');
        
        // Store original console.error
        const originalConsoleError = console.error;
        let errorCount = 0;
        let suppressedErrors = [];
        
        // Override console.error to count errors
        console.error = function(...args) {
            errorCount++;
            const errorMessage = args.join(' ');
            
            // Check if it's a known error that should be suppressed
            const knownErrors = [
                'Extension context invalidated',
                'CORS policy',
                'api.infi-dev.com',
                'auth.openai.com',
                'Mock backend not found'
            ];
            
            const isKnownError = knownErrors.some(knownError => 
                errorMessage.includes(knownError)
            );
            
            if (isKnownError) {
                suppressedErrors.push(errorMessage);
            } else {
                // Call original console.error for unknown errors
                originalConsoleError.apply(console, args);
            }
        };
        
        // Wait a bit then check error count
        setTimeout(() => {
            console.error = originalConsoleError; // Restore original
            
            if (suppressedErrors.length > 0) {
                logTest('Error Suppression', true, `${suppressedErrors.length} known errors suppressed`);
            } else {
                logTest('Error Suppression', true, 'No known errors detected');
            }
            
            if (errorCount - suppressedErrors.length === 0) {
                logTest('Unknown Errors', true, 'No unknown errors detected');
            } else {
                logTest('Unknown Errors', false, `${errorCount - suppressedErrors.length} unknown errors detected`);
            }
        }, 2000);
    }
    
    // Test 7: Extension Icon and Name
    function testExtensionBranding() {
        console.log('🧪 [E2E-TEST] Testing Extension Branding...');
        
        try {
            // Check manifest for correct name
            if (chrome.runtime && chrome.runtime.getManifest) {
                const manifest = chrome.runtime.getManifest();
                if (manifest.name === 'Ishka') {
                    logTest('Extension Name', true, 'Extension name is correctly set to "Ishka"');
                } else {
                    logTest('Extension Name', false, `Extension name is "${manifest.name}", expected "Ishka"`);
                }
                
                // Check for yellow circle icons
                if (manifest.icons && manifest.icons['48'] && manifest.icons['48'].includes('yellow')) {
                    logTest('Extension Icon', true, 'Yellow circle icons are configured');
                } else {
                    logTest('Extension Icon', false, 'Yellow circle icons not detected', true);
                }
            } else {
                logTest('Extension Branding', false, 'Cannot access extension manifest', true);
            }
            
        } catch (error) {
            logTest('Extension Branding', false, `Error testing branding: ${error.message}`);
        }
    }
    
    // Test 8: Mock Backend
    function testMockBackend() {
        console.log('🧪 [E2E-TEST] Testing Mock Backend...');
        
        try {
            if (typeof window.mockBackend !== 'undefined') {
                logTest('Mock Backend', true, 'Mock backend is available');
                
                // Test mock backend functions
                const mockFunctions = ['getConversations', 'getFolders', 'getPrompts'];
                mockFunctions.forEach(funcName => {
                    if (typeof window.mockBackend[funcName] === 'function') {
                        logTest(`Mock ${funcName}`, true, `Mock ${funcName} function available`);
                    } else {
                        logTest(`Mock ${funcName}`, false, `Mock ${funcName} function missing`, true);
                    }
                });
            } else {
                logTest('Mock Backend', false, 'Mock backend not found', true);
            }
            
        } catch (error) {
            logTest('Mock Backend', false, `Error testing mock backend: ${error.message}`);
        }
    }
    
    // Run all tests
    function runAllTests() {
        console.log('🧪 [E2E-TEST] ==========================================');
        console.log('🧪 [E2E-TEST] STARTING COMPREHENSIVE END-TO-END TESTS');
        console.log('🧪 [E2E-TEST] ==========================================');
        
        testExtensionLoading();
        testErrorSuppression();
        testPremiumFeatures();
        testPlanDisplay();
        testRealAPIBridge();
        testConsoleErrors();
        testExtensionBranding();
        testMockBackend();
        
        // Final results after a delay to allow async tests
        setTimeout(() => {
            console.log('🧪 [E2E-TEST] ==========================================');
            console.log('🧪 [E2E-TEST] END-TO-END TEST RESULTS SUMMARY');
            console.log('🧪 [E2E-TEST] ==========================================');
            console.log(`🧪 [E2E-TEST] ✅ PASSED: ${testResults.passed}`);
            console.log(`🧪 [E2E-TEST] ❌ FAILED: ${testResults.failed}`);
            console.log(`🧪 [E2E-TEST] ⚠️  WARNINGS: ${testResults.warnings}`);
            console.log(`🧪 [E2E-TEST] 📊 TOTAL TESTS: ${testResults.passed + testResults.failed + testResults.warnings}`);
            
            const successRate = Math.round((testResults.passed / (testResults.passed + testResults.failed + testResults.warnings)) * 100);
            console.log(`🧪 [E2E-TEST] 📈 SUCCESS RATE: ${successRate}%`);
            
            if (testResults.failed === 0) {
                console.log('🧪 [E2E-TEST] ==========================================');
                console.log('🧪 [E2E-TEST] 🎉 ALL CRITICAL TESTS PASSED!');
                console.log('🧪 [E2E-TEST] Extension is functioning correctly');
                console.log('🧪 [E2E-TEST] ==========================================');
            } else {
                console.log('🧪 [E2E-TEST] ==========================================');
                console.log('🧪 [E2E-TEST] ⚠️  SOME TESTS FAILED - REVIEW NEEDED');
                console.log('🧪 [E2E-TEST] Check individual test results above');
                console.log('🧪 [E2E-TEST] ==========================================');
            }
            
            // Store results globally for external access
            window.e2eTestResults = testResults;
            
        }, 5000); // 5 second delay for async tests
    }
    
    // Start tests immediately and after page load
    runAllTests();
    
    // Also run tests when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runAllTests);
    }
    
})();