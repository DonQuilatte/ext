// Test Script Conflict Fix - Validate that removing fix-premium-features.js resolves undefined errors
// This script tests the core functionality after eliminating script conflicts

(function() {
    'use strict';
    
    console.log('🧪 TESTING SCRIPT CONFLICT FIX - Validating unified context fix without conflicts');
    
    // Test configuration
    const TEST_CONFIG = {
        maxWaitTime: 10000, // 10 seconds max wait
        checkInterval: 200,  // Check every 200ms
        expectedFunctions: ['getConversations', 'getUserFolders', 'getPrompts', 'getAllUserFolders'],
        realApiFunctions: ['realGetConversations', 'realGetUserFolders', 'realGetPrompts']
    };
    
    let testResults = {
        scriptConflicts: [],
        functionAvailability: {},
        realApiBridge: {},
        apiCalls: {},
        overallStatus: 'PENDING'
    };
    
    // Check for script conflicts
    function checkScriptConflicts() {
        console.log('🔍 Checking for script conflicts...');
        
        const conflicts = [];
        
        // Check if fix-premium-features.js functions are still being loaded
        if (window.fixPremiumFeatures) {
            conflicts.push('fix-premium-features.js still active');
        }
        
        // Check for multiple function definitions
        TEST_CONFIG.expectedFunctions.forEach(funcName => {
            if (window[funcName] && window[funcName].toString().includes('FixPremium')) {
                conflicts.push(`${funcName} still using fix-premium-features implementation`);
            }
        });
        
        testResults.scriptConflicts = conflicts;
        
        if (conflicts.length === 0) {
            console.log('✅ No script conflicts detected');
        } else {
            console.warn('⚠️ Script conflicts found:', conflicts);
        }
        
        return conflicts.length === 0;
    }
    
    // Check function availability
    function checkFunctionAvailability() {
        console.log('🔍 Checking function availability...');
        
        TEST_CONFIG.expectedFunctions.forEach(funcName => {
            const isAvailable = typeof window[funcName] === 'function';
            const implementation = isAvailable ? 'AVAILABLE' : 'MISSING';
            
            testResults.functionAvailability[funcName] = {
                available: isAvailable,
                implementation: implementation,
                source: isAvailable ? (window[funcName].toString().includes('UNIFIED') ? 'unified-context-fix' : 'unknown') : 'none'
            };
            
            console.log(`${isAvailable ? '✅' : '❌'} ${funcName}: ${implementation}`);
        });
    }
    
    // Check Real API Bridge availability
    function checkRealApiBridge() {
        console.log('🔍 Checking Real API Bridge availability...');
        
        TEST_CONFIG.realApiFunctions.forEach(funcName => {
            const isAvailable = typeof window[funcName] === 'function';
            testResults.realApiBridge[funcName] = {
                available: isAvailable,
                ready: isAvailable && window.REAL_API_READY === true
            };
            
            console.log(`${isAvailable ? '✅' : '❌'} ${funcName}: ${isAvailable ? 'AVAILABLE' : 'MISSING'}`);
        });
        
        const realApiReady = window.REAL_API_READY === true;
        console.log(`${realApiReady ? '✅' : '⚠️'} Real API Bridge Ready: ${realApiReady}`);
        
        return realApiReady;
    }
    
    // Test API function calls
    async function testApiFunctionCalls() {
        console.log('🔍 Testing API function calls...');
        
        for (const funcName of TEST_CONFIG.expectedFunctions) {
            if (typeof window[funcName] === 'function') {
                try {
                    console.log(`Testing ${funcName}...`);
                    const startTime = Date.now();
                    const result = await window[funcName]();
                    const duration = Date.now() - startTime;
                    
                    const isValidResult = Array.isArray(result);
                    const hasData = result && result.length > 0;
                    
                    testResults.apiCalls[funcName] = {
                        status: 'SUCCESS',
                        duration: duration,
                        resultType: Array.isArray(result) ? 'array' : typeof result,
                        resultLength: Array.isArray(result) ? result.length : 'N/A',
                        hasData: hasData,
                        isUndefined: result === undefined,
                        sample: hasData ? result[0] : result
                    };
                    
                    if (result === undefined) {
                        console.error(`❌ ${funcName} returned undefined!`);
                    } else if (!isValidResult) {
                        console.warn(`⚠️ ${funcName} returned non-array:`, typeof result);
                    } else if (!hasData) {
                        console.log(`⚠️ ${funcName} returned empty array (may be normal)`);
                    } else {
                        console.log(`✅ ${funcName} returned ${result.length} items in ${duration}ms`);
                    }
                    
                } catch (error) {
                    testResults.apiCalls[funcName] = {
                        status: 'ERROR',
                        error: error.message,
                        isUndefined: false
                    };
                    console.error(`❌ ${funcName} failed:`, error.message);
                }
            } else {
                testResults.apiCalls[funcName] = {
                    status: 'NOT_AVAILABLE',
                    isUndefined: true
                };
                console.error(`❌ ${funcName} not available`);
            }
        }
    }
    
    // Wait for Real API Bridge with timeout
    async function waitForRealApiBridge() {
        console.log('⏳ Waiting for Real API Bridge to be ready...');
        
        const startTime = Date.now();
        while (Date.now() - startTime < TEST_CONFIG.maxWaitTime) {
            if (checkRealApiBridge()) {
                console.log('✅ Real API Bridge is ready');
                return true;
            }
            await new Promise(resolve => setTimeout(resolve, TEST_CONFIG.checkInterval));
        }
        
        console.warn('⚠️ Real API Bridge not ready after timeout');
        return false;
    }
    
    // Generate test report
    function generateTestReport() {
        console.log('\n📊 SCRIPT CONFLICT FIX TEST REPORT');
        console.log('=====================================');
        
        // Script conflicts
        console.log('\n🔧 Script Conflicts:');
        if (testResults.scriptConflicts.length === 0) {
            console.log('✅ No conflicts detected');
        } else {
            testResults.scriptConflicts.forEach(conflict => {
                console.log(`❌ ${conflict}`);
            });
        }
        
        // Function availability
        console.log('\n🔧 Function Availability:');
        Object.entries(testResults.functionAvailability).forEach(([funcName, info]) => {
            console.log(`${info.available ? '✅' : '❌'} ${funcName}: ${info.implementation} (${info.source})`);
        });
        
        // Real API Bridge
        console.log('\n🔧 Real API Bridge:');
        Object.entries(testResults.realApiBridge).forEach(([funcName, info]) => {
            console.log(`${info.available ? '✅' : '❌'} ${funcName}: ${info.available ? 'Available' : 'Missing'}`);
        });
        
        // API calls
        console.log('\n🔧 API Function Calls:');
        Object.entries(testResults.apiCalls).forEach(([funcName, info]) => {
            if (info.status === 'SUCCESS') {
                const undefinedStatus = info.isUndefined ? ' ❌ UNDEFINED' : '';
                console.log(`✅ ${funcName}: ${info.resultType} (${info.resultLength} items) ${info.duration}ms${undefinedStatus}`);
            } else {
                console.log(`❌ ${funcName}: ${info.status} - ${info.error || 'Not available'}`);
            }
        });
        
        // Overall assessment
        const hasUndefinedResults = Object.values(testResults.apiCalls).some(info => info.isUndefined);
        const hasScriptConflicts = testResults.scriptConflicts.length > 0;
        const allFunctionsAvailable = TEST_CONFIG.expectedFunctions.every(funcName => 
            testResults.functionAvailability[funcName]?.available
        );
        
        if (!hasUndefinedResults && !hasScriptConflicts && allFunctionsAvailable) {
            testResults.overallStatus = 'SUCCESS';
            console.log('\n🎉 OVERALL STATUS: SUCCESS - Script conflict fix resolved undefined errors!');
        } else {
            testResults.overallStatus = 'FAILED';
            console.log('\n❌ OVERALL STATUS: FAILED - Issues still present');
            
            if (hasUndefinedResults) {
                console.log('   - Functions still returning undefined');
            }
            if (hasScriptConflicts) {
                console.log('   - Script conflicts still detected');
            }
            if (!allFunctionsAvailable) {
                console.log('   - Some functions not available');
            }
        }
        
        return testResults;
    }
    
    // Main test execution
    async function runTests() {
        console.log('🚀 Starting script conflict fix tests...');
        
        try {
            // Step 1: Check for script conflicts
            checkScriptConflicts();
            
            // Step 2: Check function availability
            checkFunctionAvailability();
            
            // Step 3: Wait for Real API Bridge
            await waitForRealApiBridge();
            
            // Step 4: Test API function calls
            await testApiFunctionCalls();
            
            // Step 5: Generate report
            const results = generateTestReport();
            
            // Make results available globally
            window.scriptConflictTestResults = results;
            
            // Dispatch completion event
            window.dispatchEvent(new CustomEvent('scriptConflictTestComplete', {
                detail: results
            }));
            
        } catch (error) {
            console.error('❌ Test execution failed:', error);
            testResults.overallStatus = 'ERROR';
            testResults.executionError = error.message;
        }
    }
    
    // Start tests when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runTests);
    } else {
        // Add small delay to ensure other scripts have loaded
        setTimeout(runTests, 1000);
    }
    
    // Export test functions for manual use
    window.scriptConflictTests = {
        runTests,
        checkScriptConflicts,
        checkFunctionAvailability,
        checkRealApiBridge,
        testApiFunctionCalls,
        generateTestReport,
        getResults: () => testResults
    };
    
})();