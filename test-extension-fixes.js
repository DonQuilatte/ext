/* eslint-disable no-console */
// Test script to verify the extension fixes are working - requires console output for testing
console.log('🧪 TESTING: Extension fixes verification');

// Test 1: Check if robust initialization utilities are available
console.log('🔍 TEST 1: Checking robust initialization utilities...');
if (window.domUtils) {
    console.log('✅ TEST 1: domUtils available');
    console.log('  - isBodyReady:', typeof window.domUtils.isBodyReady);
    console.log('  - whenBodyReady:', typeof window.domUtils.whenBodyReady);
} else {
    console.log('❌ TEST 1: domUtils not available');
}

if (window.storageUtils) {
    console.log('✅ TEST 1: storageUtils available');
    console.log('  - safeGet:', typeof window.storageUtils.safeGet);
    console.log('  - safeSet:', typeof window.storageUtils.safeSet);
} else {
    console.log('❌ TEST 1: storageUtils not available');
}

// Test 2: Check if error handling is available
console.log('🔍 TEST 2: Checking error handling utilities...');
if (window.safeAccess) {
    console.log('✅ TEST 2: safeAccess available');
} else {
    console.log('❌ TEST 2: safeAccess not available');
}

// Test 3: Check if properties are properly initialized
console.log('🔍 TEST 3: Checking property initialization...');
const testProperties = ['isResetChatHistory', 'local_folders', 'isShowFolders'];
testProperties.forEach(prop => {
    if (Object.prototype.hasOwnProperty.call(window, prop)) {
        console.log(`✅ TEST 3: ${prop} is initialized:`, typeof window[prop]);
    } else {
        console.log(`⚠️ TEST 3: ${prop} not found on window`);
    }
});

// Test 4: Check document.body readiness
console.log('🔍 TEST 4: Checking document.body readiness...');
console.log('  - document.readyState:', document.readyState);
console.log('  - document.body exists:', !!document.body);
console.log('  - document.body.nodeType:', document.body?.nodeType);

if (window.domUtils) {
    console.log('  - domUtils.isBodyReady():', window.domUtils.isBodyReady());
}

console.log('🎯 TESTING: Extension fixes verification complete');