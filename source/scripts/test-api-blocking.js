// Test script to confirm API blocking diagnosis
(function() {
    'use strict';
    
    console.log('🔍 TESTING API BLOCKING DIAGNOSIS');
    
    // Test 1: Check if unified context fix is active
    console.log('1. Unified Context Fix Active:', window.unifiedContextFixActive);
    
    // Test 2: Try to fetch from the blocked API
    console.log('2. Testing fetch to api.infi-dev.com...');
    
    fetch('https://api.infi-dev.com/ai-toolbox/folder/get', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('✅ API call succeeded:', response.status);
    })
    .catch(error => {
        console.log('❌ API call blocked:', error.message);
        console.log('Error code:', error.code);
        
        if (error.code === 'BLOCKED_BY_UNIFIED_FIX') {
            console.log('🎯 DIAGNOSIS CONFIRMED: Unified context fix is blocking the external API that the extension needs for folder/chat retrieval!');
        }
    });
    
    // Test 3: Check if ChatGPT API calls work
    console.log('3. Testing fetch to chatgpt.com...');
    
    fetch('https://chatgpt.com/backend-api/conversations', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('✅ ChatGPT API call allowed:', response.status);
    })
    .catch(error => {
        console.log('ℹ️ ChatGPT API call result:', error.message);
    });
    
    // Test 4: Check extension functions
    console.log('4. Testing extension functions...');
    
    if (typeof window.getUserFolders === 'function') {
        window.getUserFolders()
            .then(folders => {
                console.log('📁 getUserFolders result:', folders);
                if (folders.length === 0) {
                    console.log('⚠️ No folders returned - likely due to API blocking');
                }
            })
            .catch(error => {
                console.log('❌ getUserFolders failed:', error.message);
            });
    } else {
        console.log('❌ getUserFolders function not available');
    }
    
    console.log('🔍 API BLOCKING DIAGNOSIS TEST COMPLETE');
})();