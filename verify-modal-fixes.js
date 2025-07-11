// Test script to verify the modal fixes are working
console.log('🧪 TESTING: Modal function fixes verification');

// Test the existence of all four modal functions
const modalFunctions = [
    'showManageChatsModal',
    'showManageFoldersModal', 
    'showManagePromptsModal',
    'showMediaGalleryModal'
];

console.log('🔍 Checking modal functions availability...');

modalFunctions.forEach(funcName => {
    if (typeof window[funcName] === 'function') {
        console.log(`✅ ${funcName} is available and is a function`);
    } else if (window[funcName] !== undefined) {
        console.log(`⚠️ ${funcName} exists but is not a function (type: ${typeof window[funcName]})`);
    } else {
        console.log(`❌ ${funcName} is undefined`);
    }
});

// Test calling each function safely
console.log('\n🧪 Testing modal function calls...');

modalFunctions.forEach(funcName => {
    try {
        if (typeof window[funcName] === 'function') {
            console.log(`🔬 Testing ${funcName}...`);
            window[funcName]();
            console.log(`✅ ${funcName} executed successfully`);
            
            // Close any opened modals
            setTimeout(() => {
                const modal = document.querySelector(`#${funcName.replace('show', '').replace('Modal', '').toLowerCase()}Modal`);
                if (modal) {
                    modal.remove();
                    console.log(`🧹 Cleaned up ${funcName} modal`);
                }
            }, 100);
        }
    } catch (error) {
        console.log(`❌ ${funcName} failed:`, error.message);
    }
});

console.log('\n🎯 Modal function fixes verification complete');