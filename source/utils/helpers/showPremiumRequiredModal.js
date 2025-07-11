// Premium modal functionality has been removed in local mode
// This file is now a no-op to prevent errors when called

function showPremiumRequiredModal(feature = 'feature') {
    console.log(`🔓 LOCAL MODE: ${feature} is now available in local mode - no premium required`);
    return false; // Don't show modal
}

// Export for compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { showPremiumRequiredModal };
}

// Global assignment for direct calls
window.showPremiumRequiredModal = showPremiumRequiredModal;