// Modal properties helpers - Local mode only
// Premium features have been removed

const modalProps = {
    // Get modal properties without premium restrictions
    getModalProps: function(modalType) {
        return {
            isAccessible: true,
            isPremium: false,
            hasFullAccess: true,
            canUseFeatures: true,
            localMode: true,
            restrictions: [] // No restrictions in local mode
        };
    },
    
    // Check if modal feature is available (always true in local mode)
    isFeatureAvailable: function(feature) {
        return true;
    },
    
    // Initialize modal properties in local mode
    initializeModalProps: function() {
        console.log('🎯 MODAL PROPS: Initializing modal properties in local mode - all features available');
        return this.getModalProps();
    }
};

// Export for compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = modalProps;
}

// Global assignment
window.modalProps = modalProps;