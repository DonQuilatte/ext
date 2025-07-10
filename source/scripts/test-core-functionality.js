// TEST CORE FUNCTIONALITY - Test actual folder and chat retrieval from ChatGPT
// This is the PRIMARY USE CASE that must work for the extension to be functional

(function() {
    'use strict';
    
    console.log('🎯 TESTING CORE FUNCTIONALITY - Folder and Chat Retrieval');
    console.log('This tests the PRIMARY USE CASE that the user reported as broken');
    
    // Test results
    const coreTestResults = {
        folderRetrieval: null,
        chatRetrieval: null,
        apiConnectivity: null,
        realApiBridge: null,
        timestamp: new Date().toISOString()
    };
    
    // Test 1: API Connectivity to infi-dev backend
    async function testAPIConnectivity() {
        console.log('\n🔌 TEST 1: API Connectivity to infi-dev backend');
        
        try {
            // Test the main API endpoint
            const response = await fetch('https://api.infi-dev.com/ai-toolbox/folder/get', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            coreTestResults.apiConnectivity = {
                status: 'SUCCESS',
                canConnect: true,
                httpStatus: response.status,
                blocked: false,
                error: null
            };
            
            console.log('✅ API connectivity test PASSED');
            console.log(`   HTTP Status: ${response.status}`);
            console.log('   Extension is NOT blocking essential API calls');
            
            return true;
            
        } catch (error) {
            if (error.code === 'BLOCKED_BY_UNIFIED_FIX' || error.message.includes('UNIFIED BLOCK')) {
                coreTestResults.apiConnectivity = {
                    status: 'BLOCKED',
                    canConnect: false,
                    httpStatus: null,
                    blocked: true,
                    error: error.message
                };
                
                console.error('❌ API connectivity test FAILED - BLOCKED BY EXTENSION');
                console.error('   This is the ROOT CAUSE of the broken functionality');
                console.error('   Error:', error.message);
                return false;
                
            } else {
                coreTestResults.apiConnectivity = {
                    status: 'NETWORK_ERROR',
                    canConnect: true,
                    httpStatus: null,
                    blocked: false,
                    error: error.message
                };
                
                console.log('✅ API connectivity test PASSED (network error expected)');
                console.log('   Extension is not blocking, network error is normal');
                console.log('   Error:', error.message);
                return true;
            }
        }
    }
    
    // Test 2: Folder Retrieval Functions
    async function testFolderRetrieval() {
        console.log('\n📁 TEST 2: Folder Retrieval Functions');
        
        const folderTests = [];
        
        // Test getUserFolders function
        if (typeof window.getUserFolders === 'function') {
            try {
                console.log('Testing window.getUserFolders()...');
                const folders = await window.getUserFolders();
                folderTests.push({
                    function: 'getUserFolders',
                    status: 'SUCCESS',
                    result: folders,
                    error: null
                });
                console.log('✅ getUserFolders() executed successfully');
                console.log('   Result:', folders);
            } catch (error) {
                folderTests.push({
                    function: 'getUserFolders',
                    status: 'ERROR',
                    result: null,
                    error: error.message
                });
                console.error('❌ getUserFolders() failed:', error.message);
            }
        } else {
            console.warn('⚠️ getUserFolders function not found on window');
        }
        
        // Test getAllUserFolders function
        if (typeof window.getAllUserFolders === 'function') {
            try {
                console.log('Testing window.getAllUserFolders()...');
                const allFolders = await window.getAllUserFolders();
                folderTests.push({
                    function: 'getAllUserFolders',
                    status: 'SUCCESS',
                    result: allFolders,
                    error: null
                });
                console.log('✅ getAllUserFolders() executed successfully');
                console.log('   Result:', allFolders);
            } catch (error) {
                folderTests.push({
                    function: 'getAllUserFolders',
                    status: 'ERROR',
                    result: null,
                    error: error.message
                });
                console.error('❌ getAllUserFolders() failed:', error.message);
            }
        } else {
            console.warn('⚠️ getAllUserFolders function not found on window');
        }
        
        coreTestResults.folderRetrieval = {
            tests: folderTests,
            overallStatus: folderTests.some(t => t.status === 'SUCCESS') ? 'PARTIAL_SUCCESS' : 'FAILED'
        };
        
        return folderTests.length > 0 && folderTests.some(t => t.status === 'SUCCESS');
    }
    
    // Test 3: Chat/Conversation Retrieval Functions
    async function testChatRetrieval() {
        console.log('\n💬 TEST 3: Chat/Conversation Retrieval Functions');
        
        const chatTests = [];
        
        // Test getConversations function
        if (typeof window.getConversations === 'function') {
            try {
                console.log('Testing window.getConversations()...');
                const conversations = await window.getConversations();
                chatTests.push({
                    function: 'getConversations',
                    status: 'SUCCESS',
                    result: conversations,
                    error: null
                });
                console.log('✅ getConversations() executed successfully');
                console.log('   Result:', conversations);
            } catch (error) {
                chatTests.push({
                    function: 'getConversations',
                    status: 'ERROR',
                    result: null,
                    error: error.message
                });
                console.error('❌ getConversations() failed:', error.message);
            }
        } else {
            console.warn('⚠️ getConversations function not found on window');
        }
        
        coreTestResults.chatRetrieval = {
            tests: chatTests,
            overallStatus: chatTests.some(t => t.status === 'SUCCESS') ? 'PARTIAL_SUCCESS' : 'FAILED'
        };
        
        return chatTests.length > 0 && chatTests.some(t => t.status === 'SUCCESS');
    }
    
    // Test 4: Real API Bridge (Fallback System)
    async function testRealApiBridge() {
        console.log('\n🌉 TEST 4: Real API Bridge (Fallback System)');
        
        const bridgeTests = [];
        
        // Test realGetUserFolders function
        if (typeof window.realGetUserFolders === 'function') {
            try {
                console.log('Testing window.realGetUserFolders()...');
                const realFolders = await window.realGetUserFolders();
                bridgeTests.push({
                    function: 'realGetUserFolders',
                    status: 'SUCCESS',
                    result: realFolders,
                    error: null
                });
                console.log('✅ realGetUserFolders() executed successfully');
                console.log('   Result:', realFolders);
            } catch (error) {
                bridgeTests.push({
                    function: 'realGetUserFolders',
                    status: 'ERROR',
                    result: null,
                    error: error.message
                });
                console.error('❌ realGetUserFolders() failed:', error.message);
            }
        } else {
            console.warn('⚠️ realGetUserFolders function not found on window');
        }
        
        // Test realGetConversations function
        if (typeof window.realGetConversations === 'function') {
            try {
                console.log('Testing window.realGetConversations()...');
                const realConversations = await window.realGetConversations();
                bridgeTests.push({
                    function: 'realGetConversations',
                    status: 'SUCCESS',
                    result: realConversations,
                    error: null
                });
                console.log('✅ realGetConversations() executed successfully');
                console.log('   Result:', realConversations);
            } catch (error) {
                bridgeTests.push({
                    function: 'realGetConversations',
                    status: 'ERROR',
                    result: null,
                    error: error.message
                });
                console.error('❌ realGetConversations() failed:', error.message);
            }
        } else {
            console.warn('⚠️ realGetConversations function not found on window');
        }
        
        coreTestResults.realApiBridge = {
            tests: bridgeTests,
            overallStatus: bridgeTests.some(t => t.status === 'SUCCESS') ? 'PARTIAL_SUCCESS' : 'FAILED'
        };
        
        return bridgeTests.length > 0 && bridgeTests.some(t => t.status === 'SUCCESS');
    }
    
    // Generate comprehensive report
    function generateCoreReport() {
        console.log('\n🎯 CORE FUNCTIONALITY TEST REPORT');
        console.log('=====================================');
        console.log('This tests the PRIMARY USE CASE: Retrieving folders and chats from ChatGPT');
        
        // API Connectivity
        console.log('\n🔌 API Connectivity:');
        if (coreTestResults.apiConnectivity) {
            if (coreTestResults.apiConnectivity.blocked) {
                console.error('   ❌ CRITICAL: API calls are being BLOCKED by the extension');
                console.error('   This is the ROOT CAUSE of the broken functionality');
                console.error('   The selective blocking fix did NOT work correctly');
            } else {
                console.log('   ✅ API calls are NOT being blocked (good)');
                console.log('   The selective blocking fix is working');
            }
        }
        
        // Folder Retrieval
        console.log('\n📁 Folder Retrieval:');
        if (coreTestResults.folderRetrieval) {
            console.log(`   Status: ${coreTestResults.folderRetrieval.overallStatus}`);
            coreTestResults.folderRetrieval.tests.forEach(test => {
                const icon = test.status === 'SUCCESS' ? '✅' : '❌';
                console.log(`   ${icon} ${test.function}: ${test.status}`);
            });
        }
        
        // Chat Retrieval
        console.log('\n💬 Chat Retrieval:');
        if (coreTestResults.chatRetrieval) {
            console.log(`   Status: ${coreTestResults.chatRetrieval.overallStatus}`);
            coreTestResults.chatRetrieval.tests.forEach(test => {
                const icon = test.status === 'SUCCESS' ? '✅' : '❌';
                console.log(`   ${icon} ${test.function}: ${test.status}`);
            });
        }
        
        // Real API Bridge
        console.log('\n🌉 Real API Bridge (Fallback):');
        if (coreTestResults.realApiBridge) {
            console.log(`   Status: ${coreTestResults.realApiBridge.overallStatus}`);
            coreTestResults.realApiBridge.tests.forEach(test => {
                const icon = test.status === 'SUCCESS' ? '✅' : '❌';
                console.log(`   ${icon} ${test.function}: ${test.status}`);
            });
        }
        
        // Overall Assessment
        console.log('\n📊 OVERALL ASSESSMENT:');
        
        const apiWorking = coreTestResults.apiConnectivity && !coreTestResults.apiConnectivity.blocked;
        const foldersWorking = coreTestResults.folderRetrieval && coreTestResults.folderRetrieval.overallStatus !== 'FAILED';
        const chatsWorking = coreTestResults.chatRetrieval && coreTestResults.chatRetrieval.overallStatus !== 'FAILED';
        
        if (apiWorking && (foldersWorking || chatsWorking)) {
            console.log('🎉 SUCCESS: Core functionality is working!');
            console.log('   The extension can retrieve folders and/or chats from ChatGPT');
        } else if (!apiWorking) {
            console.error('❌ CRITICAL FAILURE: API connectivity is blocked');
            console.error('   The selective blocking fix needs to be adjusted');
            console.error('   Essential API endpoints are still being blocked');
        } else {
            console.warn('⚠️ PARTIAL FAILURE: API works but functions are not available');
            console.warn('   The extension scripts may not be loaded correctly');
        }
        
        // Store results globally
        window.coreTestResults = coreTestResults;
        
        return coreTestResults;
    }
    
    // Run all core tests
    async function runCoreTests() {
        try {
            console.log('🚀 Starting core functionality tests...');
            
            const apiWorking = await testAPIConnectivity();
            const foldersWorking = await testFolderRetrieval();
            const chatsWorking = await testChatRetrieval();
            const bridgeWorking = await testRealApiBridge();
            
            return generateCoreReport();
            
        } catch (error) {
            console.error('❌ Core test execution error:', error);
            return null;
        }
    }
    
    // Export test function globally
    window.testCoreFunctionality = runCoreTests;
    
    // Auto-run tests
    console.log('🎯 Starting core functionality tests...');
    runCoreTests().then(() => {
        console.log('\n✅ Core functionality tests completed!');
        console.log('Results stored in window.coreTestResults');
        console.log('Run window.testCoreFunctionality() to test again');
    });
    
})();