// Sidebar Connection Link Script
// This script makes the "ChatGPT Connection: Connected" text clickable and links to the manage.html page

(function() {
    'use strict';
    
    console.log('🔗 Sidebar Connection Link Script loaded');
    
    // Function to make connection text clickable
    function makeConnectionClickable() {
        // Find elements containing the connection text
        const connectionSelectors = [
            '*[class*="connection"]',
            '*[class*="plan"]',
            '*[class*="status"]',
            '*[data-testid*="connection"]',
            '*[data-testid*="plan"]',
            '*[data-testid*="status"]'
        ];
        
        connectionSelectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    const text = element.textContent || element.innerText;
                    if (text && (text.includes('ChatGPT Connection: Connected') || text.includes('Connected'))) {
                        makeElementClickable(element);
                    }
                });
            } catch (e) {
                // Ignore selector errors
            }
        });
        
        // Also search for text nodes directly
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        const textNodes = [];
        while (node = walker.nextNode()) {
            if (node.textContent && node.textContent.includes('ChatGPT Connection: Connected')) {
                textNodes.push(node);
            }
        }
        
        textNodes.forEach(textNode => {
            const parent = textNode.parentElement;
            if (parent && !parent.classList.contains('clickable-connection')) {
                makeElementClickable(parent);
            }
        });
    }
    
    // Function to make an element clickable
    function makeElementClickable(element) {
        if (element.classList.contains('clickable-connection')) {
            return; // Already made clickable
        }
        
        element.classList.add('clickable-connection');
        element.style.cursor = 'pointer';
        element.style.textDecoration = 'underline';
        element.style.color = '#4CAF50';
        
        // Add click event listener
        element.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Open manage.html page
            const manageUrl = 'chrome-extension://eoaklpcggjainnapabmkmfblkmebjbad/manage.html';
            window.open(manageUrl, '_blank');
            
            console.log('🔗 Connection link clicked, opening manage.html');
        });
        
        // Add hover effects
        element.addEventListener('mouseenter', function() {
            element.style.opacity = '0.8';
        });
        
        element.addEventListener('mouseleave', function() {
            element.style.opacity = '1';
        });
        
        console.log('🔗 Made connection text clickable:', element.textContent);
    }
    
    // Function to scan and make connections clickable
    function scanAndMakeClickable() {
        console.log('🔍 Scanning for connection text to make clickable...');
        makeConnectionClickable();
    }
    
    // Create a MutationObserver to watch for new content
    const observer = new MutationObserver(function(mutations) {
        let shouldScan = false;
        
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const text = node.textContent || node.innerText;
                        if (text && (text.includes('ChatGPT Connection: Connected') || text.includes('Connected'))) {
                            shouldScan = true;
                        }
                    }
                });
            }
        });
        
        if (shouldScan) {
            setTimeout(scanAndMakeClickable, 100); // Small delay to let content settle
        }
    });
    
    // Start observing (only when document.body exists)
    function startObserver() {
        if (document.body) {
            try {
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
                console.log('✅ Connection link observer started');
            } catch (error) {
                console.warn('⚠️ Failed to start connection link observer:', error);
            }
        } else {
            // Retry when body becomes available
            setTimeout(startObserver, 100);
        }
    }
    
    startObserver();
    
    // Initial scan
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scanAndMakeClickable);
    } else {
        scanAndMakeClickable();
    }
    
    // Periodic scan to catch any missed content
    setInterval(scanAndMakeClickable, 3000);
    
    console.log('✅ Sidebar Connection Link Script initialized');
    
    // Expose global function for manual triggering
    window.forceMakeConnectionClickable = scanAndMakeClickable;
    
})();