// Plan Text Override Script
// This script intercepts and modifies any text that shows "Toolbox Plan - Free" to show premium status instead

(function() {
    'use strict';
    
    console.log('🎯 Plan Text Override Script loaded');
    
    // Configuration
    const PLAN_REPLACEMENTS = {
        'Toolbox Plan - Free': 'ChatGPT Connection: Connected',
        'Toolbox Plan - Premium': 'ChatGPT Connection: Connected',
        'Toolbox Plan': 'ChatGPT Connection: Connected',
        'Free Plan': 'ChatGPT Connection: Connected',
        'Premium Plan': 'ChatGPT Connection: Connected',
        'Free': 'Connected',
        'Premium': 'Connected',
        'toolbox-plan-free': 'chatgpt-connection-connected',
        'toolbox-plan-premium': 'chatgpt-connection-connected',
        'plan-free': 'connection-connected',
        'plan-premium': 'connection-connected'
    };
    
    // Function to replace text content
    function replaceTextContent(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.textContent;
            let modified = false;
            
            for (const [oldText, newText] of Object.entries(PLAN_REPLACEMENTS)) {
                if (text.includes(oldText)) {
                    text = text.replace(new RegExp(oldText, 'gi'), newText);
                    modified = true;
                }
            }
            
            if (modified) {
                node.textContent = text;
                console.log('🔄 Replaced plan text:', node.textContent);
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Check attributes
            ['class', 'id', 'data-plan', 'aria-label', 'title'].forEach(attr => {
                const value = node.getAttribute(attr);
                if (value) {
                    let newValue = value;
                    let modified = false;
                    
                    for (const [oldText, newText] of Object.entries(PLAN_REPLACEMENTS)) {
                        if (newValue.includes(oldText)) {
                            newValue = newValue.replace(new RegExp(oldText, 'gi'), newText);
                            modified = true;
                        }
                    }
                    
                    if (modified) {
                        node.setAttribute(attr, newValue);
                        console.log(`🔄 Replaced ${attr} attribute:`, newValue);
                    }
                }
            });
            
            // Process child nodes
            for (let child of node.childNodes) {
                replaceTextContent(child);
            }
        }
    }
    
    // Function to scan and replace all plan text
    function scanAndReplace() {
        console.log('🔍 Scanning for plan text to replace...');
        
        // Replace in document body (only if it exists)
        if (document.body) {
            replaceTextContent(document.body);
        }
        
        // Also check for specific selectors that might contain plan info
        const selectors = [
            '[class*="plan"]',
            '[class*="subscription"]',
            '[class*="premium"]',
            '[class*="free"]',
            '[data-plan]',
            '[aria-label*="plan"]',
            '[title*="plan"]'
        ];
        
        selectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    replaceTextContent(element);
                });
            } catch (e) {
                // Ignore invalid selectors
            }
        });
    }
    
    // Create a MutationObserver to watch for new content
    const observer = new MutationObserver(function(mutations) {
        let shouldScan = false;
        
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                        shouldScan = true;
                    }
                });
            } else if (mutation.type === 'characterData') {
                shouldScan = true;
            }
        });
        
        if (shouldScan) {
            setTimeout(scanAndReplace, 100); // Small delay to let content settle
        }
    });
    
    // Start observing (only when document.body exists)
    function startObserver() {
        if (document.body) {
            try {
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    characterData: true,
                    attributes: true,
                    attributeFilter: ['class', 'id', 'data-plan', 'aria-label', 'title']
                });
                console.log('✅ MutationObserver started');
            } catch (error) {
                console.warn('⚠️ Failed to start MutationObserver:', error);
            }
        } else {
            // Retry when body becomes available
            setTimeout(startObserver, 100);
        }
    }
    
    startObserver();
    
    // Initial scan
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scanAndReplace);
    } else {
        scanAndReplace();
    }
    
    // Periodic scan to catch any missed content
    setInterval(scanAndReplace, 2000);
    
    // Override common DOM manipulation methods to catch dynamic content
    const originalInnerHTML = Element.prototype.innerHTML;
    Object.defineProperty(Element.prototype, 'innerHTML', {
        get: function() {
            return originalInnerHTML.call(this);
        },
        set: function(value) {
            originalInnerHTML.call(this, value);
            setTimeout(() => replaceTextContent(this), 50);
        }
    });
    
    const originalTextContent = Node.prototype.textContent;
    Object.defineProperty(Node.prototype, 'textContent', {
        get: function() {
            return originalTextContent.call(this);
        },
        set: function(value) {
            let newValue = value;
            for (const [oldText, newText] of Object.entries(PLAN_REPLACEMENTS)) {
                if (newValue && newValue.includes && newValue.includes(oldText)) {
                    newValue = newValue.replace(new RegExp(oldText, 'gi'), newText);
                    console.log('🔄 Intercepted textContent set:', newValue);
                }
            }
            originalTextContent.call(this, newValue);
        }
    });
    
    console.log('✅ Plan Text Override Script initialized');
    
    // Expose global function for manual triggering
    window.forcePlanTextReplace = scanAndReplace;
    
})();