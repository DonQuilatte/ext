// Ishka Extension Management Script
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Ishka Extension Management loaded');
    
    // DOM elements
    const elements = {
        // Status indicators
        chatgptStatus: document.getElementById('chatgptStatus'),
        premiumStatus: document.getElementById('premiumStatus'),
        apiIndicator: document.getElementById('apiIndicator'),
        apiStatusText: document.getElementById('apiStatusText'),
        domIndicator: document.getElementById('domIndicator'),
        domStatusText: document.getElementById('domStatusText'),
        planIndicator: document.getElementById('planIndicator'),
        planText: document.getElementById('planText'),
        
        // Status values
        conversationCount: document.getElementById('conversationCount'),
        manageChatText: document.getElementById('manageChatText'),
        manageFolderText: document.getElementById('manageFolderText'),
        managePromptText: document.getElementById('managePromptText'),
        
        // Controls
        premiumToggle: document.getElementById('premiumToggle'),
        enableBtn: document.getElementById('enableBtn'),
        refreshBtn: document.getElementById('refreshBtn'),
        debugBtn: document.getElementById('debugBtn'),
        resetBtn: document.getElementById('resetBtn'),
        testConnectionBtn: document.getElementById('testConnectionBtn'),
        
        // Debug
        debugContent: document.getElementById('debugContent'),
        testResult: document.getElementById('testResult')
    };
    
    // Storage keys to monitor
    const PREMIUM_KEYS = [
        'DEV_MODE_PREMIUM',
        'MOCK_PREMIUM',
        'isPremiumUser',
        'userPlan',
        'subscriptionStatus'
    ];
    
    // Status tracking
    let statusData = {
        premium: false,
        chatgptConnected: false,
        apiWorking: false,
        domIntegrated: false,
        conversationCount: 0,
        features: {
            manageChats: false,
            manageFolders: false,
            managePrompts: false
        }
    };
    
    // Update status indicator
    function updateIndicator(element, status, text = '') {
        if (!element) return;
        
        element.className = 'status-indicator';
        if (status === 'online' || status === true) {
            element.classList.add('online');
        } else if (status === 'warning') {
            element.classList.add('warning');
        } else {
            element.classList.add('offline');
        }
        
        if (text && element.nextElementSibling) {
            element.nextElementSibling.textContent = text;
        }
    }
    
    // Check premium status - ALWAYS PREMIUM (Local-only mode)
    async function checkPremiumStatus() {
        try {
            // Always return premium status in local-only mode
            const isPremium = true;
            
            statusData.premium = isPremium;
            
            // Update premium indicators
            updateIndicator(elements.premiumStatus, isPremium);
            updateIndicator(elements.planIndicator, isPremium);
            
            if (elements.planText) {
                elements.planText.textContent = 'Premium (Local)';
            }
            
            // Update toggle
            if (elements.premiumToggle) {
                elements.premiumToggle.classList.add('active');
            }
            
            // Update feature status
            updateFeatureStatus(isPremium);
            
            return isPremium;
        } catch (error) {
            console.error('Error checking premium status:', error);
            // Even on error, return premium status in local-only mode
            updateIndicator(elements.premiumStatus, true);
            updateIndicator(elements.planIndicator, true);
            return true;
        }
    }
    
    // Update feature status - ALWAYS ENABLED (Local-only mode)
    function updateFeatureStatus(isPremium) {
        const features = ['manageChats', 'manageFolders', 'managePrompts'];
        const texts = [elements.manageChatText, elements.manageFolderText, elements.managePromptText];
        
        features.forEach((feature, index) => {
            if (texts[index]) {
                texts[index].textContent = 'Enabled (Local)';
                statusData.features[feature] = true; // Always enabled in local-only mode
            }
        });
    }
    
    // Test ChatGPT connection
    async function testChatGPTConnection() {
        try {
            elements.testResult.style.display = 'none';
            updateIndicator(elements.apiIndicator, 'warning', 'Testing...');
            updateIndicator(elements.domIndicator, 'warning', 'Testing...');
            
            // Query ChatGPT tabs
            const tabs = await chrome.tabs.query({ url: 'https://chatgpt.com/*' });
            
            if (tabs.length === 0) {
                throw new Error('No ChatGPT tabs found. Please open https://chatgpt.com');
            }
            
            statusData.chatgptConnected = true;
            updateIndicator(elements.chatgptStatus, true);
            
            // Test content script communication
            let communicationWorking = false;
            let conversationCount = 0;
            
            for (const tab of tabs) {
                try {
                    const response = await chrome.tabs.sendMessage(tab.id, { 
                        action: 'healthCheck',
                        source: 'management'
                    });
                    
                    if (response && response.status === 'ok') {
                        communicationWorking = true;
                        if (response.conversationCount) {
                            conversationCount = response.conversationCount;
                        }
                        break;
                    }
                } catch (e) {
                    // Continue to next tab
                }
            }
            
            statusData.apiWorking = communicationWorking;
            statusData.domIntegrated = communicationWorking;
            statusData.conversationCount = conversationCount;
            
            updateIndicator(elements.apiIndicator, communicationWorking, 
                communicationWorking ? 'Connected' : 'No Response');
            updateIndicator(elements.domIndicator, communicationWorking, 
                communicationWorking ? 'Active' : 'Inactive');
            
            if (elements.conversationCount) {
                elements.conversationCount.textContent = conversationCount;
            }
            
            // Show test result
            elements.testResult.className = 'test-result ' + (communicationWorking ? 'success' : 'error');
            elements.testResult.textContent = communicationWorking ? 
                `✅ Connection successful! Found ${conversationCount} conversations.` :
                '❌ Connection failed. Content scripts may not be loaded.';
            elements.testResult.style.display = 'block';
            
        } catch (error) {
            console.error('Connection test failed:', error);
            statusData.chatgptConnected = false;
            statusData.apiWorking = false;
            statusData.domIntegrated = false;
            
            updateIndicator(elements.chatgptStatus, false);
            updateIndicator(elements.apiIndicator, false, 'Error');
            updateIndicator(elements.domIndicator, false, 'Error');
            
            elements.testResult.className = 'test-result error';
            elements.testResult.textContent = `❌ ${error.message}`;
            elements.testResult.style.display = 'block';
        }
    }
    
    // Enable premium features
    async function enablePremiumFeatures() {
        try {
            updateIndicator(elements.premiumStatus, 'warning');
            if (elements.planText) {
                elements.planText.textContent = 'Enabling...';
            }
            
            // Set premium flags
            const premiumData = {
                'DEV_MODE_PREMIUM': true,
                'MOCK_PREMIUM': true,
                'isPremiumUser': true,
                'userPlan': 'premium',
                'subscriptionStatus': 'active',
                'planType': 'premium'
            };
            
            await chrome.storage.local.set(premiumData);
            
            // Set extension-specific key
            const storeResult = await chrome.storage.local.get('store');
            const store = storeResult.store || {};
            store['-r.6es£Jr1U0'] = true;
            await chrome.storage.local.set({ store: store });
            
            // Notify content scripts
            try {
                const tabs = await chrome.tabs.query({ url: 'https://chatgpt.com/*' });
                for (const tab of tabs) {
                    chrome.tabs.sendMessage(tab.id, { 
                        action: 'premiumEnabled',
                        source: 'management'
                    }).catch(() => {}); // Ignore errors
                }
            } catch (e) {
                // Ignore tab messaging errors
            }
            
            setTimeout(() => {
                checkPremiumStatus();
            }, 500);
            
        } catch (error) {
            console.error('Error enabling premium:', error);
            updateIndicator(elements.premiumStatus, false);
            if (elements.planText) {
                elements.planText.textContent = 'Error';
            }
        }
    }
    
    // Reset all settings
    async function resetSettings() {
        if (!confirm('Are you sure you want to reset all extension settings? This will disable premium features.')) {
            return;
        }
        
        try {
            // Clear premium keys
            await chrome.storage.local.remove(PREMIUM_KEYS);
            
            // Clear store data
            const storeResult = await chrome.storage.local.get('store');
            if (storeResult.store) {
                delete storeResult.store['-r.6es£Jr1U0'];
                await chrome.storage.local.set({ store: storeResult.store });
            }
            
            // Reset status
            statusData.premium = false;
            statusData.features = {
                manageChats: false,
                manageFolders: false,
                managePrompts: false
            };
            
            // Refresh UI
            setTimeout(() => {
                checkPremiumStatus();
                testChatGPTConnection();
            }, 500);
            
        } catch (error) {
            console.error('Error resetting settings:', error);
        }
    }
    
    // Toggle premium features
    async function togglePremium() {
        const currentStatus = await checkPremiumStatus();
        if (!currentStatus) {
            await enablePremiumFeatures();
        } else {
            await resetSettings();
        }
    }
    
    // Run debug analysis
    async function runDebugAnalysis() {
        try {
            elements.debugContent.textContent = 'Running debug analysis...';
            
            // Get all storage data
            const allData = await chrome.storage.local.get(null);
            const syncData = await chrome.storage.sync.get(null);
            
            // Get tab information
            const tabs = await chrome.tabs.query({ url: 'https://chatgpt.com/*' });
            
            // Build debug info
            const debugInfo = {
                timestamp: new Date().toISOString(),
                extension: {
                    version: chrome.runtime.getManifest().version,
                    id: chrome.runtime.id
                },
                storage: {
                    local: allData,
                    sync: syncData
                },
                tabs: tabs.map(tab => ({
                    id: tab.id,
                    url: tab.url,
                    title: tab.title
                })),
                status: statusData
            };
            
            elements.debugContent.textContent = JSON.stringify(debugInfo, null, 2);
            
            console.log('=== ISHKA DEBUG ANALYSIS ===');
            console.log(debugInfo);
            
            // Send debug message to content scripts
            for (const tab of tabs) {
                try {
                    chrome.tabs.sendMessage(tab.id, { 
                        action: 'runDebug',
                        source: 'management'
                    }).catch(() => {});
                } catch (e) {
                    // Ignore errors
                }
            }
            
        } catch (error) {
            console.error('Error running debug:', error);
            elements.debugContent.textContent = `Debug Error: ${error.message}`;
        }
    }
    
    // Event listeners
    if (elements.premiumToggle) {
        elements.premiumToggle.addEventListener('click', togglePremium);
    }
    
    if (elements.enableBtn) {
        elements.enableBtn.addEventListener('click', enablePremiumFeatures);
    }
    
    if (elements.refreshBtn) {
        elements.refreshBtn.addEventListener('click', () => {
            checkPremiumStatus();
            testChatGPTConnection();
        });
    }
    
    if (elements.debugBtn) {
        elements.debugBtn.addEventListener('click', runDebugAnalysis);
    }
    
    if (elements.resetBtn) {
        elements.resetBtn.addEventListener('click', resetSettings);
    }
    
    if (elements.testConnectionBtn) {
        elements.testConnectionBtn.addEventListener('click', testChatGPTConnection);
    }
    
    // Initialize
    async function initialize() {
        console.log('🚀 Initializing Ishka Extension Management');
        
        // Initial status checks
        await checkPremiumStatus();
        await testChatGPTConnection();
        
        // Set up auto-refresh for live indicators
        setInterval(async () => {
            await checkPremiumStatus();
            // Test connection less frequently to avoid spam
            if (Math.random() < 0.3) { // 30% chance every 5 seconds = roughly every 15 seconds
                await testChatGPTConnection();
            }
        }, 5000);
        
        console.log('✅ Ishka Extension Management initialized');
    }
    
    // Start initialization
    initialize();
});