// Comprehensive Modal Function Test
// This script tests all modal functions and provides detailed feedback

(function() {
    'use strict';
    
    console.log('🧪 COMPREHENSIVE MODAL FUNCTION TEST');
    console.log('=====================================');
    
    // Test configuration
    const modalFunctions = [
        {
            name: 'showManageChatsModal',
            modalId: 'manageChatsModal',
            description: 'Manage Chats Modal'
        },
        {
            name: 'showManageFoldersModal',
            modalId: 'manageFoldersModal',
            description: 'Manage Folders Modal'
        },
        {
            name: 'showManagePromptsModal',
            modalId: 'managePromptsModal',
            description: 'Manage Prompts Modal'
        },
        {
            name: 'showMediaGalleryModal',
            modalId: 'mediaGalleryModal',
            description: 'Media Gallery Modal'
        }
    ];
    
    // Test results
    const testResults = {
        availability: {},
        execution: {},
        cleanup: {},
        globalAccess: {}
    };
    
    console.log('\n📋 TEST 1: Function Availability');
    console.log('--------------------------------');
    
    modalFunctions.forEach(config => {
        const isAvailable = typeof window[config.name] === 'function';
        testResults.availability[config.name] = isAvailable;
        
        if (isAvailable) {
            console.log(`✅ ${config.description}: Available`);
        } else {
            console.log(`❌ ${config.description}: Not Available (type: ${typeof window[config.name]})`);
        }
    });
    
    console.log('\n📋 TEST 2: Global Context Access');
    console.log('--------------------------------');
    
    modalFunctions.forEach(config => {
        const tests = {
            window: config.name in window,
            globalThis: config.name in globalThis,
            direct: typeof eval(`typeof ${config.name} !== 'undefined' ? ${config.name} : undefined`) === 'function'
        };
        
        testResults.globalAccess[config.name] = tests;
        
        console.log(`🔍 ${config.description}:`);
        console.log(`   - window.${config.name}: ${tests.window ? '✅' : '❌'}`);
        console.log(`   - globalThis.${config.name}: ${tests.globalThis ? '✅' : '❌'}`);
        console.log(`   - direct access: ${tests.direct ? '✅' : '❌'}`);
    });
    
    console.log('\n📋 TEST 3: Function Execution');
    console.log('-----------------------------');
    
    modalFunctions.forEach(config => {
        if (typeof window[config.name] === 'function') {
            try {
                console.log(`🔬 Testing ${config.description}...`);
                window[config.name]();
                
                // Check if modal was created
                setTimeout(() => {
                    const modal = document.getElementById(config.modalId);
                    if (modal) {
                        console.log(`✅ ${config.description}: Modal created successfully`);
                        testResults.execution[config.name] = true;
                        
                        // Test cleanup
                        modal.remove();
                        const modalAfterRemoval = document.getElementById(config.modalId);
                        if (!modalAfterRemoval) {
                            console.log(`🧹 ${config.description}: Cleanup successful`);
                            testResults.cleanup[config.name] = true;
                        } else {
                            console.log(`⚠️ ${config.description}: Cleanup failed`);
                            testResults.cleanup[config.name] = false;
                        }
                    } else {
                        console.log(`❌ ${config.description}: Modal not created`);
                        testResults.execution[config.name] = false;
                    }
                }, 100);
                
            } catch (error) {
                console.log(`❌ ${config.description}: Execution failed -`, error.message);
                testResults.execution[config.name] = false;
            }
        } else {
            console.log(`⏭️ ${config.description}: Skipped (not available)`);
            testResults.execution[config.name] = false;
        }
    });
    
    // Summary after all tests
    setTimeout(() => {
        console.log('\n🎯 TEST SUMMARY');
        console.log('===============');
        
        const availableCount = Object.values(testResults.availability).filter(Boolean).length;
        const executionCount = Object.values(testResults.execution).filter(Boolean).length;
        const cleanupCount = Object.values(testResults.cleanup).filter(Boolean).length;
        
        console.log(`📊 Function Availability: ${availableCount}/${modalFunctions.length}`);
        console.log(`📊 Successful Execution: ${executionCount}/${modalFunctions.length}`);
        console.log(`📊 Successful Cleanup: ${cleanupCount}/${modalFunctions.length}`);
        
        if (availableCount === modalFunctions.length && executionCount === modalFunctions.length) {
            console.log('\n🎉 ALL TESTS PASSED! Modal functions are working correctly.');
        } else {
            console.log('\n⚠️ SOME TESTS FAILED. Check the results above for details.');
        }
        
        // Store results for debugging
        window.modalTestResults = testResults;
        console.log('\n📊 Detailed results stored in window.modalTestResults');
        
    }, 500);
    
})();

// Also expose a simple test function for manual testing
window.testModalFunctions = function() {
    console.log('🧪 Manual Modal Function Test');
    
    const funcs = ['showManageChatsModal', 'showManageFoldersModal', 'showManagePromptsModal', 'showMediaGalleryModal'];
    
    funcs.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            console.log(`✅ ${funcName} is available`);
            try {
                window[funcName]();
                console.log(`✅ ${funcName} executed successfully`);
            } catch (e) {
                console.log(`❌ ${funcName} failed:`, e.message);
            }
        } else {
            console.log(`❌ ${funcName} is not available`);
        }
    });
};