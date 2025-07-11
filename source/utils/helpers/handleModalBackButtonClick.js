// Modal back button handler - Local mode only
// Premium features have been removed

const modalBackButtonHandler = {
    // Handle back button clicks without premium restrictions
    handleBackButtonClick: function(event, modalType) {
        console.log('🎯 MODAL BACK: Handling back button click in local mode');
        
        // Always allow back navigation in local mode
        return true;
    },
    
    // Check if back navigation is allowed (always true in local mode)
    canNavigateBack: function(modalType) {
        return true;
    },
    
    // Initialize back button handler in local mode
    initializeBackButtonHandler: function() {
        console.log('🎯 MODAL BACK: Initializing back button handler in local mode - all navigation available');
        return true;
    }
};

// Export for compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = modalBackButtonHandler;
}

// Global assignment
window.modalBackButtonHandler = modalBackButtonHandler;