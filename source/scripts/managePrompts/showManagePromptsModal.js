// Simple replacement for broken showManagePromptsModal function
// This creates a basic modal for prompt management functionality

(function() {
  'use strict';

  // Global function to show Manage Prompts modal
  window.showManagePromptsModal = function() {
    try {
      console.log('Opening Manage Prompts modal...');
      
      // Check if modal already exists
      let existingModal = document.getElementById('managePromptsModal');
      if (existingModal) {
        existingModal.style.display = 'block';
        return;
      }

      // Create modal HTML
      const modalHTML = `
        <div id="managePromptsModal" class="modal-overlay" style="
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
          <div class="modal-content" style="
            background: white;
            padding: 30px;
            border-radius: 12px;
            max-width: 700px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          ">
            <button id="closeManagePromptsModal" style="
              position: absolute;
              top: 15px;
              right: 20px;
              background: none;
              border: none;
              font-size: 24px;
              cursor: pointer;
              color: #666;
              padding: 5px;
              line-height: 1;
            ">&times;</button>
            
            <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">Manage Prompts</h2>
            
            <div style="color: #666; line-height: 1.6;">
              <h3 style="color: #333; margin: 20px 0 10px 0;">Prompt Library</h3>
              <p>Create, organize, and manage your custom ChatGPT prompts for quick access.</p>
              
              <h3 style="color: #333; margin: 20px 0 10px 0;">Available Actions</h3>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Create new custom prompts</li>
                <li>Edit existing prompts</li>
                <li>Organize prompts into categories</li>
                <li>Import/export prompt collections</li>
                <li>Search through prompt library</li>
              </ul>
              
              <h3 style="color: #333; margin: 20px 0 10px 0;">Quick Actions</h3>
              <div style="display: flex; gap: 10px; margin: 20px 0;">
                <button style="
                  background: #4CAF50;
                  color: white;
                  border: none;
                  padding: 8px 16px;
                  border-radius: 4px;
                  cursor: pointer;
                  font-size: 14px;
                " onclick="alert('Create prompt feature is being restored.')">Create Prompt</button>
                <button style="
                  background: #2196F3;
                  color: white;
                  border: none;
                  padding: 8px 16px;
                  border-radius: 4px;
                  cursor: pointer;
                  font-size: 14px;
                " onclick="alert('Import feature is being restored.')">Import Library</button>
              </div>
              
              <p style="font-size: 14px; color: #888; margin-top: 20px;">
                Note: This is a temporary interface while we restore the full prompt management functionality.
              </p>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
              <button id="closeManagePromptsModalBtn" style="
                background: #4CAF50;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
              ">Close</button>
            </div>
          </div>
        </div>
      `;

      // Add modal to page
      document.body.insertAdjacentHTML('beforeend', modalHTML);

      // Add close functionality
      const modal = document.getElementById('managePromptsModal');
      const closeBtn = document.getElementById('closeManagePromptsModal');
      const closeBtn2 = document.getElementById('closeManagePromptsModalBtn');

      const closeModal = () => {
        if (modal) {
          modal.remove();
        }
      };

      closeBtn.addEventListener('click', closeModal);
      closeBtn2.addEventListener('click', closeModal);
      
      // Close on background click
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeModal();
        }
      });

      // Close on escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal) {
          closeModal();
        }
      });

      console.log('Manage Prompts modal opened successfully');
      
    } catch (error) {
      console.error('Error opening Manage Prompts modal:', error);
      alert('Manage Prompts functionality is being restored. Please try again later.');
    }
  };

  // Multiple assignment strategies to ensure global availability
  try {
    window.showManagePromptsModal = window.showManagePromptsModal;
    globalThis.showManagePromptsModal = window.showManagePromptsModal;
    
    // Also set on unsafeWindow if available (for userscript compatibility)
    if (typeof unsafeWindow !== 'undefined') {
      unsafeWindow.showManagePromptsModal = window.showManagePromptsModal;
    }
    
    console.log('showManagePromptsModal function loaded successfully');
    console.log('showManagePromptsModal type:', typeof window.showManagePromptsModal);
    console.log('showManagePromptsModal available globally:', 'showManagePromptsModal' in window);
  } catch (e) {
    console.error('Error setting up showManagePromptsModal:', e);
  }
})();