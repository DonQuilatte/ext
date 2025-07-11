// Simple replacement for broken showMediaGalleryModal function
// This creates a basic modal for media gallery functionality

(function() {
  'use strict';

  // Global function to show Media Gallery modal
  window.showMediaGalleryModal = function() {
    try {
      console.log('Opening Media Gallery modal...');
      
      // Check if modal already exists
      let existingModal = document.getElementById('mediaGalleryModal');
      if (existingModal) {
        existingModal.style.display = 'block';
        return;
      }

      // Create modal HTML
      const modalHTML = `
        <div id="mediaGalleryModal" class="modal-overlay" style="
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
            max-width: 800px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
          ">
            <button id="closeMediaGalleryModal" style="
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
            
            <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">Media Gallery</h2>
            
            <div style="color: #666; line-height: 1.6;">
              <h3 style="color: #333; margin: 20px 0 10px 0;">Media Management</h3>
              <p>View, organize, and manage images and media files from your ChatGPT conversations.</p>
              
              <h3 style="color: #333; margin: 20px 0 10px 0;">Available Actions</h3>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>View all images from conversations</li>
                <li>Download individual images or bulk download</li>
                <li>Search images by conversation or date</li>
                <li>Organize images into albums</li>
                <li>Export image collections</li>
              </ul>
              
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #333; margin: 0 0 10px 0;">Gallery Preview</h4>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; margin: 15px 0;">
                  <div style="background: #ddd; height: 100px; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #666; font-size: 12px;">Image 1</div>
                  <div style="background: #ddd; height: 100px; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #666; font-size: 12px;">Image 2</div>
                  <div style="background: #ddd; height: 100px; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #666; font-size: 12px;">Image 3</div>
                  <div style="background: #ddd; height: 100px; border-radius: 4px; display: flex; align-items: center; justify-content: center; color: #666; font-size: 12px;">Image 4</div>
                </div>
              </div>
              
              <h3 style="color: #333; margin: 20px 0 10px 0;">Quick Actions</h3>
              <div style="display: flex; gap: 10px; margin: 20px 0;">
                <button style="
                  background: #2196F3;
                  color: white;
                  border: none;
                  padding: 8px 16px;
                  border-radius: 4px;
                  cursor: pointer;
                  font-size: 14px;
                " onclick="alert('Download all feature is being restored.')">Download All</button>
                <button style="
                  background: #FF9800;
                  color: white;
                  border: none;
                  padding: 8px 16px;
                  border-radius: 4px;
                  cursor: pointer;
                  font-size: 14px;
                " onclick="alert('Create album feature is being restored.')">Create Album</button>
              </div>
              
              <p style="font-size: 14px; color: #888; margin-top: 20px;">
                Note: This is a temporary interface while we restore the full media gallery functionality.
              </p>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
              <button id="closeMediaGalleryModalBtn" style="
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
      const modal = document.getElementById('mediaGalleryModal');
      const closeBtn = document.getElementById('closeMediaGalleryModal');
      const closeBtn2 = document.getElementById('closeMediaGalleryModalBtn');

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

      console.log('Media Gallery modal opened successfully');
      
    } catch (error) {
      console.error('Error opening Media Gallery modal:', error);
      alert('Media Gallery functionality is being restored. Please try again later.');
    }
  };

  // Multiple assignment strategies to ensure global availability
  try {
    window.showMediaGalleryModal = window.showMediaGalleryModal;
    globalThis.showMediaGalleryModal = window.showMediaGalleryModal;
    
    // Also set on unsafeWindow if available (for userscript compatibility)
    if (typeof unsafeWindow !== 'undefined') {
      unsafeWindow.showMediaGalleryModal = window.showMediaGalleryModal;
    }
    
    console.log('showMediaGalleryModal function loaded successfully');
    console.log('showMediaGalleryModal type:', typeof window.showMediaGalleryModal);
    console.log('showMediaGalleryModal available globally:', 'showMediaGalleryModal' in window);
  } catch (e) {
    console.error('Error setting up showMediaGalleryModal:', e);
  }
})();