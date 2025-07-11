// Debug test script to verify the isResetChatHistory fix
// This script will test all aspects of the fix implementation

console.log('🔬 DEBUG TEST: Starting comprehensive fix verification');

// Test 1: Check if critical properties are initialized
function testCriticalProperties() {
    console.log('🧪 TEST 1: Checking critical property initialization');
    
    const criticalProps = ['isResetChatHistory', 'isPremium', 'userSettings', 'extensionData'];
    const results = {};
    
    criticalProps.forEach(prop => {
        try {
            const exists = prop in window;
            const value = window[prop];
            results[prop] = {
                exists: exists,
                value: value,
                type: typeof value
            };
            console.log(`✅ ${prop}: exists=${exists}, value=${value}, type=${typeof value}`);
        } catch (e) {
            results[prop] = {
                exists: false,
                error: e.message
            };
            console.error(`❌ ${prop}: Error - ${e.message}`);
        }
    });
    
    return results;
}

// Test 2: Check store object functionality
function testStoreObject() {
    console.log('🧪 TEST 2: Checking store object functionality');
    
    try {
        const storeExists = 'store' in window;
        console.log(`Store exists: ${storeExists}`);
        
        if (storeExists) {
            const store = window.store;
            console.log('Store object:', store);
            
            // Test store.get method
            if (typeof store.get === 'function') {
                const testValue = store.get('isResetChatHistory');
                console.log(`✅ store.get('isResetChatHistory'): ${testValue}`);
            } else {
                console.log('⚠️ store.get method not found');
            }
            
            // Test store.set method
            if (typeof store.set === 'function') {
                store.set('testKey', 'testValue');
                console.log('✅ store.set test completed');
            } else {
                console.log('⚠️ store.set method not found');
            }
            
            // Test direct property access
            const directAccess = store.isResetChatHistory;
            console.log(`✅ store.isResetChatHistory: ${directAccess}`);
        } else {
            console.error('❌ Store object not found');
        }
    } catch (e) {
        console.error('❌ Store object test failed:', e);
    }
}

// Test 3: Test safe property checking functions
function testSafePropertyFunctions() {
    console.log('🧪 TEST 3: Testing safe property checking functions');
    
    try {
        // Test safePropertyCheck function
        if (typeof window.safePropertyCheck === 'function') {
            const result1 = window.safePropertyCheck(window, 'isResetChatHistory');
            console.log(`✅ safePropertyCheck(window, 'isResetChatHistory'): ${result1}`);
            
            const result2 = window.safePropertyCheck(null, 'isResetChatHistory');
            console.log(`✅ safePropertyCheck(null, 'isResetChatHistory'): ${result2}`);
            
            const result3 = window.safePropertyCheck(undefined, 'isResetChatHistory');
            console.log(`✅ safePropertyCheck(undefined, 'isResetChatHistory'): ${result3}`);
        } else {
            console.log('⚠️ safePropertyCheck function not found');
        }
        
        // Test safeInOperator function
        if (typeof window.safeInOperator === 'function') {
            const result1 = window.safeInOperator('isResetChatHistory', window);
            console.log(`✅ safeInOperator('isResetChatHistory', window): ${result1}`);
            
            const result2 = window.safeInOperator('isResetChatHistory', null);
            console.log(`✅ safeInOperator('isResetChatHistory', null): ${result2}`);
            
            const result3 = window.safeInOperator('isResetChatHistory', undefined);
            console.log(`✅ safeInOperator('isResetChatHistory', undefined): ${result3}`);
        } else {
            console.log('⚠️ safeInOperator function not found');
        }
    } catch (e) {
        console.error('❌ Safe property functions test failed:', e);
    }
}

// Test 4: Test Chrome storage wrapper
function testChromeStorageWrapper() {
    console.log('🧪 TEST 4: Testing Chrome storage wrapper');
    
    try {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            console.log('✅ Chrome storage API available');
            
            // Test safeStorageGet function
            if (typeof window.safeStorageGet === 'function') {
                window.safeStorageGet('isResetChatHistory', false).then(value => {
                    console.log(`✅ safeStorageGet('isResetChatHistory'): ${value}`);
                }).catch(e => {
                    console.error('❌ safeStorageGet failed:', e);
                });
            } else {
                console.log('⚠️ safeStorageGet function not found');
            }
            
            // Test safeStorageSet function
            if (typeof window.safeStorageSet === 'function') {
                window.safeStorageSet('testDebugKey', 'testDebugValue').then(result => {
                    console.log(`✅ safeStorageSet test: ${result}`);
                }).catch(e => {
                    console.error('❌ safeStorageSet failed:', e);
                });
            } else {
                console.log('⚠️ safeStorageSet function not found');
            }
        } else {
            console.log('⚠️ Chrome storage API not available');
        }
    } catch (e) {
        console.error('❌ Chrome storage wrapper test failed:', e);
    }
}

// Test 5: Simulate the problematic property access
function testProblematicPropertyAccess() {
    console.log('🧪 TEST 5: Simulating problematic property access');
    
    try {
        // Test 1: Direct property access
        const directAccess = window.isResetChatHistory;
        console.log(`✅ Direct access - window.isResetChatHistory: ${directAccess}`);
        
        // Test 2: 'in' operator
        const inOperator = 'isResetChatHistory' in window;
        console.log(`✅ 'in' operator - 'isResetChatHistory' in window: ${inOperator}`);
        
        // Test 3: hasOwnProperty
        const hasOwnProp = window.hasOwnProperty('isResetChatHistory');
        console.log(`✅ hasOwnProperty - window.hasOwnProperty('isResetChatHistory'): ${hasOwnProp}`);
        
        // Test 4: Object.getOwnPropertyDescriptor
        const descriptor = Object.getOwnPropertyDescriptor(window, 'isResetChatHistory');
        console.log(`✅ Object.getOwnPropertyDescriptor: ${descriptor ? 'Found' : 'Not found'}`);
        
        // Test 5: Destructuring (common cause of errors)
        try {
            const { isResetChatHistory } = window;
            console.log(`✅ Destructuring - isResetChatHistory: ${isResetChatHistory}`);
        } catch (e) {
            console.error('❌ Destructuring failed:', e);
        }
        
        // Test 6: Access on undefined object (should be handled safely)
        try {
            const undefinedObj = undefined;
            const result = window.safeInOperator ? window.safeInOperator('isResetChatHistory', undefinedObj) : false;
            console.log(`✅ Safe access on undefined object: ${result}`);
        } catch (e) {
            console.error('❌ Safe access on undefined object failed:', e);
        }
        
    } catch (e) {
        console.error('❌ Problematic property access test failed:', e);
    }
}

// Run all tests
function runDebugTests() {
    console.log('🚀 DEBUG TEST: Running all verification tests');
    
    const results = {
        criticalProperties: testCriticalProperties(),
        storeObject: testStoreObject(),
        safeFunctions: testSafePropertyFunctions(),
        chromeStorage: testChromeStorageWrapper(),
        problematicAccess: testProblematicPropertyAccess()
    };
    
    console.log('📊 DEBUG TEST: All tests completed');
    console.log('📋 DEBUG TEST: Results summary:', results);
    
    // Count successes and failures
    let totalTests = 0;
    let passedTests = 0;
    
    // Check critical properties
    Object.keys(results.criticalProperties).forEach(prop => {
        totalTests++;
        if (results.criticalProperties[prop].exists && !results.criticalProperties[prop].error) {
            passedTests++;
        }
    });
    
    console.log(`📈 DEBUG TEST: ${passedTests}/${totalTests} critical property tests passed`);
    
    // Final assessment
    if (passedTests === totalTests) {
        console.log('🎉 DEBUG TEST: All tests PASSED! The fix appears to be working correctly.');
    } else {
        console.log('⚠️ DEBUG TEST: Some tests failed. The fix may need additional work.');
    }
    
    return results;
}

// Execute debug tests after a short delay to ensure all scripts are loaded
setTimeout(() => {
    runDebugTests();
}, 1000);

console.log('🔬 DEBUG TEST: Test script loaded and scheduled');