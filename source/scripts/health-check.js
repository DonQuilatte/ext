// Health Check Script for Popup/Management Communication
(function() {
    'use strict';
    
    console.log('🏥 Ishka Health Check script loaded');
    
    // IMMEDIATE availability flags for management interface
    window.HEALTH_CHECK_LOADED = true;
    window.ISHKA_CONTENT_SCRIPTS_LOADED = true;
    window.ISHKA_HEALTH_CHECK_READY = true;
    
    // Health check data
    let healthData = {
        status: 'ok',
        timestamp: Date.now(),
        conversationCount: 0,
        features: {
            manageChats: false,
            manageFolders: false,
            managePrompts: false
        }
    };
    
    // Count conversations on page
    function countConversations() {
        try {
            // Try multiple selectors for ChatGPT conversations
            const selectors = [
                '[data-testid^="conversation-turn"]',
                '.conversation-turn',
                '[role="presentation"] > div > div',
                'main nav ol li',
                'nav[aria-label="Chat history"] ol li'
            ];
            
            let maxCount = 0;
            for (const selector of selectors) {
                const elements = document.querySelectorAll(selector);
                if (elements.length > maxCount) {
                    maxCount = elements.length;
                }
            }
            
            return maxCount;
        } catch (error) {
            console.warn('Error counting conversations:', error);
            return 0;
        }
    }
    
    // Check if premium features are available
    function checkPremiumFeatures() {
        try {
            // Check for common ChatGPT interface elements
            const hasManageChats = document.querySelector('nav[aria-label="Chat history"]') !== null;
            const hasManageFolders = document.querySelector('[data-testid="folders"]') !== null || 
                                   document.querySelector('.folder') !== null;
            const hasManagePrompts = document.querySelector('[data-testid="prompt-library"]') !== null ||
                                   document.querySelector('.prompt') !== null;
            
            return {
                manageChats: hasManageChats,
                manageFolders: hasManageFolders,
                managePrompts: hasManagePrompts
            };
        } catch (error) {
            console.warn('Error checking premium features:', error);
            return {
                manageChats: false,
                manageFolders: false,
                managePrompts: false
            };
        }
    }
    
    // Update health data
    function updateHealthData() {
        healthData.timestamp = Date.now();
        healthData.conversationCount = countConversations();
        healthData.features = checkPremiumFeatures();
    }
    
    // Message listener for popup/management communication
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        try {
            console.log('🏥 Health check received message:', request);
            
            switch (request.action) {
                case 'healthCheck':
                    updateHealthData();
                    sendResponse(healthData);
                    return true;
                
                case 'premiumEnabled':
                    console.log('🎯 Premium features enabled from', request.source);
                    updateHealthData();
                    sendResponse({ status: 'acknowledged' });
                    return true;
                
                case 'runDebug':
                    console.log('🔍 Debug requested from', request.source);
                    updateHealthData();
                    console.log('=== ISHKA HEALTH CHECK DEBUG ===');
                    console.log('Health Data:', healthData);
                    console.log('Page URL:', window.location.href);
                    console.log('Page Title:', document.title);
                    console.log('Conversations found:', healthData.conversationCount);
                    console.log('Features:', healthData.features);
                    sendResponse({ status: 'debug_complete', data: healthData });
                    return true;
                
                default:
                    // Don't handle unknown messages, let other scripts handle them
                    return false;
            }
        } catch (error) {
            console.error('🏥 Health check error:', error);
            sendResponse({ status: 'error', error: error.message });
            return true;
        }
    });
    
    // Initial health data update
    setTimeout(() => {
        updateHealthData();
        console.log('🏥 Initial health check complete:', healthData);
    }, 1000);
    
    // Periodic health data updates
    setInterval(updateHealthData, 10000); // Update every 10 seconds
    
    console.log('✅ Ishka Health Check script initialized');
})();