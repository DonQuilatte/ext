// Ishka Extension Management Script
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 Ishka Extension Management loaded');
    
    // DOM elements
    const elements = {
        // Status indicators
        chatgptStatus: document.getElementById('chatgptStatus'),
        localStatus: document.getElementById('localStatus'),
        apiIndicator: document.getElementById('apiIndicator'),
        apiStatusText: document.getElementById('apiStatusText'),
        domIndicator: document.getElementById('domIndicator'),
        domStatusText: document.getElementById('domStatusText'),
        modeIndicator: document.getElementById('modeIndicator'),
        modeText: document.getElementById('modeText'),
        
        // Status values
        conversationCount: document.getElementById('conversationCount'),
        manageChatText: document.getElementById('manageChatText'),
        manageFolderText: document.getElementById('manageFolderText'),
        managePromptText: document.getElementById('managePromptText'),
        
        // Controls
        refreshBtn: document.getElementById('refreshBtn'),
        debugBtn: document.getElementById('debugBtn'),
        resetBtn: document.getElementById('resetBtn'),
        testConnectionBtn: document.getElementById('testConnectionBtn'),
        
        // Debug
        debugContent: document.getElementById('debugContent'),
        testResult: document.getElementById('testResult')
    };
    
    // Storage keys to monitor (local settings only)
    const SETTINGS_KEYS = [
        'userPreferences',
        'extensionSettings',
        'localConfig'
    ];
    
    // Status tracking
    let statusData = {
        localMode: true,
        chatgptConnected: false,
        apiWorking: false,
        domIntegrated: false,
        conversationCount: 0,
        features: {
            manageChats: true,
            manageFolders: true,
            managePrompts: true
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
    
    // Check local mode status - ALWAYS LOCAL (Local-only mode)
    async function checkLocalStatus() {
        try {
            // Always return local mode status
            const isLocalMode = true;
            
            statusData.localMode = isLocalMode;
            
            // Update local mode indicators
            updateIndicator(elements.localStatus, isLocalMode);
            updateIndicator(elements.modeIndicator, isLocalMode);
            
            if (elements.modeText) {
                elements.modeText.textContent = 'Local Mode - All Features Enabled';
            }
            
            // Update feature status
            updateFeatureStatus();
            
            return isLocalMode;
        } catch (error) {
            console.error('Error checking local status:', error);
            // Even on error, return local mode status
            updateIndicator(elements.localStatus, true);
            updateIndicator(elements.modeIndicator, true);
            return true;
        }
    }
    
    // Update feature status - ALWAYS ENABLED (Local-only mode)
    function updateFeatureStatus() {
        const features = ['manageChats', 'manageFolders', 'managePrompts'];
        const texts = [elements.manageChatText, elements.manageFolderText, elements.managePromptText];
        
        features.forEach((feature, index) => {
            if (texts[index]) {
                texts[index].textContent = 'Enabled - Local Mode';
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
    
    // Initialize local mode features - always enabled
    async function initializeLocalFeatures() {
        try {
            // Notify content scripts about local mode
            try {
                const tabs = await chrome.tabs.query({ url: 'https://chatgpt.com/*' });
                for (const tab of tabs) {
                    chrome.tabs.sendMessage(tab.id, { 
                        action: 'localModeInitialized',
                        source: 'management'
                    }).catch(() => {}); // Ignore errors
                }
            } catch (e) {
                // Ignore tab messaging errors
            }
            
            setTimeout(() => {
                checkLocalStatus();
            }, 500);
            
        } catch (error) {
            console.error('Error initializing local features:', error);
        }
    }
    
    // Reset user settings (local mode always remains enabled)
    async function resetSettings() {
        if (!confirm('Are you sure you want to reset user settings? Extension will remain in local mode.')) {
            return;
        }
        
        try {
            // Clear user preference keys only
            await chrome.storage.local.remove(SETTINGS_KEYS);
            
            // Clear non-essential store data
            const storeResult = await chrome.storage.local.get('store');
            if (storeResult.store) {
                // Keep essential local mode functionality, clear user data
                const essentialKeys = ['-r.6es£Jr1U0'];
                const newStore = {};
                essentialKeys.forEach(key => {
                    if (storeResult.store[key]) {
                        newStore[key] = storeResult.store[key];
                    }
                });
                await chrome.storage.local.set({ store: newStore });
            }
            
            // Reset status (but keep local mode enabled)
            statusData.localMode = true;
            statusData.features = {
                manageChats: true,
                manageFolders: true,
                managePrompts: true
            };
            
            // Refresh UI
            setTimeout(() => {
                checkLocalStatus();
                testChatGPTConnection();
            }, 500);
            
        } catch (error) {
            console.error('Error resetting settings:', error);
        }
    }
    
    // Display local mode status (no toggling needed)
    async function displayLocalModeStatus() {
        await checkLocalStatus();
        console.log('Local mode is always enabled - all features available');
    }
    
    // Debug Dashboard State
    let debugData = {
        system: {},
        extension: {},
        errors: [],
        performance: {},
        testResults: {}
    };
    
    // Initialize Debug Dashboard
    function initializeDebugDashboard() {
        // Tab switching functionality
        const debugTabs = document.querySelectorAll('.debug-tab');
        const debugTabContents = document.querySelectorAll('.debug-tab-content');
        
        debugTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                // Update active tab
                debugTabs.forEach(t => t.classList.remove('active'));
                debugTabContents.forEach(content => content.classList.remove('active'));
                
                tab.classList.add('active');
                document.getElementById(`${targetTab}-tab`).classList.add('active');
                
                // Load tab-specific data
                loadTabData(targetTab);
            });
        });
        
        // Initialize button event listeners
        initializeDebugButtons();
        
        // Load initial data
        loadTabData('system');
        
        // Set up error tracking
        setupErrorTracking();
        
        // Start real-time monitoring
        startRealTimeMonitoring();
    }
    
    // Initialize debug button event listeners
    function initializeDebugButtons() {
        // API Testing buttons
        const runAllTestsBtn = document.getElementById('runAllTestsBtn');
        const testChatGPTBtn = document.getElementById('testChatGPTBtn');
        const testLocalFunctionsBtn = document.getElementById('testLocalFunctionsBtn');
        const testIntegrationBtn = document.getElementById('testIntegrationBtn');
        
        if (runAllTestsBtn) runAllTestsBtn.addEventListener('click', runAllTests);
        if (testChatGPTBtn) testChatGPTBtn.addEventListener('click', testChatGPTConnection);
        if (testLocalFunctionsBtn) testLocalFunctionsBtn.addEventListener('click', testLocalFunctions);
        if (testIntegrationBtn) testIntegrationBtn.addEventListener('click', testIntegration);
        
        // Error tracking buttons
        const clearErrorsBtn = document.getElementById('clearErrorsBtn');
        const exportErrorsBtn = document.getElementById('exportErrorsBtn');
        
        if (clearErrorsBtn) clearErrorsBtn.addEventListener('click', clearErrors);
        if (exportErrorsBtn) exportErrorsBtn.addEventListener('click', exportErrors);
        
        // Export buttons
        const generateReportBtn = document.getElementById('generateReportBtn');
        const exportSettingsBtn = document.getElementById('exportSettingsBtn');
        const exportLogsBtn = document.getElementById('exportLogsBtn');
        const copyDebugInfoBtn = document.getElementById('copyDebugInfoBtn');
        
        if (generateReportBtn) generateReportBtn.addEventListener('click', generateFullReport);
        if (exportSettingsBtn) exportSettingsBtn.addEventListener('click', exportSettings);
        if (exportLogsBtn) exportLogsBtn.addEventListener('click', exportLogs);
        if (copyDebugInfoBtn) copyDebugInfoBtn.addEventListener('click', copyDebugInfo);
    }
    
    // Load data for specific tab
    async function loadTabData(tabName) {
        switch (tabName) {
            case 'system':
                await loadSystemInfo();
                break;
            case 'extension':
                await loadExtensionState();
                break;
            case 'errors':
                loadErrorTracking();
                break;
            case 'performance':
                await loadPerformanceMetrics();
                break;
            case 'api':
                // API tab is loaded on demand when tests are run
                break;
            case 'export':
                // Export tab is static
                break;
        }
    }
    
    // Load system information
    async function loadSystemInfo() {
        try {
            const systemInfo = {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                onlineStatus: navigator.onLine ? 'Online' : 'Offline',
                connectionType: navigator.connection?.effectiveType || 'Unknown',
                corsStatus: 'Testing...'
            };
            
            // Get extension details with error handling
            let extensionInfo = {
                id: 'Not available (file:// context)',
                version: 'Not available',
                manifestVersion: 'Not available',
                permissions: 0
            };
            
            if (typeof chrome !== 'undefined' && chrome.runtime) {
                try {
                    const manifest = chrome.runtime.getManifest();
                    extensionInfo = {
                        id: chrome.runtime.id,
                        version: manifest.version,
                        manifestVersion: manifest.manifest_version,
                        permissions: manifest.permissions?.length || 0
                    };
                } catch (e) {
                    console.log('Chrome runtime not available:', e.message);
                }
            }
            
            // Get storage information with error handling
            let storageInfo = {
                localStorage: 'Not available',
                syncStorage: 'Not available',
                storageUsage: 'Not available'
            };
            
            if (typeof chrome !== 'undefined' && chrome.storage) {
                try {
                    const localData = await chrome.storage.local.get(null);
                    const syncData = await chrome.storage.sync.get(null);
                    storageInfo = {
                        localStorage: Object.keys(localData).length + ' keys',
                        syncStorage: Object.keys(syncData).length + ' keys',
                        storageUsage: JSON.stringify(localData).length + ' bytes (approx)'
                    };
                } catch (e) {
                    console.log('Chrome storage not available:', e.message);
                }
            }
            
            // Test CORS
            try {
                await fetch('https://chatgpt.com', { method: 'HEAD' });
                systemInfo.corsStatus = 'Allowed';
            } catch (error) {
                systemInfo.corsStatus = 'Blocked/Error';
            }
            
            // Update UI
            updateSystemInfoUI(systemInfo, extensionInfo, storageInfo);
            
            debugData.system = { ...systemInfo, ...extensionInfo, ...storageInfo };
            
        } catch (error) {
            console.error('Error loading system info:', error);
        }
    }
    
    // Update system info UI
    function updateSystemInfoUI(systemInfo, extensionInfo, storageInfo) {
        const updateElement = (id, value) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        };
        
        // Browser info
        updateElement('userAgent', systemInfo.userAgent.substring(0, 50) + '...');
        updateElement('platform', systemInfo.platform);
        updateElement('language', systemInfo.language);
        updateElement('timezone', systemInfo.timezone);
        
        // Extension info
        updateElement('extensionId', extensionInfo.id);
        updateElement('extensionVersion', extensionInfo.version);
        updateElement('manifestVersion', extensionInfo.manifestVersion);
        updateElement('permissions', extensionInfo.permissions + ' permissions');
        
        // Storage info
        updateElement('localStorage', storageInfo.localStorage);
        updateElement('syncStorage', storageInfo.syncStorage);
        updateElement('storageUsage', storageInfo.storageUsage);
        
        // Network info
        updateElement('onlineStatus', systemInfo.onlineStatus);
        updateElement('connectionType', systemInfo.connectionType);
        updateElement('corsStatus', systemInfo.corsStatus);
    }
    
    // Load extension state
    async function loadExtensionState() {
        try {
            let tabs = [];
            let scriptsLoaded = 0;
            
            // Get tabs with error handling
            if (typeof chrome !== 'undefined' && chrome.tabs) {
                try {
                    tabs = await chrome.tabs.query({ url: 'https://chatgpt.com/*' });
                } catch (e) {
                    console.log('Chrome tabs not available:', e.message);
                }
            }
            
            const extensionState = {
                scriptsLoaded: 'Testing...',
                domReady: document.readyState,
                chatgptIntegration: tabs.length > 0 ? 'Connected' : (typeof chrome !== 'undefined' ? 'No ChatGPT tabs' : 'Not available (file:// context)'),
                manageChatFeature: 'Enabled',
                manageFolderFeature: 'Enabled',
                managePromptFeature: 'Enabled',
                workerStatus: typeof chrome !== 'undefined' ? 'Active' : 'Not available',
                messagePort: typeof chrome !== 'undefined' ? 'Connected' : 'Not available',
                elementsFound: document.querySelectorAll('*').length,
                eventListeners: 'Calculating...',
                context: window.location.protocol === 'file:' ? 'File System (Testing)' : 'Extension Context'
            };
            
            // Test content script communication with error handling
            if (tabs.length > 0 && typeof chrome !== 'undefined' && chrome.tabs) {
                for (const tab of tabs) {
                    try {
                        const response = await chrome.tabs.sendMessage(tab.id, {
                            action: 'healthCheck',
                            source: 'debugDashboard'
                        });
                        if (response && response.status === 'ok') {
                            scriptsLoaded++;
                        }
                    } catch (e) {
                        // Script not loaded in this tab
                    }
                }
                extensionState.scriptsLoaded = `${scriptsLoaded}/${tabs.length} tabs`;
            } else {
                extensionState.scriptsLoaded = typeof chrome !== 'undefined' ? '0/0 tabs' : 'Not available (file:// context)';
            }
            
            // Update UI
            updateExtensionStateUI(extensionState);
            
            debugData.extension = extensionState;
            
        } catch (error) {
            console.error('Error loading extension state:', error);
        }
    }
    
    // Update extension state UI
    function updateExtensionStateUI(state) {
        const updateElement = (id, value) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        };
        
        updateElement('scriptsLoaded', state.scriptsLoaded);
        updateElement('domReady', state.domReady);
        updateElement('chatgptIntegration', state.chatgptIntegration);
        updateElement('manageChatFeature', state.manageChatFeature);
        updateElement('manageFolderFeature', state.manageFolderFeature);
        updateElement('managePromptFeature', state.managePromptFeature);
        updateElement('workerStatus', state.workerStatus);
        updateElement('messagePort', state.messagePort);
        updateElement('elementsFound', state.elementsFound);
        updateElement('eventListeners', state.eventListeners);
    }
    
    // Setup error tracking
    function setupErrorTracking() {
        // Clear existing errors
        debugData.errors = [];
        
        // Track unhandled promise rejections
        window.addEventListener('unhandledrejection', function(event) {
            const error = {
                type: 'Unhandled Promise Rejection',
                message: event.reason?.message || event.reason,
                timestamp: new Date().toISOString(),
                stack: event.reason?.stack
            };
            debugData.errors.push(error);
            updateErrorDisplay();
        });
        
        // Track global errors
        window.addEventListener('error', function(event) {
            const error = {
                type: 'JavaScript Error',
                message: event.message,
                filename: event.filename,
                line: event.lineno,
                column: event.colno,
                timestamp: new Date().toISOString(),
                stack: event.error?.stack
            };
            debugData.errors.push(error);
            updateErrorDisplay();
        });
    }
    
    // Load error tracking data
    function loadErrorTracking() {
        updateErrorDisplay();
        
        // Update error count
        const errorCount = document.getElementById('errorCount');
        if (errorCount) {
            errorCount.textContent = debugData.errors.length;
        }
        
        // Update error badge
        const errorBadge = document.querySelector('.nav-item[data-tab="errors"] .badge');
        if (errorBadge) {
            errorBadge.textContent = debugData.errors.length;
            errorBadge.style.display = debugData.errors.length > 0 ? 'inline' : 'none';
        }
        
        console.log('Error tracking loaded:', debugData.errors.length, 'errors');
    }
    
    // Update error display
    function updateErrorDisplay() {
        const errorList = document.getElementById('errorList');
        if (!errorList) return;
        
        if (debugData.errors.length === 0) {
            errorList.innerHTML = '<div style="text-align: center; padding: 20px; color: rgba(255,255,255,0.6);">No errors recorded yet</div>';
            return;
        }
        
        const errorHTML = debugData.errors.map(error => `
            <div class="error-item">
                <div class="error-time">${new Date(error.timestamp).toLocaleTimeString()}</div>
                <div class="error-message"><strong>${error.type}:</strong> ${error.message}</div>
                ${error.filename ? `<div style="font-size: 11px; opacity: 0.7;">${error.filename}:${error.line}:${error.column}</div>` : ''}
            </div>
        `).join('');
        
        errorList.innerHTML = errorHTML;
    }
    
    // Load performance metrics
    async function loadPerformanceMetrics() {
        try {
            const performance = window.performance;
            const memory = performance.memory;
            
            const metrics = {
                extensionLoadTime: performance.now().toFixed(2) + 'ms',
                contentScriptTime: 'N/A',
                domReadyTime: performance.timing ?
                    (performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart) + 'ms' : 'N/A',
                heapSize: memory ? (memory.totalJSHeapSize / 1024 / 1024).toFixed(2) + 'MB' : 'N/A',
                usedHeap: memory ? (memory.usedJSHeapSize / 1024 / 1024).toFixed(2) + 'MB' : 'N/A',
                heapLimit: memory ? (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2) + 'MB' : 'N/A',
                scriptsExecuted: document.querySelectorAll('script').length,
                avgExecTime: 'Calculating...',
                domNodes: document.querySelectorAll('*').length,
                totalEventListeners: 'Calculating...'
            };
            
            // Update UI
            updatePerformanceUI(metrics);
            
            debugData.performance = metrics;
            
        } catch (error) {
            console.error('Error loading performance metrics:', error);
        }
    }
    
    // Update performance UI
    function updatePerformanceUI(metrics) {
        const updateElement = (id, value) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        };
        
        updateElement('extensionLoadTime', metrics.extensionLoadTime);
        updateElement('contentScriptTime', metrics.contentScriptTime);
        updateElement('domReadyTime', metrics.domReadyTime);
        updateElement('heapSize', metrics.heapSize);
        updateElement('usedHeap', metrics.usedHeap);
        updateElement('heapLimit', metrics.heapLimit);
        updateElement('scriptsExecuted', metrics.scriptsExecuted);
        updateElement('avgExecTime', metrics.avgExecTime);
        updateElement('domNodes', metrics.domNodes);
        updateElement('totalEventListeners', metrics.totalEventListeners);
    }
    
    // Start real-time monitoring
    function startRealTimeMonitoring() {
        setInterval(() => {
            // Update performance metrics if on performance tab
            const activeTab = document.querySelector('.debug-tab.active');
            if (activeTab && activeTab.dataset.tab === 'performance') {
                loadPerformanceMetrics();
            }
            
            // Update system info if on system tab
            if (activeTab && activeTab.dataset.tab === 'system') {
                loadSystemInfo();
            }
        }, 5000);
    }
    
    // Test functions
    async function runAllTests() {
        const progressElement = document.getElementById('testProgress');
        const progressFill = document.getElementById('progressFill');
        const testResults = document.getElementById('testResults');
        
        if (progressElement) progressElement.classList.add('active');
        if (testResults) testResults.textContent = 'Running comprehensive tests...\n';
        
        const tests = [
            { name: 'ChatGPT Connection', func: testChatGPTConnection },
            { name: 'Local Functions', func: testLocalFunctions },
            { name: 'Integration Test', func: testIntegration }
        ];
        
        let results = '';
        for (let i = 0; i < tests.length; i++) {
            const test = tests[i];
            const progress = ((i + 1) / tests.length) * 100;
            
            if (progressFill) progressFill.style.width = progress + '%';
            
            results += `\n=== ${test.name} ===\n`;
            try {
                const result = await test.func();
                results += `✅ ${test.name}: PASSED\n`;
                results += JSON.stringify(result, null, 2) + '\n';
            } catch (error) {
                results += `❌ ${test.name}: FAILED\n`;
                results += `Error: ${error.message}\n`;
            }
            
            if (testResults) testResults.textContent = results;
        }
        
        if (progressElement) {
            setTimeout(() => progressElement.classList.remove('active'), 2000);
        }
    }
    
    async function testLocalFunctions() {
        // Test local functionality similar to test-local-functionality.js
        const results = {
            timestamp: new Date().toISOString(),
            tests: []
        };
        
        // Test storage access
        try {
            const testData = await chrome.storage.local.get(null);
            results.tests.push({
                name: 'Storage Access',
                status: 'PASSED',
                details: `${Object.keys(testData).length} keys found`
            });
        } catch (error) {
            results.tests.push({
                name: 'Storage Access',
                status: 'FAILED',
                error: error.message
            });
        }
        
        return results;
    }
    
    async function testIntegration() {
        // Test integration with ChatGPT
        const tabs = await chrome.tabs.query({ url: 'https://chatgpt.com/*' });
        
        const results = {
            timestamp: new Date().toISOString(),
            chatgptTabs: tabs.length,
            tests: []
        };
        
        if (tabs.length === 0) {
            results.tests.push({
                name: 'ChatGPT Integration',
                status: 'SKIPPED',
                details: 'No ChatGPT tabs open'
            });
            return results;
        }
        
        // Test content script communication
        for (const tab of tabs) {
            try {
                const response = await chrome.tabs.sendMessage(tab.id, {
                    action: 'integrationTest',
                    source: 'debugDashboard'
                });
                
                results.tests.push({
                    name: `Tab ${tab.id} Integration`,
                    status: 'PASSED',
                    details: response
                });
            } catch (error) {
                results.tests.push({
                    name: `Tab ${tab.id} Integration`,
                    status: 'FAILED',
                    error: error.message
                });
            }
        }
        
        return results;
    }
    
    // Error management functions
    function clearErrors() {
        debugData.errors = [];
        updateErrorDisplay();
    }
    
    function exportErrors() {
        const errorData = {
            timestamp: new Date().toISOString(),
            errors: debugData.errors,
            count: debugData.errors.length
        };
        
        const blob = new Blob([JSON.stringify(errorData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ishka-errors-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
    
    // Export functions
    async function generateFullReport() {
        const exportResults = document.getElementById('exportResults');
        if (exportResults) exportResults.textContent = 'Generating comprehensive report...';
        
        // Get manifest with error handling
        let manifest = null;
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            try {
                manifest = chrome.runtime.getManifest();
            } catch (e) {
                console.log('Chrome runtime not available for manifest:', e.message);
                manifest = { error: 'Not available in file:// context' };
            }
        } else {
            manifest = { error: 'Chrome runtime not available' };
        }
        
        // Get storage with error handling
        let storage = {
            local: { error: 'Not available' },
            sync: { error: 'Not available' }
        };
        
        if (typeof chrome !== 'undefined' && chrome.storage) {
            try {
                storage.local = await chrome.storage.local.get(null);
                storage.sync = await chrome.storage.sync.get(null);
            } catch (e) {
                console.log('Chrome storage not available for report:', e.message);
                storage.local = { error: 'Not available in file:// context' };
                storage.sync = { error: 'Not available in file:// context' };
            }
        }
        
        const fullReport = {
            timestamp: new Date().toISOString(),
            context: window.location.protocol === 'file:' ? 'File System (Testing)' : 'Extension Context',
            system: debugData.system,
            extension: debugData.extension,
            errors: debugData.errors,
            performance: debugData.performance,
            testResults: debugData.testResults,
            manifest: manifest,
            storage: storage
        };
        
        const reportText = JSON.stringify(fullReport, null, 2);
        
        if (exportResults) {
            exportResults.innerHTML = `
                <div style="margin-bottom: 16px;">
                    <strong>Full Debug Report Generated</strong><br>
                    Size: ${(reportText.length / 1024).toFixed(2)} KB<br>
                    Timestamp: ${fullReport.timestamp}<br>
                    Context: ${fullReport.context}
                </div>
                <textarea readonly style="width: 100%; height: 200px; background: rgba(0,0,0,0.3); color: white; border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; padding: 8px; font-family: monospace; font-size: 11px;">${reportText}</textarea>
            `;
        }
        
        return fullReport;
    }
    
    async function exportSettings() {
        const settings = await chrome.storage.local.get(null);
        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ishka-settings-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
    
    function exportLogs() {
        // This would export console logs if we were capturing them
        const logData = {
            timestamp: new Date().toISOString(),
            message: 'Console log export not implemented - check browser developer tools for logs'
        };
        
        const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ishka-logs-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }
    
    async function copyDebugInfo() {
        const debugInfo = {
            timestamp: new Date().toISOString(),
            system: debugData.system,
            extension: debugData.extension,
            errorCount: debugData.errors.length,
            performance: debugData.performance
        };
        
        try {
            await navigator.clipboard.writeText(JSON.stringify(debugInfo, null, 2));
            
            const copyBtn = document.getElementById('copyDebugInfoBtn');
            if (copyBtn) {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                }, 2000);
            }
        } catch (error) {
            console.error('Failed to copy debug info:', error);
        }
    }
    
    // Run debug analysis (legacy function for compatibility)
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
            
            console.log('=== ISHKA DEBUG ANALYSIS - LOCAL MODE ===');
            console.log(debugInfo);
            
            // Send debug message to content scripts
            for (const tab of tabs) {
                try {
                    chrome.tabs.sendMessage(tab.id, {
                        action: 'runDebug',
                        source: 'management',
                        mode: 'local'
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
    if (elements.refreshBtn) {
        elements.refreshBtn.addEventListener('click', () => {
            checkLocalStatus();
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
        console.log('🚀 Initializing Ishka Extension Management - Local Mode');
        
        // Initial status checks
        await checkLocalStatus();
        await testChatGPTConnection();
        
        // Initialize local features
        await initializeLocalFeatures();
        
        // Initialize debug dashboard
        initializeDebugDashboard();
        
        // Set up auto-refresh for live indicators
        setInterval(async () => {
            await checkLocalStatus();
            // Test connection less frequently to avoid spam
            if (Math.random() < 0.3) { // 30% chance every 5 seconds = roughly every 15 seconds
                await testChatGPTConnection();
            }
        }, 5000);
        
        console.log('✅ Ishka Extension Management initialized - All features enabled in local mode');
        console.log('🔧 Debug Dashboard initialized - Comprehensive debugging available');
    }
    
    // Start initialization
    initialize();
});