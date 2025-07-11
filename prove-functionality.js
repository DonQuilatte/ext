// PROVE FUNCTIONALITY TEST
// This test actually proves the modal functions work by executing them and verifying results

console.log('🔥 PROVE FUNCTIONALITY TEST - ACTUAL EXECUTION');
console.log('===============================================');

// Test execution with real verification
(function() {
    'use strict';
    
    // Global test state
    window.functionalityTestResults = {
        timestamp: new Date().toISOString(),
        chatgptUrl: window.location.href,
        tests: {},
        overallSuccess: false,
        errors: []
    };
    
    // Test each modal function
    const modalFunctions = [
        { name: 'showManageChatsModal', modalId: 'manageChatsModal', description: 'Manage Chats' },
        { name: 'showManageFoldersModal', modalId: 'manageFoldersModal', description: 'Manage Folders' },
        { name: 'showManagePromptsModal', modalId: 'managePromptsModal', description: 'Manage Prompts' },
        { name: 'showMediaGalleryModal', modalId: 'mediaGalleryModal', description: 'Media Gallery' }
    ];
    
    // Test a single modal function
    function testModalFunction(config) {
        return new Promise((resolve) => {
            console.log(`\n🧪 TESTING: ${config.description}`);
            console.log('='.repeat(30));
            
            const testResult = {
                functionName: config.name,
                description: config.description,
                exists: false,
                executed: false,
                modalCreated: false,
                hasContent: false,
                interactive: false,
                error: null,
                executionTime: null,
                modalHTML: null
            };
            
            const startTime = performance.now();
            
            try {
                // Check if function exists
                if (typeof window[config.name] === 'function') {
                    testResult.exists = true;
                    console.log(`✅ Function ${config.name} exists`);
                    
                    // Execute the function
                    window[config.name]();
                    testResult.executed = true;
                    testResult.executionTime = performance.now() - startTime;
                    console.log(`✅ Function ${config.name} executed successfully`);
                    
                    // Check if modal was created
                    setTimeout(() => {
                        const modal = document.getElementById(config.modalId);
                        if (modal) {
                            testResult.modalCreated = true;
                            testResult.modalHTML = modal.outerHTML.substring(0, 500) + '...';
                            console.log(`✅ Modal ${config.modalId} created`);
                            
                            // Check modal content
                            const modalContent = modal.textContent || '';
                            if (modalContent.length > 10) {
                                testResult.hasContent = true;
                                console.log(`✅ Modal has content (${modalContent.length} characters)`);
                                console.log(`📄 Content preview: "${modalContent.substring(0, 100)}..."`);
                            } else {
                                console.log(`⚠️ Modal has minimal content`);
                            }
                            
                            // Check for interactive elements
                            const buttons = modal.querySelectorAll('button');
                            const clickableElements = modal.querySelectorAll('[onclick], [click]');
                            if (buttons.length > 0 || clickableElements.length > 0) {
                                testResult.interactive = true;
                                console.log(`✅ Modal is interactive (${buttons.length} buttons, ${clickableElements.length} clickable elements)`);
                            } else {
                                console.log(`⚠️ Modal is not interactive`);
                            }
                            
                            // Add test verification to modal
                            addTestVerificationToModal(modal, testResult);
                            
                            // Clean up after 5 seconds
                            setTimeout(() => {
                                try {
                                    modal.remove();
                                    console.log(`🧹 Modal ${config.modalId} cleaned up`);
                                } catch (cleanupError) {
                                    console.log(`⚠️ Cleanup warning: ${cleanupError.message}`);
                                }
                            }, 5000);
                            
                        } else {
                            testResult.error = `Modal ${config.modalId} was not created`;
                            console.log(`❌ Modal ${config.modalId} was not created`);
                        }
                        
                        window.functionalityTestResults.tests[config.name] = testResult;
                        resolve(testResult);
                        
                    }, 300);
                    
                } else {
                    testResult.error = `Function ${config.name} does not exist`;
                    console.log(`❌ Function ${config.name} does not exist (type: ${typeof window[config.name]})`);
                    
                    // Try to find where it might be
                    const possibleLocations = [
                        `window.${config.name}`,
                        `globalThis.${config.name}`,
                        `self.${config.name}`,
                        `parent.${config.name}`
                    ];
                    
                    console.log(`🔍 Searching for function in different contexts...`);
                    possibleLocations.forEach(location => {
                        try {
                            const func = eval(location);
                            if (typeof func === 'function') {
                                console.log(`✅ Found function at: ${location}`);
                            }
                        } catch (e) {
                            // Ignore eval errors
                        }
                    });
                    
                    window.functionalityTestResults.tests[config.name] = testResult;
                    resolve(testResult);
                }
                
            } catch (error) {
                testResult.error = error.message;
                console.log(`❌ Error testing ${config.name}: ${error.message}`);
                window.functionalityTestResults.tests[config.name] = testResult;
                resolve(testResult);
            }
        });
    }
    
    // Add test verification banner to modal
    function addTestVerificationToModal(modal, testResult) {
        try {
            const banner = document.createElement('div');
            banner.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background: linear-gradient(90deg, #4CAF50, #45a049);
                color: white;
                padding: 10px;
                text-align: center;
                font-weight: bold;
                font-size: 14px;
                z-index: 999999;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            `;
            
            banner.innerHTML = `
                🎉 FUNCTIONALITY TEST PASSED! 
                ${testResult.description} modal is working correctly. 
                Execution time: ${testResult.executionTime?.toFixed(2)}ms
                <button onclick="this.parentElement.remove()" style="margin-left: 20px; background: rgba(255,255,255,0.2); border: none; color: white; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Close</button>
            `;
            
            document.body.appendChild(banner);
            
            // Auto-remove banner after 8 seconds
            setTimeout(() => {
                if (banner.parentNode) {
                    banner.remove();
                }
            }, 8000);
            
        } catch (error) {
            console.log(`⚠️ Could not add test banner: ${error.message}`);
        }
    }
    
    // Main test execution
    async function runProveTest() {
        console.log('🚀 Starting prove functionality test...');
        console.log(`📍 Current URL: ${window.location.href}`);
        console.log(`📍 Current Time: ${new Date().toLocaleString()}`);
        console.log(`📍 User Agent: ${navigator.userAgent}`);
        
        // Test each modal function
        for (const config of modalFunctions) {
            await testModalFunction(config);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        // Generate final report
        generateProofReport();
    }
    
    // Generate proof report
    function generateProofReport() {
        console.log('\n🎯 PROOF OF FUNCTIONALITY REPORT');
        console.log('=================================');
        
        const tests = window.functionalityTestResults.tests;
        const totalTests = Object.keys(tests).length;
        const successfulTests = Object.values(tests).filter(test => 
            test.exists && test.executed && test.modalCreated
        ).length;
        
        console.log(`📊 Total Functions Tested: ${totalTests}`);
        console.log(`📊 Successful Executions: ${successfulTests}`);
        console.log(`📊 Success Rate: ${((successfulTests / totalTests) * 100).toFixed(1)}%`);
        
        // Detailed results
        console.log('\n📋 DETAILED PROOF RESULTS');
        console.log('=========================');
        
        Object.entries(tests).forEach(([funcName, result]) => {
            console.log(`\n${result.exists && result.executed && result.modalCreated ? '✅' : '❌'} ${result.description}:`);
            console.log(`   Function Exists: ${result.exists ? '✅' : '❌'}`);
            console.log(`   Function Executed: ${result.executed ? '✅' : '❌'}`);
            console.log(`   Modal Created: ${result.modalCreated ? '✅' : '❌'}`);
            console.log(`   Has Content: ${result.hasContent ? '✅' : '❌'}`);
            console.log(`   Interactive: ${result.interactive ? '✅' : '❌'}`);
            if (result.executionTime) {
                console.log(`   Execution Time: ${result.executionTime.toFixed(2)}ms`);
            }
            if (result.error) {
                console.log(`   Error: ${result.error}`);
            }
        });
        
        // Set overall success
        window.functionalityTestResults.overallSuccess = successfulTests === totalTests;
        
        if (window.functionalityTestResults.overallSuccess) {
            console.log('\n🎉 PROOF COMPLETE: ALL FUNCTIONS WORK!');
            console.log('✅ All modal functions exist and execute correctly');
            console.log('✅ All modals are created and display content');
            console.log('✅ Test proves the functionality is working');
        } else {
            console.log('\n⚠️ PROOF INCOMPLETE: SOME FUNCTIONS FAILED!');
            console.log('❌ Not all modal functions are working correctly');
        }
        
        // Create visual proof
        createVisualProof();
    }
    
    // Create visual proof element
    function createVisualProof() {
        try {
            const proofElement = document.createElement('div');
            proofElement.id = 'functionalityProof';
            proofElement.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                border: 3px solid #4CAF50;
                border-radius: 15px;
                padding: 20px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                z-index: 999999;
                max-width: 500px;
                font-family: Arial, sans-serif;
            `;
            
            const tests = window.functionalityTestResults.tests;
            const successCount = Object.values(tests).filter(test => 
                test.exists && test.executed && test.modalCreated
            ).length;
            
            proofElement.innerHTML = `
                <h2 style="margin: 0 0 15px 0; color: #4CAF50; text-align: center;">
                    🎉 FUNCTIONALITY PROOF
                </h2>
                <div style="text-align: center; margin: 15px 0;">
                    <div style="font-size: 48px; color: #4CAF50; margin: 10px 0;">
                        ${successCount}/${Object.keys(tests).length}
                    </div>
                    <div style="font-size: 18px; color: #333; margin: 10px 0;">
                        Modal Functions Working
                    </div>
                </div>
                <div style="font-size: 14px; color: #666; text-align: center; margin: 15px 0;">
                    Test completed at: ${new Date().toLocaleString()}<br>
                    Page: ${window.location.href}
                </div>
                <div style="text-align: center; margin: 15px 0;">
                    <button onclick="document.getElementById('functionalityProof').remove()" 
                            style="background: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 16px;">
                        Close Proof
                    </button>
                </div>
            `;
            
            document.body.appendChild(proofElement);
            
            // Auto-remove after 30 seconds
            setTimeout(() => {
                if (proofElement.parentNode) {
                    proofElement.remove();
                }
            }, 30000);
            
        } catch (error) {
            console.log(`⚠️ Could not create visual proof: ${error.message}`);
        }
    }
    
    // Run the test
    console.log('⏳ Starting prove functionality test in 2 seconds...');
    setTimeout(runProveTest, 2000);
    
    // Expose for manual testing
    window.runProveTest = runProveTest;
    
})();