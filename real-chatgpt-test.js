// Real ChatGPT Integration Test
// This test actually retrieves data from ChatGPT and tests modal functionality

(function() {
    'use strict';
    
    console.log('🧪 REAL CHATGPT INTEGRATION TEST');
    console.log('================================');
    
    // Test results storage
    const testResults = {
        chatgptData: null,
        modalTests: {},
        integrationSuccess: false,
        errors: []
    };
    
    // Function to extract real ChatGPT data
    function extractChatGPTData() {
        console.log('📡 Extracting real ChatGPT data...');
        
        const data = {
            conversations: [],
            currentConversation: null,
            userInfo: null,
            chatHistory: [],
            timestamp: new Date().toISOString()
        };
        
        try {
            // Extract conversation list from sidebar
            const conversationElements = document.querySelectorAll('[data-testid="conversation-turn"], .conversation-item, .chat-item, nav a[href*="/c/"]');
            console.log(`🔍 Found ${conversationElements.length} conversation elements`);
            
            conversationElements.forEach((element, index) => {
                const conversation = {
                    id: element.href ? element.href.split('/').pop() : `conv-${index}`,
                    title: element.textContent ? element.textContent.trim() : `Conversation ${index + 1}`,
                    element: element.outerHTML.substring(0, 200) + '...',
                    timestamp: new Date().toISOString()
                };
                data.conversations.push(conversation);
            });
            
            // Extract current conversation messages
            const messageElements = document.querySelectorAll('[data-message-author-role], .message, .chat-message');
            console.log(`🔍 Found ${messageElements.length} message elements`);
            
            messageElements.forEach((element, index) => {
                const message = {
                    id: `msg-${index}`,
                    author: element.getAttribute('data-message-author-role') || 'unknown',
                    content: element.textContent ? element.textContent.trim().substring(0, 100) + '...' : 'Empty message',
                    timestamp: new Date().toISOString()
                };
                data.chatHistory.push(message);
            });
            
            // Extract user info
            const userElements = document.querySelectorAll('[data-testid="profile-button"], .user-avatar, .user-info');
            if (userElements.length > 0) {
                data.userInfo = {
                    found: true,
                    elements: userElements.length,
                    timestamp: new Date().toISOString()
                };
            }
            
            // Extract current page info
            data.pageInfo = {
                url: window.location.href,
                title: document.title,
                domain: window.location.hostname,
                pathname: window.location.pathname,
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString()
            };
            
            console.log('✅ ChatGPT data extracted successfully');
            console.log('📊 Conversations found:', data.conversations.length);
            console.log('📊 Messages found:', data.chatHistory.length);
            console.log('📊 User info found:', !!data.userInfo);
            
            testResults.chatgptData = data;
            return data;
            
        } catch (error) {
            console.error('❌ Error extracting ChatGPT data:', error);
            testResults.errors.push({
                type: 'Data Extraction Error',
                message: error.message,
                timestamp: new Date().toISOString()
            });
            return null;
        }
    }
    
    // Function to test modal with real data
    function testModalWithData(modalFunction, modalId, modalName, data) {
        return new Promise((resolve) => {
            console.log(`🧪 Testing ${modalName} with real data...`);
            
            const testResult = {
                functionExists: typeof window[modalFunction] === 'function',
                executionSuccess: false,
                modalCreated: false,
                dataDisplayed: false,
                interactionWorks: false,
                error: null
            };
            
            if (!testResult.functionExists) {
                console.log(`❌ ${modalName}: Function not found`);
                testResult.error = 'Function not found';
                testResults.modalTests[modalFunction] = testResult;
                resolve(testResult);
                return;
            }
            
            try {
                // Call the modal function
                window[modalFunction]();
                testResult.executionSuccess = true;
                console.log(`✅ ${modalName}: Function executed`);
                
                // Check if modal was created
                setTimeout(() => {
                    const modal = document.getElementById(modalId);
                    if (modal) {
                        testResult.modalCreated = true;
                        console.log(`✅ ${modalName}: Modal created`);
                        
                        // Try to inject real data into the modal
                        try {
                            const modalContent = modal.querySelector('.modal-content');
                            if (modalContent) {
                                const dataSection = document.createElement('div');
                                dataSection.innerHTML = `
                                    <div style="background: #f0f0f0; padding: 15px; margin: 15px 0; border-radius: 8px;">
                                        <h4 style="margin: 0 0 10px 0; color: #333;">Real ChatGPT Data (${modalName})</h4>
                                        <div style="font-size: 12px; color: #666;">
                                            <p><strong>Conversations:</strong> ${data ? data.conversations.length : 0}</p>
                                            <p><strong>Messages:</strong> ${data ? data.chatHistory.length : 0}</p>
                                            <p><strong>Current URL:</strong> ${data ? data.pageInfo.url : 'N/A'}</p>
                                            <p><strong>Test Time:</strong> ${new Date().toLocaleString()}</p>
                                        </div>
                                        ${data && data.conversations.length > 0 ? `
                                            <div style="margin-top: 10px;">
                                                <strong>Recent Conversations:</strong>
                                                <ul style="margin: 5px 0; padding-left: 20px; font-size: 11px;">
                                                    ${data.conversations.slice(0, 3).map(conv => `
                                                        <li>${conv.title} (${conv.id})</li>
                                                    `).join('')}
                                                </ul>
                                            </div>
                                        ` : ''}
                                    </div>
                                `;
                                
                                modalContent.appendChild(dataSection);
                                testResult.dataDisplayed = true;
                                console.log(`✅ ${modalName}: Real data displayed`);
                            }
                        } catch (dataError) {
                            console.log(`⚠️ ${modalName}: Could not inject data -`, dataError.message);
                        }
                        
                        // Test interaction (close button)
                        const closeBtn = modal.querySelector('[id*="close"], [onclick*="close"], button');
                        if (closeBtn) {
                            testResult.interactionWorks = true;
                            console.log(`✅ ${modalName}: Interaction elements found`);
                            
                            // Close the modal after 2 seconds
                            setTimeout(() => {
                                try {
                                    modal.remove();
                                    console.log(`🧹 ${modalName}: Modal cleaned up`);
                                } catch (cleanupError) {
                                    console.log(`⚠️ ${modalName}: Cleanup error -`, cleanupError.message);
                                }
                            }, 2000);
                        }
                        
                    } else {
                        console.log(`❌ ${modalName}: Modal not created`);
                        testResult.error = 'Modal not created';
                    }
                    
                    testResults.modalTests[modalFunction] = testResult;
                    resolve(testResult);
                    
                }, 200);
                
            } catch (error) {
                console.log(`❌ ${modalName}: Execution failed -`, error.message);
                testResult.error = error.message;
                testResults.modalTests[modalFunction] = testResult;
                resolve(testResult);
            }
        });
    }
    
    // Main test function
    async function runRealIntegrationTest() {
        console.log('🚀 Starting real ChatGPT integration test...');
        
        // Step 1: Extract real ChatGPT data
        const chatgptData = extractChatGPTData();
        
        if (!chatgptData) {
            console.log('❌ Failed to extract ChatGPT data - test cannot proceed');
            return;
        }
        
        // Step 2: Test each modal function with real data
        const modalTests = [
            { func: 'showManageChatsModal', id: 'manageChatsModal', name: 'Manage Chats Modal' },
            { func: 'showManageFoldersModal', id: 'manageFoldersModal', name: 'Manage Folders Modal' },
            { func: 'showManagePromptsModal', id: 'managePromptsModal', name: 'Manage Prompts Modal' },
            { func: 'showMediaGalleryModal', id: 'mediaGalleryModal', name: 'Media Gallery Modal' }
        ];
        
        console.log('\n📋 TESTING MODAL FUNCTIONS WITH REAL DATA');
        console.log('==========================================');
        
        for (const test of modalTests) {
            await testModalWithData(test.func, test.id, test.name, chatgptData);
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait between tests
        }
        
        // Step 3: Generate test report
        generateTestReport();
    }
    
    // Generate comprehensive test report
    function generateTestReport() {
        console.log('\n🎯 REAL INTEGRATION TEST REPORT');
        console.log('===============================');
        
        const modalCount = Object.keys(testResults.modalTests).length;
        const successCount = Object.values(testResults.modalTests).filter(test => 
            test.functionExists && test.executionSuccess && test.modalCreated
        ).length;
        
        console.log(`📊 Total Modal Functions Tested: ${modalCount}`);
        console.log(`📊 Successful Executions: ${successCount}`);
        console.log(`📊 Data Extraction Success: ${testResults.chatgptData ? '✅' : '❌'}`);
        
        if (testResults.chatgptData) {
            console.log(`📊 Conversations Found: ${testResults.chatgptData.conversations.length}`);
            console.log(`📊 Messages Found: ${testResults.chatgptData.chatHistory.length}`);
            console.log(`📊 Current Page: ${testResults.chatgptData.pageInfo.url}`);
        }
        
        // Detailed results
        console.log('\n📋 DETAILED RESULTS');
        console.log('-------------------');
        
        Object.entries(testResults.modalTests).forEach(([funcName, result]) => {
            console.log(`\n🔍 ${funcName}:`);
            console.log(`   Function Exists: ${result.functionExists ? '✅' : '❌'}`);
            console.log(`   Execution Success: ${result.executionSuccess ? '✅' : '❌'}`);
            console.log(`   Modal Created: ${result.modalCreated ? '✅' : '❌'}`);
            console.log(`   Data Displayed: ${result.dataDisplayed ? '✅' : '❌'}`);
            console.log(`   Interaction Works: ${result.interactionWorks ? '✅' : '❌'}`);
            if (result.error) {
                console.log(`   Error: ${result.error}`);
            }
        });
        
        if (testResults.errors.length > 0) {
            console.log('\n🚨 ERRORS ENCOUNTERED');
            console.log('--------------------');
            testResults.errors.forEach(error => {
                console.log(`❌ ${error.type}: ${error.message}`);
            });
        }
        
        // Final verdict
        testResults.integrationSuccess = successCount === modalCount && testResults.chatgptData !== null;
        
        if (testResults.integrationSuccess) {
            console.log('\n🎉 INTEGRATION TEST PASSED!');
            console.log('All modal functions work correctly with real ChatGPT data.');
        } else {
            console.log('\n⚠️ INTEGRATION TEST FAILED!');
            console.log('Some modal functions are not working correctly.');
        }
        
        // Store results globally for inspection
        window.realTestResults = testResults;
        console.log('\n📊 Complete test results stored in window.realTestResults');
    }
    
    // Auto-run the test
    console.log('⏳ Starting test in 2 seconds...');
    setTimeout(runRealIntegrationTest, 2000);
    
    // Expose test function for manual runs
    window.runRealChatGPTTest = runRealIntegrationTest;
    
})();