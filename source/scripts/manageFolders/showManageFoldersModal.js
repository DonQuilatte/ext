// Simple replacement for broken showManageFoldersModal function
// This creates a basic modal for folder management functionality

(function() {
  'use strict';

  // Global function to show Manage Folders modal
  window.showManageFoldersModal = function() {
    try {
      console.log('Opening Manage Folders modal...');
      
      // Check if modal already exists
      let existingModal = document.getElementById('manageFoldersModal');
      if (existingModal) {
        existingModal.style.display = 'block';
        return;
      }

      // Create modal HTML
      const modalHTML = `
        <div id="manageFoldersModal" class="modal-overlay" style="
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
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          ">
            <button id="closeManageFoldersModal" style="
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
            
            <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">Manage Folders</h2>
            
            <div style="color: #666; line-height: 1.6;">
              <h3 style="color: #333; margin: 20px 0 10px 0;">Folder Organization</h3>
              <p>Create and manage folders to organize your ChatGPT conversations and resources.</p>
              
              <h3 style="color: #333; margin: 20px 0 10px 0;">Available Actions</h3>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Create new folders and subfolders</li>
                <li>Rename existing folders</li>
                <li>Move conversations between folders</li>
                <li>Delete empty folders</li>
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
                " onclick="alert('Create folder feature is being restored.')">Create Folder</button>
                <button style="
                  background: #FF9800;
                  color: white;
                  border: none;
                  padding: 8px 16px;
                  border-radius: 4px;
                  cursor: pointer;
                  font-size: 14px;
                " onclick="alert('Import feature is being restored.')">Import Structure</button>
              </div>
              
              <p style="font-size: 14px; color: #888; margin-top: 20px;">
                Note: This is a temporary interface while we restore the full folder management functionality.
              </p>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
              <button id="closeManageFoldersModalBtn" style="
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
      const modal = document.getElementById('manageFoldersModal');
      const closeBtn = document.getElementById('closeManageFoldersModal');
      const closeBtn2 = document.getElementById('closeManageFoldersModalBtn');

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

      console.log('Manage Folders modal opened successfully');
      
    } catch (error) {
      console.error('Error opening Manage Folders modal:', error);
      alert('Manage Folders functionality is being restored. Please try again later.');
    }
  };

  // Multiple assignment strategies to ensure global availability
  try {
    window.showManageFoldersModal = window.showManageFoldersModal;
    globalThis.showManageFoldersModal = window.showManageFoldersModal;
    
    // Also set on unsafeWindow if available (for userscript compatibility)
    if (typeof unsafeWindow !== 'undefined') {
      unsafeWindow.showManageFoldersModal = window.showManageFoldersModal;
    }
    
    console.log('showManageFoldersModal function loaded successfully');
    console.log('showManageFoldersModal type:', typeof window.showManageFoldersModal);
    console.log('showManageFoldersModal available globally:', 'showManageFoldersModal' in window);
  } catch (e) {
    console.error('Error setting up showManageFoldersModal:', e);
  }
})();