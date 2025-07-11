// Modal ID helper - Local mode only
// Premium features have been removed

const modalIdHelper = {
    // Generate modal IDs without premium restrictions
    getModalId: function(modalType, suffix = '') {
        const baseId = `modal-${modalType}`;
        return suffix ? `${baseId}-${suffix}` : baseId;
    },
    
    // Check if modal ID is valid (always true in local mode)
    isValidModalId: function(modalId) {
        return true;
    },
    
    // Initialize modal ID system in local mode
    initializeModalIds: function() {
        console.log('🎯 MODAL ID: Initializing modal ID system in local mode - all features available');
        return true;
    }
};

// Export for compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = modalIdHelper;
}

// Global assignment
window.modalIdHelper = modalIdHelper;