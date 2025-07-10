// Ishka Extension Popup Script
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Ishka Extension Popup loaded');
    
    // DOM elements
    const elements = {
        premiumIndicator: document.getElementById('premiumIndicator'),
        premiumText: document.getElementById('premiumText'),
        connectionIndicator: document.getElementById('connectionIndicator'),
        connectionText: document.getElementById('connectionText'),
        manageBtn: document.getElementById('manageBtn'),
        refreshBtn: document.getElementById('refreshBtn'),
        chatgptBtn: document.getElementById('chatgptBtn'),
        version: document.getElementById('version')
    };
    
    // Storage keys to monitor
    const PREMIUM_KEYS = [
        'DEV_MODE_PREMIUM',
        'MOCK_PREMIUM',
        'isPremiumUser',
        'userPlan',
        'subscriptionStatus'
    ];
    
    // Update status indicator
    function updateIndicator(indicator, text, status) {
        if (!indicator || !text) return;
        
        indicator.className = 'status-indicator';
        if (status) {
            indicator.classList.add('online');
        } else {
            indicator.classList.add('offline');
        }
        
        text.textContent = status ? 
            (typeof status === 'string' ? status : 'Active') : 
            'Inactive';
    }
    
    // Check premium status - ALWAYS PREMIUM (Local-only mode)
    async function checkPremiumStatus() {
        try {
            // Always return premium status in local-only mode
            const isPremium = true;
            
            updateIndicator(
                elements.premiumIndicator,
                elements.premiumText,
                'Premium (Local)'
            );
            
            return isPremium;
        } catch (error) {
            console.error('Error checking premium status:', error);
            // Even on error, return premium status in local-only mode
            updateIndicator(
                elements.premiumIndicator,
                elements.premiumText,
                'Premium (Local)'
            );
            return true;
        }
    }
    
    // Check ChatGPT connection
    async function checkChatGPTConnection() {
        try {
            // Query ChatGPT tabs
            const tabs = await chrome.tabs.query({ url: 'https://chatgpt.com/*' });
            
            if (tabs.length === 0) {
                updateIndicator(
                    elements.connectionIndicator, 
                    elements.connectionText, 
                    false
                );
                elements.connectionText.textContent = 'No ChatGPT tabs';
                return false;
            }
            
            // Test content script communication
            let connected = false;
            for (const tab of tabs) {
                try {
                    const response = await chrome.tabs.sendMessage(tab.id, { 
                        action: 'healthCheck',
                        source: 'popup'
                    });
                    
                    if (response && response.status === 'ok') {
                        connected = true;
                        break;
                    }
                } catch (e) {
                    // Continue to next tab
                }
            }
            
            updateIndicator(
                elements.connectionIndicator, 
                elements.connectionText, 
                connected ? 'Connected' : false
            );
            
            if (!connected) {
                elements.connectionText.textContent = 'Not responding';
            }
            
            return connected;
        } catch (error) {
            console.error('Error checking ChatGPT connection:', error);
            updateIndicator(
                elements.connectionIndicator, 
                elements.connectionText, 
                false
            );
            elements.connectionText.textContent = 'Error';
            return false;
        }
    }
    
    // Open management page
    function openManagementPage() {
        const managementUrl = chrome.runtime.getURL('manage.html');
        chrome.tabs.create({ url: managementUrl });
        window.close(); // Close popup
    }
    
    // Open ChatGPT
    function openChatGPT() {
        chrome.tabs.create({ url: 'https://chatgpt.com' });
        window.close(); // Close popup
    }
    
    // Refresh status
    async function refreshStatus() {
        elements.premiumText.textContent = 'Checking...';
        elements.connectionText.textContent = 'Checking...';
        
        await checkPremiumStatus();
        await checkChatGPTConnection();
    }
    
    // Event listeners
    if (elements.manageBtn) {
        elements.manageBtn.addEventListener('click', openManagementPage);
    }
    
    if (elements.refreshBtn) {
        elements.refreshBtn.addEventListener('click', refreshStatus);
    }
    
    if (elements.chatgptBtn) {
        elements.chatgptBtn.addEventListener('click', openChatGPT);
    }
    
    // Set version
    if (elements.version) {
        try {
            const manifest = chrome.runtime.getManifest();
            elements.version.textContent = `v${manifest.version}`;
        } catch (e) {
            elements.version.textContent = 'v3.9.6';
        }
    }
    
    // Initialize
    async function initialize() {
        console.log('🚀 Initializing Ishka Extension Popup');
        
        // Initial status checks
        await checkPremiumStatus();
        await checkChatGPTConnection();
        
        console.log('✅ Ishka Extension Popup initialized');
    }
    
    // Start initialization
    initialize();
});