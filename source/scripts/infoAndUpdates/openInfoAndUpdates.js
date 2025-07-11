// Simple replacement for broken openInfoAndUpdates function
// This creates a basic modal for info and updates functionality

(function() {
  'use strict';

  // Global function to open Info & Updates modal
  window.openInfoAndUpdates = function() {
    try {
      console.log('Opening Info & Updates modal...');
      
      // Check if modal already exists
      let existingModal = document.getElementById('infoAndUpdatesModal');
      if (existingModal) {
        existingModal.style.display = 'block';
        return;
      }

      // Create modal HTML
      const modalHTML = `
        <div id="infoAndUpdatesModal" class="modal-overlay" style="
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
            <button id="closeInfoModal" style="
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
            
            <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">Info & Updates</h2>
            
            <div style="color: #666; line-height: 1.6;">
              <h3 style="color: #333; margin: 20px 0 10px 0;">Release Notes</h3>
              <p>This is a temporary modal while we restore the full functionality.</p>
              
              <h3 style="color: #333; margin: 20px 0 10px 0;">Features</h3>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>ChatGPT Enhancement Tools</li>
                <li>Conversation Management</li>
                <li>Prompt Library</li>
                <li>Media Gallery</li>
              </ul>
              
              <h3 style="color: #333; margin: 20px 0 10px 0;">Support</h3>
              <p>For support and updates, please visit our support channels.</p>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
              <button id="closeInfoModalBtn" style="
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
      const modal = document.getElementById('infoAndUpdatesModal');
      const closeBtn = document.getElementById('closeInfoModal');
      const closeBtn2 = document.getElementById('closeInfoModalBtn');

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

      console.log('Info & Updates modal opened successfully');
      
    } catch (error) {
      console.error('Error opening Info & Updates modal:', error);
      alert('Info & Updates functionality is being restored. Please try again later.');
    }
  };

  console.log('openInfoAndUpdates function loaded successfully');
})();