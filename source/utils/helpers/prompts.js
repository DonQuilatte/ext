// Prompts helper functionality - Local mode only
// Premium features have been removed

// Helper functions for prompt management in local mode
const promptHelpers = {
    // All prompts are available in local mode
    isPromptAvailable: function(promptId) {
        return true; // All prompts available in local mode
    },
    
    // No premium restrictions
    hasAccessToPrompt: function(promptId) {
        return true; // Full access in local mode
    },
    
    // Local mode prompt features
    getPromptFeatures: function() {
        return {
            customPrompts: true,
            promptLibrary: true,
            exportPrompts: true,
            importPrompts: true,
            promptChaining: true,
            promptCategories: true,
            localMode: true
        };
    },
    
    // Initialize prompts in local mode
    initializePrompts: function() {
        console.log('🎯 PROMPTS: Initializing prompts in local mode - all features available');
        return this.getPromptFeatures();
    }
};

// Export for compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = promptHelpers;
}

// Global assignment
window.promptHelpers = promptHelpers;