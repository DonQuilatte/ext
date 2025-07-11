// Simple replacement for broken showHistorySearchModal function
// This creates a basic modal for history search functionality

(function() {
  'use strict';

  // Global function to show History Search modal
  window.showHistorySearchModal = function() {
    try {
      console.log('Opening History Search modal...');
      
      // Check if modal already exists
      let existingModal = document.getElementById('historySearchModal');
      if (existingModal) {
        existingModal.style.display = 'block';
        return;
      }

      // Create modal HTML
      const modalHTML = `
        <div id="historySearchModal" class="modal-overlay" style="
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
            <button id="closeHistorySearchModal" style="
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
            
            <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">History Search</h2>
            
            <div style="color: #666; line-height: 1.6;">
              <h3 style="color: #333; margin: 20px 0 10px 0;">Advanced Search</h3>
              <p>Search through your ChatGPT conversation history with advanced filters and options.</p>
              
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h4 style="color: #333; margin: 0 0 15px 0;">Search Options</h4>
                <div style="margin-bottom: 15px;">
                  <input type="text" placeholder="Search conversations..." style="
                    width: 100%;
                    padding: 10px;
                    border: 2px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                    box-sizing: border-box;
                  ">
                </div>
                <div style="display: flex; gap: 10px; margin: 15px 0;">
                  <select style="
                    padding: 8px;
                    border: 2px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                  ">
                    <option>All conversations</option>
                    <option>Last 7 days</option>
                    <option>Last 30 days</option>
                    <option>Last 90 days</option>
                  </select>
                  <select style="
                    padding: 8px;
                    border: 2px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                  ">
                    <option>All models</option>
                    <option>GPT-4</option>
                    <option>GPT-3.5</option>
                    <option>Custom GPTs</option>
                  </select>
                </div>
                <button style="
                  background: #2196F3;
                  color: white;
                  border: none;
                  padding: 10px 20px;
                  border-radius: 4px;
                  cursor: pointer;
                  font-size: 14px;
                " onclick="alert('Search feature is being restored.')">Search</button>
              </div>
              
              <h3 style="color: #333; margin: 20px 0 10px 0;">Search Features</h3>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Full-text search across all conversations</li>
                <li>Filter by date range and conversation type</li>
                <li>Search within specific folders or categories</li>
                <li>Export search results</li>
                <li>Save frequently used search queries</li>
              </ul>
              
              <div style="background: #f5f5f5; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h4 style="color: #333; margin: 0 0 10px 0;">Recent Searches</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                  <span style="background: #e3f2fd; padding: 4px 8px; border-radius: 12px; font-size: 12px; color: #1976d2;">AI assistance</span>
                  <span style="background: #e3f2fd; padding: 4px 8px; border-radius: 12px; font-size: 12px; color: #1976d2;">coding help</span>
                  <span style="background: #e3f2fd; padding: 4px 8px; border-radius: 12px; font-size: 12px; color: #1976d2;">data analysis</span>
                </div>
              </div>
              
              <p style="font-size: 14px; color: #888; margin-top: 20px;">
                Note: This is a temporary interface while we restore the full history search functionality.
              </p>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
              <button id="closeHistorySearchModalBtn" style="
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
      const modal = document.getElementById('historySearchModal');
      const closeBtn = document.getElementById('closeHistorySearchModal');
      const closeBtn2 = document.getElementById('closeHistorySearchModalBtn');

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

      console.log('History Search modal opened successfully');
      
    } catch (error) {
      console.error('Error opening History Search modal:', error);
      alert('History Search functionality is being restored. Please try again later.');
    }
  };

  console.log('showHistorySearchModal function loaded successfully');
})();