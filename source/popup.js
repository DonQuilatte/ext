// Ishka Extension Popup Script
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Ishka Extension Popup loaded');
    
    // DOM elements
    const elements = {
        statusIndicator: document.getElementById('statusIndicator'),
        statusText: document.getElementById('statusText'),
        connectionIndicator: document.getElementById('connectionIndicator'),
        connectionText: document.getElementById('connectionText'),
        manageBtn: document.getElementById('manageBtn'),
        refreshBtn: document.getElementById('refreshBtn'),
        chatgptBtn: document.getElementById('chatgptBtn'),
        version: document.getElementById('version')
    };
    
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
    
    // Check extension status - Local-only mode
    async function checkExtensionStatus() {
        try {
            // Check if extension is properly loaded
            const isActive = chrome.runtime && chrome.runtime.getManifest;
            
            updateIndicator(
                elements.statusIndicator,
                elements.statusText,
                isActive ? 'Active (Local Mode)' : false
            );
            
            return isActive;
        } catch (error) {
            console.error('Error checking extension status:', error);
            updateIndicator(
                elements.statusIndicator,
                elements.statusText,
                false
            );
            return false;
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
        if (elements.statusText) {
            elements.statusText.textContent = 'Checking...';
        }
        if (elements.connectionText) {
            elements.connectionText.textContent = 'Checking...';
        }
        
        await checkExtensionStatus();
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
        console.log('🚀 Initializing Ishka Extension Popup (Local Mode)');
        
        // Initial status checks
        await checkExtensionStatus();
        await checkChatGPTConnection();
        
        console.log('✅ Ishka Extension Popup initialized - All features available in local mode');
    }
    
    // Start initialization
    initialize();
});