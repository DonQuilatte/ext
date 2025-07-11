// Modal logic helpers - Local mode only
// Premium features have been removed

const modalLogic = {
    // Always allow modal actions in local mode
    canAccessModal: function(modalType) {
        return true; // All modals available in local mode
    },
    
    // No premium checks for modal features
    getModalPermissions: function(modalType) {
        return {
            canOpen: true,
            canEdit: true,
            canDelete: true,
            canExport: true,
            canImport: true,
            localMode: true
        };
    },
    
    // Initialize modal system in local mode
    initializeModals: function() {
        console.log('🎯 MODALS: Initializing modals in local mode - all features available');
        return this.getModalPermissions();
    }
};

// Export for compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = modalLogic;
}

// Global assignment
window.modalLogic = modalLogic;