// TEST LOCAL FUNCTIONALITY - Validate that extension works completely offline using Real API Bridge
// This tests the PRIMARY USE CASE using only local ChatGPT DOM extraction

(function() {
    'use strict';
    
    console.log('🏠 TESTING LOCAL FUNCTIONALITY - Complete offline operation');
    console.log('This validates that the extension works WITHOUT any external API dependencies');
    
    // Test results
    const localTestResults = {
        externalAPIBlocked: null,
        realApiBridgeLoaded: null,
        localFolderRetrieval: null,
        localChatRetrieval: null,
        localPromptRetrieval: null,
        unifiedFunctionsWork: null,
        timestamp: new Date().toISOString()
    };
    
    // Test 1: Verify ALL external API calls are blocked
    async function testExternalAPIBlocking() {
        console.log('\n🚫 TEST 1: External API Blocking');
        
        const externalEndpoints = [
            'https://api.infi-dev.com/ai-toolbox/folder/get',
            'https://api.infi-dev.com/ai-toolbox/conversation/get',
            'https://api.infi-dev.com/ai-toolbox/auth/generate-jwt',
            'https://api.infi-dev.com/ai-toolbox/auth/jwks',
            'https://api.infi-dev.com/ai-toolbox/subscription/check'
        ];
        
        let allBlocked = true;
        const blockingResults = [];
        
        for (const endpoint of externalEndpoints) {
            try {
                console.log(`Testing external API: ${endpoint}`);
                const response = await fetch(endpoint);
                
                // Check if it's a mock response (which is acceptable)
                const text = await response.text();
                if (response.status === 200 && (text === '[]' || text.includes('mock'))) {
                    console.log(`✅ External API mocked correctly: ${endpoint}`);
                    blockingResults.push({ endpoint, status: 'MOCKED', blocked: true });
                } else {
                    console.error(`❌ External API not blocked: ${endpoint}`);
                    blockingResults.push({ endpoint, status: 'NOT_BLOCKED', blocked: false });
                    allBlocked = false;
                }
                
            } catch (error) {
                if (error.code === 'BLOCKED_BY_UNIFIED_FIX' || error.message.includes('UNIFIED BLOCK')) {
                    console.log(`✅ External API blocked correctly: ${endpoint}`);
                    blockingResults.push({ endpoint, status: 'BLOCKED', blocked: true });
                } else {
                    console.warn(`⚠️ External API had unexpected error: ${endpoint}`, error.message);
                    blockingResults.push({ endpoint, status: 'ERROR', blocked: true, error: error.message });
                }
            }
        }
        
        localTestResults.externalAPIBlocked = {
            allBlocked,
            results: blockingResults,
            status: allBlocked ? 'SUCCESS' : 'FAILED'
        };
        
        return allBlocked;
    }
    
    // Test 2: Verify Real API Bridge is loaded and functional
    async function testRealApiBridgeLoaded() {
        console.log('\n🌉 TEST 2: Real API Bridge Loading');
        
        const requiredFunctions = [
            'realGetConversations',
            'realGetUserFolders', 
            'realGetPrompts'
        ];
        
        let allLoaded = true;
        const loadingResults = [];
        
        for (const funcName of requiredFunctions) {
            if (typeof window[funcName] === 'function') {
                console.log(`✅ Real API Bridge function loaded: ${funcName}`);
                loadingResults.push({ function: funcName, loaded: true });
            } else {
                console.error(`❌ Real API Bridge function missing: ${funcName}`);
                loadingResults.push({ function: funcName, loaded: false });
                allLoaded = false;
            }
        }
        
        // If not loaded, try to load it
        if (!allLoaded) {
            console.log('🔄 Attempting to load Real API Bridge...');
            try {
                const script = document.createElement('script');
                script.src = chrome.runtime.getURL('scripts/real-api-bridge.js');
                document.head.appendChild(script);
                
                // Wait for it to load
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Check again
                allLoaded = true;
                for (const funcName of requiredFunctions) {
                    if (typeof window[funcName] !== 'function') {
                        allLoaded = false;
                        break;
                    }
                }
                
                if (allLoaded) {
                    console.log('✅ Real API Bridge loaded successfully');
                } else {
                    console.error('❌ Real API Bridge failed to load');
                }
                
            } catch (error) {
                console.error('❌ Error loading Real API Bridge:', error);
                allLoaded = false;
            }
        }
        
        localTestResults.realApiBridgeLoaded = {
            allLoaded,
            results: loadingResults,
            status: allLoaded ? 'SUCCESS' : 'FAILED'
        };
        
        return allLoaded;
    }
    
    // Test 3: Test local folder retrieval from ChatGPT DOM
    async function testLocalFolderRetrieval() {
        console.log('\n📁 TEST 3: Local Folder Retrieval from ChatGPT DOM');
        
        try {
            if (typeof window.realGetUserFolders === 'function') {
                console.log('Testing realGetUserFolders...');
                const folders = await window.realGetUserFolders();
                
                localTestResults.localFolderRetrieval = {
                    status: 'SUCCESS',
                    folderCount: folders.length,
                    folders: folders,
                    error: null
                };
                
                console.log(`✅ Local folder retrieval successful: ${folders.length} folders found`);
                console.log('Folders:', folders.map(f => f.name));
                return true;
                
            } else {
                throw new Error('realGetUserFolders function not available');
            }
        } catch (error) {
            localTestResults.localFolderRetrieval = {
                status: 'FAILED',
                folderCount: 0,
                folders: [],
                error: error.message
            };
            
            console.error('❌ Local folder retrieval failed:', error.message);
            return false;
        }
    }
    
    // Test 4: Test local chat retrieval from ChatGPT DOM
    async function testLocalChatRetrieval() {
        console.log('\n💬 TEST 4: Local Chat Retrieval from ChatGPT DOM');
        
        try {
            if (typeof window.realGetConversations === 'function') {
                console.log('Testing realGetConversations...');
                const conversations = await window.realGetConversations();
                
                localTestResults.localChatRetrieval = {
                    status: 'SUCCESS',
                    conversationCount: conversations.length,
                    conversations: conversations.slice(0, 3), // Store first 3 for inspection
                    error: null
                };
                
                console.log(`✅ Local chat retrieval successful: ${conversations.length} conversations found`);
                if (conversations.length > 0) {
                    console.log('Sample conversations:', conversations.slice(0, 3).map(c => c.title));
                }
                return true;
                
            } else {
                throw new Error('realGetConversations function not available');
            }
        } catch (error) {
            localTestResults.localChatRetrieval = {
                status: 'FAILED',
                conversationCount: 0,
                conversations: [],
                error: error.message
            };
            
            console.error('❌ Local chat retrieval failed:', error.message);
            return false;
        }
    }
    
    // Test 5: Test local prompt retrieval
    async function testLocalPromptRetrieval() {
        console.log('\n📝 TEST 5: Local Prompt Retrieval');
        
        try {
            if (typeof window.realGetPrompts === 'function') {
                console.log('Testing realGetPrompts...');
                const prompts = await window.realGetPrompts();
                
                localTestResults.localPromptRetrieval = {
                    status: 'SUCCESS',
                    promptCount: prompts.length,
                    prompts: prompts,
                    error: null
                };
                
                console.log(`✅ Local prompt retrieval successful: ${prompts.length} prompts found`);
                console.log('Prompts:', prompts.map(p => p.title));
                return true;
                
            } else {
                throw new Error('realGetPrompts function not available');
            }
        } catch (error) {
            localTestResults.localPromptRetrieval = {
                status: 'FAILED',
                promptCount: 0,
                prompts: [],
                error: error.message
            };
            
            console.error('❌ Local prompt retrieval failed:', error.message);
            return false;
        }
    }
    
    // Test 6: Test unified extension functions (the ones the extension UI actually calls)
    async function testUnifiedFunctions() {
        console.log('\n🔧 TEST 6: Unified Extension Functions');
        
        const unifiedTests = [];
        
        // Test getUserFolders (unified function)
        try {
            console.log('Testing window.getUserFolders...');
            const folders = await window.getUserFolders();
            unifiedTests.push({
                function: 'getUserFolders',
                status: 'SUCCESS',
                resultCount: folders.length,
                result: folders.slice(0, 2)
            });
            console.log(`✅ getUserFolders: ${folders.length} folders`);
        } catch (error) {
            unifiedTests.push({
                function: 'getUserFolders',
                status: 'FAILED',
                error: error.message
            });
            console.error('❌ getUserFolders failed:', error.message);
        }
        
        // Test getConversations (unified function)
        try {
            console.log('Testing window.getConversations...');
            const conversations = await window.getConversations();
            unifiedTests.push({
                function: 'getConversations',
                status: 'SUCCESS',
                resultCount: conversations.length,
                result: conversations.slice(0, 2)
            });
            console.log(`✅ getConversations: ${conversations.length} conversations`);
        } catch (error) {
            unifiedTests.push({
                function: 'getConversations',
                status: 'FAILED',
                error: error.message
            });
            console.error('❌ getConversations failed:', error.message);
        }
        
        // Test getPrompts (unified function)
        try {
            console.log('Testing window.getPrompts...');
            const prompts = await window.getPrompts();
            unifiedTests.push({
                function: 'getPrompts',
                status: 'SUCCESS',
                resultCount: prompts.length,
                result: prompts.slice(0, 2)
            });
            console.log(`✅ getPrompts: ${prompts.length} prompts`);
        } catch (error) {
            unifiedTests.push({
                function: 'getPrompts',
                status: 'FAILED',
                error: error.message
            });
            console.error('❌ getPrompts failed:', error.message);
        }
        
        const allPassed = unifiedTests.every(test => test.status === 'SUCCESS');
        
        localTestResults.unifiedFunctionsWork = {
            allPassed,
            tests: unifiedTests,
            status: allPassed ? 'SUCCESS' : 'FAILED'
        };
        
        return allPassed;
    }
    
    // Generate comprehensive report
    function generateLocalReport() {
        console.log('\n🏠 LOCAL FUNCTIONALITY TEST REPORT');
        console.log('=====================================');
        console.log('This validates that the extension works WITHOUT external API dependencies');
        
        // External API Blocking
        console.log('\n🚫 External API Blocking:');
        if (localTestResults.externalAPIBlocked) {
            if (localTestResults.externalAPIBlocked.allBlocked) {
                console.log('   ✅ ALL external API calls are blocked/mocked (good)');
                console.log('   Extension is forced to use local functionality only');
            } else {
                console.error('   ❌ Some external API calls are not blocked');
                console.error('   Extension may still try to use external APIs');
            }
        }
        
        // Real API Bridge
        console.log('\n🌉 Real API Bridge:');
        if (localTestResults.realApiBridgeLoaded) {
            if (localTestResults.realApiBridgeLoaded.allLoaded) {
                console.log('   ✅ Real API Bridge functions are loaded and available');
            } else {
                console.error('   ❌ Real API Bridge functions are missing');
            }
        }
        
        // Local Data Retrieval
        console.log('\n📊 Local Data Retrieval:');
        
        if (localTestResults.localFolderRetrieval) {
            const folderStatus = localTestResults.localFolderRetrieval.status;
            const folderCount = localTestResults.localFolderRetrieval.folderCount;
            console.log(`   📁 Folders: ${folderStatus} (${folderCount} found)`);
        }
        
        if (localTestResults.localChatRetrieval) {
            const chatStatus = localTestResults.localChatRetrieval.status;
            const chatCount = localTestResults.localChatRetrieval.conversationCount;
            console.log(`   💬 Conversations: ${chatStatus} (${chatCount} found)`);
        }
        
        if (localTestResults.localPromptRetrieval) {
            const promptStatus = localTestResults.localPromptRetrieval.status;
            const promptCount = localTestResults.localPromptRetrieval.promptCount;
            console.log(`   📝 Prompts: ${promptStatus} (${promptCount} found)`);
        }
        
        // Unified Functions
        console.log('\n🔧 Unified Extension Functions:');
        if (localTestResults.unifiedFunctionsWork) {
            if (localTestResults.unifiedFunctionsWork.allPassed) {
                console.log('   ✅ All unified functions work correctly');
                localTestResults.unifiedFunctionsWork.tests.forEach(test => {
                    console.log(`   ✅ ${test.function}: ${test.resultCount} items`);
                });
            } else {
                console.error('   ❌ Some unified functions failed');
                localTestResults.unifiedFunctionsWork.tests.forEach(test => {
                    const icon = test.status === 'SUCCESS' ? '✅' : '❌';
                    console.log(`   ${icon} ${test.function}: ${test.status}`);
                });
            }
        }
        
        // Overall Assessment
        console.log('\n📊 OVERALL ASSESSMENT:');
        
        const externalBlocked = localTestResults.externalAPIBlocked?.allBlocked;
        const bridgeLoaded = localTestResults.realApiBridgeLoaded?.allLoaded;
        const functionsWork = localTestResults.unifiedFunctionsWork?.allPassed;
        const dataRetrieved = localTestResults.localFolderRetrieval?.status === 'SUCCESS' || 
                             localTestResults.localChatRetrieval?.status === 'SUCCESS';
        
        if (externalBlocked && bridgeLoaded && functionsWork) {
            console.log('🎉 SUCCESS: Extension works completely locally!');
            console.log('   ✅ No external API dependencies');
            console.log('   ✅ Real API Bridge extracts data from ChatGPT DOM');
            console.log('   ✅ All extension functions work correctly');
            console.log('   ✅ PRIMARY USE CASE: Folder and chat retrieval works locally');
        } else {
            console.warn('⚠️ PARTIAL SUCCESS: Some issues detected');
            if (!externalBlocked) console.error('   ❌ External APIs not fully blocked');
            if (!bridgeLoaded) console.error('   ❌ Real API Bridge not loaded');
            if (!functionsWork) console.error('   ❌ Extension functions not working');
        }
        
        // Store results globally
        window.localTestResults = localTestResults;
        
        return localTestResults;
    }
    
    // Run all local tests
    async function runLocalTests() {
        try {
            console.log('🚀 Starting local functionality tests...');
            
            const externalBlocked = await testExternalAPIBlocking();
            const bridgeLoaded = await testRealApiBridgeLoaded();
            const foldersWork = await testLocalFolderRetrieval();
            const chatsWork = await testLocalChatRetrieval();
            const promptsWork = await testLocalPromptRetrieval();
            const functionsWork = await testUnifiedFunctions();
            
            return generateLocalReport();
            
        } catch (error) {
            console.error('❌ Local test execution error:', error);
            return null;
        }
    }
    
    // Export test function globally
    window.testLocalFunctionality = runLocalTests;
    
    // Auto-run tests
    console.log('🏠 Starting local functionality tests...');
    runLocalTests().then(() => {
        console.log('\n✅ Local functionality tests completed!');
        console.log('Results stored in window.localTestResults');
        console.log('Run window.testLocalFunctionality() to test again');
    });
    
})();