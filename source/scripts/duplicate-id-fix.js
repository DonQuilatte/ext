// Fix for duplicate form field IDs that can interfere with browser autofill
// This script will scan for duplicate IDs and make them unique

console.log('🔧 DUPLICATE ID FIX: Starting duplicate ID resolution');
console.log('🔍 DEBUG: document.readyState =', document.readyState);
console.log('🔍 DEBUG: document.body exists =', !!document.body);
console.log('🔍 DEBUG: document.documentElement exists =', !!document.documentElement);

(function() {
    'use strict';
    
    // Function to generate unique IDs
    function generateUniqueId(baseId, index = 1) {
        const newId = `${baseId}-${index}`;
        if (document.getElementById(newId)) {
            return generateUniqueId(baseId, index + 1);
        }
        return newId;
    }
    
    // Function to fix duplicate IDs
    function fixDuplicateIds() {
        const allElements = document.querySelectorAll('[id]');
        const idCounts = {};
        const duplicateElements = [];
        
        // Count occurrences of each ID
        allElements.forEach(element => {
            const id = element.id;
            if (idCounts[id]) {
                idCounts[id]++;
                duplicateElements.push(element);
            } else {
                idCounts[id] = 1;
            }
        });
        
        // Fix duplicates
        let fixedCount = 0;
        Object.keys(idCounts).forEach(id => {
            if (idCounts[id] > 1) {
                console.warn(`🚨 DUPLICATE ID FIX: Found ${idCounts[id]} elements with ID "${id}"`);
                
                // Get all elements with this ID
                const elements = document.querySelectorAll(`[id="${id}"]`);
                
                // Keep the first one, rename the rest
                elements.forEach((element, index) => {
                    if (index > 0) {
                        const newId = generateUniqueId(id, index + 1);
                        const oldId = element.id;
                        element.id = newId;
                        
                        // Update any labels that reference this ID
                        const labels = document.querySelectorAll(`label[for="${oldId}"]`);
                        labels.forEach(label => {
                            if (label.offsetParent === element.offsetParent) {
                                label.setAttribute('for', newId);
                                console.log(`✅ DUPLICATE ID FIX: Updated label for "${oldId}" to "${newId}"`);
                            }
                        });
                        
                        // Update any other elements that might reference this ID
                        const referencingElements = document.querySelectorAll(`[aria-labelledby="${oldId}"], [aria-describedby="${oldId}"]`);
                        referencingElements.forEach(refElement => {
                            if (refElement.getAttribute('aria-labelledby') === oldId) {
                                refElement.setAttribute('aria-labelledby', newId);
                            }
                            if (refElement.getAttribute('aria-describedby') === oldId) {
                                refElement.setAttribute('aria-describedby', newId);
                            }
                        });
                        
                        console.log(`✅ DUPLICATE ID FIX: Renamed "${oldId}" to "${newId}"`);
                        fixedCount++;
                    }
                });
            }
        });
        
        return fixedCount;
    }
    
    // Function to fix specific known problematic IDs
    function fixKnownDuplicates() {
        const knownDuplicates = [
            'temporary-chat-checkbox',
            'infi-chevron-icon',
            'infi-info-icon',
            'infi-search-icon',
            'infi-folders-icon',
            'infi-prompt-icon',
            'infi-gallery-icon',
            'infi-ltr-icon',
            'premium-toggle',
            'settings-checkbox',
            'folder-checkbox',
            'chat-checkbox'
        ];
        
        let fixedCount = 0;
        
        knownDuplicates.forEach(id => {
            const elements = document.querySelectorAll(`[id="${id}"]`);
            if (elements.length > 1) {
                console.warn(`🚨 DUPLICATE ID FIX: Found ${elements.length} elements with known problematic ID "${id}"`);
                
                elements.forEach((element, index) => {
                    if (index > 0) {
                        const newId = generateUniqueId(id, index + 1);
                        element.id = newId;
                        
                        // Update corresponding labels
                        const labels = document.querySelectorAll(`label[for="${id}"]`);
                        labels.forEach(label => {
                            if (label.offsetParent === element.offsetParent) {
                                label.setAttribute('for', newId);
                            }
                        });
                        
                        console.log(`✅ DUPLICATE ID FIX: Fixed known duplicate "${id}" to "${newId}"`);
                        fixedCount++;
                    }
                });
            }
        });
        
        return fixedCount;
    }
    
    // Function to prevent future duplicate IDs
    function preventDuplicateIds() {
        const originalSetAttribute = Element.prototype.setAttribute;
        
        Element.prototype.setAttribute = function(name, value) {
            if (name.toLowerCase() === 'id' && value) {
                const existing = document.getElementById(value);
                if (existing && existing !== this) {
                    const newId = generateUniqueId(value);
                    console.warn(`🚨 DUPLICATE ID FIX: Prevented duplicate ID "${value}", using "${newId}" instead`);
                    return originalSetAttribute.call(this, name, newId);
                }
            }
            return originalSetAttribute.call(this, name, value);
        };
        
        // Also patch the id property setter
        const originalIdSetter = Object.getOwnPropertyDescriptor(Element.prototype, 'id')?.set;
        if (originalIdSetter) {
            Object.defineProperty(Element.prototype, 'id', {
                get: function() {
                    return this.getAttribute('id') || '';
                },
                set: function(value) {
                    if (value) {
                        const existing = document.getElementById(value);
                        if (existing && existing !== this) {
                            const newId = generateUniqueId(value);
                            console.warn(`🚨 DUPLICATE ID FIX: Prevented duplicate ID "${value}", using "${newId}" instead`);
                            return originalIdSetter.call(this, newId);
                        }
                    }
                    return originalIdSetter.call(this, value);
                },
                configurable: true,
                enumerable: true
            });
        }
    }
    
    // Function to specifically scan for and report problematic IDs
    function scanForProblematicIds() {
        const problematicIds = [
            'temporary-chat-checkbox',
            'infi-chevron-icon',
            'infi-info-icon',
            'infi-search-icon',
            'infi-folders-icon',
            'infi-prompt-icon',
            'infi-gallery-icon',
            'infi-ltr-icon'
        ];
        
        console.log('🔬 DUPLICATE ID FIX: Scanning for specific problematic IDs...');
        
        problematicIds.forEach(id => {
            const elements = document.querySelectorAll(`[id="${id}"]`);
            if (elements.length > 1) {
                console.warn(`🔬 FOUND DUPLICATE IDS: ${id}`);
                console.warn(`🚨 DUPLICATE ID FIX: Found ${elements.length} elements with ID "${id}"`);
                
                // Log details about each duplicate
                elements.forEach((element, index) => {
                    console.log(`  ${index + 1}. Element: ${element.tagName}, Parent: ${element.parentElement?.tagName || 'none'}, Classes: ${element.className || 'none'}`);
                });
            }
        });
    }
    
    // Main execution function
    function runDuplicateIdFix() {
        console.log('🔍 DUPLICATE ID FIX: Scanning for duplicate IDs...');
        
        // First scan and report on problematic IDs
        scanForProblematicIds();
        
        // Fix existing duplicates
        const generalFixCount = fixDuplicateIds();
        const knownFixCount = fixKnownDuplicates();
        const totalFixed = generalFixCount + knownFixCount;
        
        if (totalFixed > 0) {
            console.log(`✅ DUPLICATE ID FIX: Fixed ${totalFixed} duplicate IDs`);
        } else {
            console.log('✅ DUPLICATE ID FIX: No duplicate IDs found');
        }
        
        // Install prevention mechanism
        preventDuplicateIds();
        console.log('✅ DUPLICATE ID FIX: Duplicate ID prevention installed');
        
        return totalFixed;
    }
    
    // Run the fix when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runDuplicateIdFix);
    } else {
        runDuplicateIdFix();
    }
    
    // Also run periodically to catch dynamically created elements
    setInterval(() => {
        // Scan for problematic IDs first
        scanForProblematicIds();
        
        const fixedCount = fixDuplicateIds();
        if (fixedCount > 0) {
            console.log(`🔄 DUPLICATE ID FIX: Fixed ${fixedCount} dynamically created duplicate IDs`);
        }
    }, 5000);
    
    // Set up a MutationObserver to catch new elements
    const observer = new MutationObserver(mutations => {
        let shouldCheck = false;
        
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.id || node.querySelector('[id]')) {
                            shouldCheck = true;
                        }
                    }
                });
            }
            if (mutation.type === 'attributes' && mutation.attributeName === 'id') {
                shouldCheck = true;
            }
        });
        
        if (shouldCheck) {
            setTimeout(() => {
                const fixedCount = fixDuplicateIds();
                if (fixedCount > 0) {
                    console.log(`🔄 DUPLICATE ID FIX: Fixed ${fixedCount} duplicate IDs from DOM mutations`);
                }
            }, 100);
        }
    });
    
    // Use robust DOM utilities for safe observer setup
    function setupObserver() {
        try {
            if (window.domUtils && window.domUtils.isBodyReady()) {
                observer.observe(document.body, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['id']
                });
                console.log('✅ DUPLICATE ID FIX: MutationObserver monitoring for new duplicate IDs');
                return true;
            } else {
                console.warn('⚠️ DUPLICATE ID FIX: document.body not ready for observer');
                return false;
            }
        } catch (error) {
            console.error('❌ DUPLICATE ID FIX: Observer setup error:', error);
            return false;
        }
    }
    
    // Use robust DOM utilities if available, otherwise fallback to manual setup
    if (window.domUtils) {
        console.log('🔧 DUPLICATE ID FIX: Using robust DOM utilities for observer setup');
        window.domUtils.whenBodyReady(() => {
            setupObserver();
        });
    } else {
        console.log('🔧 DUPLICATE ID FIX: Robust DOM utilities not available, using fallback');
        // Fallback to original logic with enhanced error handling
        if (document.body && document.body.nodeType === Node.ELEMENT_NODE) {
            setupObserver();
        } else {
            // Multiple retry strategies
            const retrySetup = (attempt = 1, maxAttempts = 10) => {
                if (attempt > maxAttempts) {
                    console.error('❌ DUPLICATE ID FIX: Max retry attempts reached');
                    return;
                }
                
                setTimeout(() => {
                    if (setupObserver()) {
                        console.log(`✅ DUPLICATE ID FIX: Observer setup successful on attempt ${attempt}`);
                    } else {
                        console.log(`🔄 DUPLICATE ID FIX: Retry attempt ${attempt}/${maxAttempts}`);
                        retrySetup(attempt + 1, maxAttempts);
                    }
                }, attempt * 100); // Exponential backoff
            };
            
            // Start retry process
            retrySetup();
            
            // Also try on DOMContentLoaded if still loading
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    if (!setupObserver()) {
                        retrySetup();
                    }
                });
            }
        }
    }
})();

console.log('🎯 DUPLICATE ID FIX: Duplicate ID resolution system initialized');