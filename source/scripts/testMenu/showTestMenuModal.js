// Test Menu Modal - Retrieves and displays all chats
// This creates a test modal that demonstrates chat retrieval functionality

(function() {
  'use strict';

  // Global function to show Test Menu modal
  window.showTestMenuModal = function() {
    try {
      console.log('Opening Test Menu modal...');
      
      // Check if modal already exists
      let existingModal = document.getElementById('testMenuModal');
      if (existingModal) {
        existingModal.style.display = 'block';
        return;
      }

      // Function to retrieve all chats from ChatGPT page
      function getAllChats() {
        const chats = [];
        
        try {
          // Try multiple selectors to find chat elements
          const chatSelectors = [
            '[data-testid="conversation-item"]',
            '[data-testid="conversation-turn"]',
            '.chat-item',
            '.conversation-item',
            'nav li > a',
            'nav [role="button"]',
            'nav a[href*="/c/"]'
          ];
          
          let foundChats = [];
          
          // Try each selector
          for (const selector of chatSelectors) {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
              console.log(`Found ${elements.length} elements with selector: ${selector}`);
              
              elements.forEach((element, index) => {
                const chatData = {
                  id: index + 1,
                  element: element,
                  title: '',
                  href: '',
                  textContent: '',
                  selector: selector
                };
                
                // Try to extract title
                const titleElement = element.querySelector('[data-testid="conversation-title"]') || 
                                  element.querySelector('.conversation-title') ||
                                  element.querySelector('h3') ||
                                  element.querySelector('h4') ||
                                  element;
                                  
                chatData.title = titleElement?.textContent?.trim() || 'Untitled Chat';
                chatData.href = element.href || element.getAttribute('href') || '';
                chatData.textContent = element.textContent?.trim().substring(0, 100) || '';
                
                foundChats.push(chatData);
              });
              
              if (foundChats.length > 0) {
                break; // Use the first successful selector
              }
            }
          }
          
          return foundChats;
        } catch (error) {
          console.error('Error retrieving chats:', error);
          return [];
        }
      }

      // Get all chats
      const allChats = getAllChats();
      
      // Create modal HTML with chat list
      const modalHTML = `
        <div id="testMenuModal" class="modal-overlay" style="
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
            <button id="closeTestMenuModal" style="
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
            
            <h2 style="margin: 0 0 20px 0; color: #333; font-size: 24px;">🧪 Test Menu - Chat List</h2>
            
            <div style="color: #666; line-height: 1.6;">
              <h3 style="color: #333; margin: 20px 0 10px 0;">Chat Retrieval Test</h3>
              <p>This test menu demonstrates the ability to retrieve and display all chats from the ChatGPT page.</p>
              
              <div style="background: #f0f8ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196F3;">
                <h4 style="color: #333; margin: 0 0 10px 0;">📊 Results Summary</h4>
                <p style="margin: 5px 0;"><strong>Total Chats Found:</strong> ${allChats.length}</p>
                <p style="margin: 5px 0;"><strong>Retrieval Method:</strong> DOM Query Selectors</p>
                <p style="margin: 5px 0;"><strong>Status:</strong> ${allChats.length > 0 ? '✅ Success' : '⚠️ No chats found'}</p>
              </div>
              
              <h3 style="color: #333; margin: 20px 0 10px 0;">📝 Chat List</h3>
              <div style="
                max-height: 300px;
                overflow-y: auto;
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 10px;
                background: #f9f9f9;
              ">
                ${allChats.length > 0 ? allChats.map((chat, index) => `
                  <div style="
                    padding: 10px;
                    margin: 5px 0;
                    background: white;
                    border-radius: 6px;
                    border-left: 3px solid #2196F3;
                    font-size: 14px;
                  ">
                    <div style="font-weight: bold; color: #333; margin-bottom: 5px;">
                      ${index + 1}. ${chat.title}
                    </div>
                    <div style="color: #666; font-size: 12px; margin-bottom: 3px;">
                      Selector: ${chat.selector}
                    </div>
                    ${chat.href ? `<div style="color: #666; font-size: 12px; margin-bottom: 3px;">URL: ${chat.href}</div>` : ''}
                    ${chat.textContent ? `<div style="color: #888; font-size: 12px; font-style: italic;">${chat.textContent}</div>` : ''}
                  </div>
                `).join('') : `
                  <div style="text-align: center; color: #666; padding: 20px;">
                    No chats were found on this page.<br>
                    <small>This might be because the page hasn't loaded yet, or the chat elements use different selectors.</small>
                  </div>
                `}
              </div>
              
              <h3 style="color: #333; margin: 20px 0 10px 0;">🔧 Actions</h3>
              <div style="display: flex; gap: 10px; margin: 20px 0;">
                <button id="refreshChatsBtn" style="
                  background: #4CAF50;
                  color: white;
                  border: none;
                  padding: 8px 16px;
                  border-radius: 4px;
                  cursor: pointer;
                  font-size: 14px;
                ">🔄 Refresh Chat List</button>
                <button id="exportChatsBtn" style="
                  background: #2196F3;
                  color: white;
                  border: none;
                  padding: 8px 16px;
                  border-radius: 4px;
                  cursor: pointer;
                  font-size: 14px;
                ">💾 Export to JSON</button>
                <button id="logChatsBtn" style="
                  background: #FF9800;
                  color: white;
                  border: none;
                  padding: 8px 16px;
                  border-radius: 4px;
                  cursor: pointer;
                  font-size: 14px;
                ">📋 Log to Console</button>
              </div>
              
              <p style="font-size: 14px; color: #888; margin-top: 20px;">
                ℹ️ This is a test menu to demonstrate chat retrieval functionality. The actual implementation would integrate with the ChatGPT API or storage system.
              </p>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
              <button id="closeTestMenuModalBtn" style="
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

      // Insert modal into page
      document.body.insertAdjacentHTML('beforeend', modalHTML);

      // Get modal elements
      const modal = document.getElementById('testMenuModal');
      const closeBtn = document.getElementById('closeTestMenuModal');
      const closeBtnBottom = document.getElementById('closeTestMenuModalBtn');
      const refreshBtn = document.getElementById('refreshChatsBtn');
      const exportBtn = document.getElementById('exportChatsBtn');
      const logBtn = document.getElementById('logChatsBtn');

      // Close modal function
      const closeModal = () => {
        if (modal) {
          modal.remove();
        }
      };

      // Event listeners
      closeBtn.addEventListener('click', closeModal);
      closeBtnBottom.addEventListener('click', closeModal);
      
      // Refresh functionality
      refreshBtn.addEventListener('click', () => {
        closeModal();
        setTimeout(() => {
          window.showTestMenuModal();
        }, 100);
      });
      
      // Export functionality
      exportBtn.addEventListener('click', () => {
        const dataStr = JSON.stringify(allChats, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const exportFileDefaultName = 'chatgpt-chats-export.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
      });
      
      // Log functionality
      logBtn.addEventListener('click', () => {
        console.log('=== CHAT LIST DATA ===');
        console.log('Total chats:', allChats.length);
        console.log('Chat data:', allChats);
        alert(`Chat data logged to console. Found ${allChats.length} chats.`);
      });

      // Close modal when clicking outside
      modal.addEventListener('click', (event) => {
        if (event.target === modal) {
          closeModal();
        }
      });

      // Close modal on Escape key
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal) {
          closeModal();
        }
      });

      console.log('Test Menu modal opened successfully');
    } catch (error) {
      console.error('Error opening Test Menu modal:', error);
      alert('Test Menu functionality encountered an error. Please check the console for details.');
    }
  };

  // Set up the function in multiple contexts for compatibility
  try {
    // Ensure function is available in multiple contexts
    window.showTestMenuModal = window.showTestMenuModal;
    globalThis.showTestMenuModal = window.showTestMenuModal;
    
    // For userscript compatibility
    if (typeof unsafeWindow !== 'undefined') {
      unsafeWindow.showTestMenuModal = window.showTestMenuModal;
    }
    
    console.log('showTestMenuModal function loaded successfully');
    console.log('showTestMenuModal type:', typeof window.showTestMenuModal);
    console.log('showTestMenuModal available globally:', 'showTestMenuModal' in window);
  } catch (error) {
    console.error('Error setting up showTestMenuModal:', error);
  }
})();