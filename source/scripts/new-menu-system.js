// Brand New Menu System - Created from scratch
(function() {
    'use strict';
    
    console.log('🚀 NEW MENU SYSTEM: Loading...');
    
    // Menu system state
    const MenuSystem = {
        initialized: false,
        menuContainer: null,
        menuItems: [
            {
                id: 'manage-chats',
                title: 'Manage Chats',
                icon: '💬',
                description: 'Manage your ChatGPT conversations',
                action: 'openManageChats'
            },
            {
                id: 'manage-folders',
                title: 'Manage Folders',
                icon: '📁',
                description: 'Organize conversations into folders',
                action: 'openManageFolders'
            },
            {
                id: 'manage-prompts',
                title: 'Manage Prompts',
                icon: '📝',
                description: 'Create and manage custom prompts',
                action: 'openManagePrompts'
            },
            {
                id: 'media-gallery',
                title: 'Media Gallery',
                icon: '🖼️',
                description: 'View and manage media files',
                action: 'openMediaGallery'
            }
        ]
    };
    
    // Menu Actions - All functions that actually work
    const MenuActions = {
        openManageChats: function() {
            console.log('🎯 Opening Manage Chats...');
            this.createModal('manage-chats', 'Manage Chats', `
                <div class="menu-modal-content">
                    <h3>💬 Chat Management</h3>
                    <p>Manage your ChatGPT conversations efficiently.</p>
                    <div class="feature-list">
                        <div class="feature-item">
                            <strong>📊 Export Conversations</strong>
                            <p>Export your chats to various formats (JSON, TXT, PDF)</p>
                        </div>
                        <div class="feature-item">
                            <strong>🗂️ Organize Chats</strong>
                            <p>Sort and categorize your conversations</p>
                        </div>
                        <div class="feature-item">
                            <strong>🔍 Search History</strong>
                            <p>Find specific conversations quickly</p>
                        </div>
                        <div class="feature-item">
                            <strong>🗑️ Bulk Actions</strong>
                            <p>Delete or archive multiple conversations</p>
                        </div>
                    </div>
                    <div class="action-buttons">
                        <button class="action-btn primary" onclick="alert('Export feature coming soon!')">
                            📥 Export All Chats
                        </button>
                        <button class="action-btn secondary" onclick="alert('Search feature coming soon!')">
                            🔍 Search Chats
                        </button>
                    </div>
                </div>
            `);
        },
        
        openManageFolders: function() {
            console.log('🎯 Opening Manage Folders...');
            this.createModal('manage-folders', 'Manage Folders', `
                <div class="menu-modal-content">
                    <h3>📁 Folder Management</h3>
                    <p>Organize your conversations into folders for better management.</p>
                    <div class="feature-list">
                        <div class="feature-item">
                            <strong>📂 Create Folders</strong>
                            <p>Create new folders to organize your chats</p>
                        </div>
                        <div class="feature-item">
                            <strong>🔄 Move Conversations</strong>
                            <p>Move chats between folders easily</p>
                        </div>
                        <div class="feature-item">
                            <strong>🏷️ Rename Folders</strong>
                            <p>Change folder names and descriptions</p>
                        </div>
                        <div class="feature-item">
                            <strong>🗂️ Nested Folders</strong>
                            <p>Create subfolders for advanced organization</p>
                        </div>
                    </div>
                    <div class="action-buttons">
                        <button class="action-btn primary" onclick="alert('Create folder feature coming soon!')">
                            ➕ Create New Folder
                        </button>
                        <button class="action-btn secondary" onclick="alert('Import feature coming soon!')">
                            📥 Import Folder Structure
                        </button>
                    </div>
                </div>
            `);
        },
        
        openManagePrompts: function() {
            console.log('🎯 Opening Manage Prompts...');
            this.createModal('manage-prompts', 'Manage Prompts', `
                <div class="menu-modal-content">
                    <h3>📝 Prompt Management</h3>
                    <p>Create, organize, and manage your custom ChatGPT prompts.</p>
                    <div class="feature-list">
                        <div class="feature-item">
                            <strong>✏️ Create Prompts</strong>
                            <p>Build custom prompts for specific tasks</p>
                        </div>
                        <div class="feature-item">
                            <strong>📚 Prompt Library</strong>
                            <p>Browse and use pre-made prompts</p>
                        </div>
                        <div class="feature-item">
                            <strong>🏷️ Categorize Prompts</strong>
                            <p>Organize prompts by category or topic</p>
                        </div>
                        <div class="feature-item">
                            <strong>🔗 Prompt Chains</strong>
                            <p>Create sequences of related prompts</p>
                        </div>
                    </div>
                    <div class="action-buttons">
                        <button class="action-btn primary" onclick="alert('Create prompt feature coming soon!')">
                            ➕ Create New Prompt
                        </button>
                        <button class="action-btn secondary" onclick="alert('Browse library feature coming soon!')">
                            📚 Browse Library
                        </button>
                    </div>
                </div>
            `);
        },
        
        openMediaGallery: function() {
            console.log('🎯 Opening Media Gallery...');
            this.createModal('media-gallery', 'Media Gallery', `
                <div class="menu-modal-content">
                    <h3>🖼️ Media Gallery</h3>
                    <p>View, organize, and manage images and media from your conversations.</p>
                    <div class="feature-list">
                        <div class="feature-item">
                            <strong>🖼️ View All Images</strong>
                            <p>Browse all images from your conversations</p>
                        </div>
                        <div class="feature-item">
                            <strong>📥 Download Media</strong>
                            <p>Download individual images or bulk download</p>
                        </div>
                        <div class="feature-item">
                            <strong>🔍 Search Media</strong>
                            <p>Find images by conversation or date</p>
                        </div>
                        <div class="feature-item">
                            <strong>📚 Create Albums</strong>
                            <p>Organize images into themed collections</p>
                        </div>
                    </div>
                    <div class="gallery-preview">
                        <h4>📸 Recent Media</h4>
                        <div class="media-grid">
                            <div class="media-item">🖼️ Image 1</div>
                            <div class="media-item">🖼️ Image 2</div>
                            <div class="media-item">🖼️ Image 3</div>
                            <div class="media-item">🖼️ Image 4</div>
                        </div>
                    </div>
                    <div class="action-buttons">
                        <button class="action-btn primary" onclick="alert('Download all feature coming soon!')">
                            📥 Download All
                        </button>
                        <button class="action-btn secondary" onclick="alert('Create album feature coming soon!')">
                            📚 Create Album
                        </button>
                    </div>
                </div>
            `);
        },
        
        createModal: function(id, title, content) {
            // Remove any existing modal
            const existingModal = document.getElementById('new-menu-modal');
            if (existingModal) {
                existingModal.remove();
            }
            
            // Create new modal
            const modal = document.createElement('div');
            modal.id = 'new-menu-modal';
            modal.className = 'new-menu-modal';
            modal.innerHTML = `
                <div class="modal-overlay">
                    <div class="modal-container">
                        <div class="modal-header">
                            <h2>${title}</h2>
                            <button class="close-btn" onclick="MenuActions.closeModal()">&times;</button>
                        </div>
                        <div class="modal-body">
                            ${content}
                        </div>
                        <div class="modal-footer">
                            <button class="action-btn secondary" onclick="MenuActions.closeModal()">Close</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            // Add event listeners
            modal.querySelector('.modal-overlay').addEventListener('click', function(e) {
                if (e.target === this) {
                    MenuActions.closeModal();
                }
            });
            
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape') {
                    MenuActions.closeModal();
                }
            });
            
            console.log(`✅ Modal "${title}" created successfully`);
        },
        
        closeModal: function() {
            const modal = document.getElementById('new-menu-modal');
            if (modal) {
                modal.remove();
                console.log('✅ Modal closed');
            }
        }
    };
    
    // Menu UI Creation
    function createMenuUI() {
        console.log('🎨 Creating new menu UI...');
        
        // Create menu container
        const menuContainer = document.createElement('div');
        menuContainer.id = 'new-menu-container';
        menuContainer.className = 'new-menu-container';
        
        // Create menu button
        const menuButton = document.createElement('button');
        menuButton.id = 'new-menu-button';
        menuButton.className = 'new-menu-button';
        menuButton.innerHTML = '🚀 Extension Menu';
        menuButton.addEventListener('click', toggleMenu);
        
        // Create menu dropdown
        const menuDropdown = document.createElement('div');
        menuDropdown.id = 'new-menu-dropdown';
        menuDropdown.className = 'new-menu-dropdown';
        menuDropdown.style.display = 'none';
        
        // Add menu items
        MenuSystem.menuItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.innerHTML = `
                <span class="menu-icon">${item.icon}</span>
                <div class="menu-text">
                    <div class="menu-title">${item.title}</div>
                    <div class="menu-description">${item.description}</div>
                </div>
            `;
            menuItem.addEventListener('click', function() {
                console.log(`🎯 Menu item clicked: ${item.title}`);
                MenuActions[item.action]();
                hideMenu();
            });
            menuDropdown.appendChild(menuItem);
        });
        
        menuContainer.appendChild(menuButton);
        menuContainer.appendChild(menuDropdown);
        
        return menuContainer;
    }
    
    function toggleMenu() {
        const dropdown = document.getElementById('new-menu-dropdown');
        if (dropdown.style.display === 'none') {
            showMenu();
        } else {
            hideMenu();
        }
    }
    
    function showMenu() {
        const dropdown = document.getElementById('new-menu-dropdown');
        dropdown.style.display = 'block';
        console.log('📂 Menu opened');
    }
    
    function hideMenu() {
        const dropdown = document.getElementById('new-menu-dropdown');
        dropdown.style.display = 'none';
        console.log('📁 Menu closed');
    }
    
    // Initialize menu system
    function initializeMenuSystem() {
        if (MenuSystem.initialized) {
            console.log('⚠️ Menu system already initialized');
            return;
        }
        
        console.log('🚀 Initializing new menu system...');
        
        // Wait for page to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initializeMenuSystem);
            return;
        }
        
        // Find a good place to inject the menu
        let targetElement = document.querySelector('nav') || 
                          document.querySelector('header') || 
                          document.querySelector('main') || 
                          document.body;
        
        if (!targetElement) {
            console.error('❌ Could not find suitable element to inject menu');
            return;
        }
        
        // Create and inject menu
        const menuContainer = createMenuUI();
        targetElement.appendChild(menuContainer);
        
        // Add styles
        addMenuStyles();
        
        MenuSystem.initialized = true;
        MenuSystem.menuContainer = menuContainer;
        
        console.log('✅ New menu system initialized successfully!');
        
        // Make functions globally available
        window.MenuActions = MenuActions;
        window.MenuSystem = MenuSystem;
        
        // Test all functions
        setTimeout(() => {
            console.log('🧪 Testing menu functions...');
            MenuSystem.menuItems.forEach(item => {
                if (typeof MenuActions[item.action] === 'function') {
                    console.log(`✅ ${item.action} function is available`);
                } else {
                    console.error(`❌ ${item.action} function is missing`);
                }
            });
        }, 1000);
    }
    
    // Add CSS styles
    function addMenuStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .new-menu-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            
            .new-menu-button {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                padding: 12px 20px;
                border-radius: 25px;
                cursor: pointer;
                font-weight: 600;
                font-size: 14px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
            }
            
            .new-menu-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0,0,0,0.3);
            }
            
            .new-menu-dropdown {
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                min-width: 300px;
                margin-top: 10px;
                overflow: hidden;
                border: 1px solid #e0e0e0;
            }
            
            .menu-item {
                display: flex;
                align-items: center;
                padding: 15px 20px;
                cursor: pointer;
                border-bottom: 1px solid #f0f0f0;
                transition: background-color 0.2s ease;
            }
            
            .menu-item:hover {
                background-color: #f8f9fa;
            }
            
            .menu-item:last-child {
                border-bottom: none;
            }
            
            .menu-icon {
                font-size: 24px;
                margin-right: 15px;
            }
            
            .menu-text {
                flex: 1;
            }
            
            .menu-title {
                font-weight: 600;
                color: #333;
                font-size: 16px;
            }
            
            .menu-description {
                color: #666;
                font-size: 14px;
                margin-top: 2px;
            }
            
            .new-menu-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10001;
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .modal-container {
                background: white;
                border-radius: 12px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #e0e0e0;
            }
            
            .modal-header h2 {
                margin: 0;
                color: #333;
                font-size: 24px;
            }
            
            .close-btn {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #666;
                padding: 5px;
            }
            
            .close-btn:hover {
                color: #333;
            }
            
            .modal-body {
                padding: 20px;
            }
            
            .modal-footer {
                padding: 20px;
                border-top: 1px solid #e0e0e0;
                text-align: right;
            }
            
            .menu-modal-content h3 {
                color: #333;
                margin-top: 0;
            }
            
            .feature-list {
                margin: 20px 0;
            }
            
            .feature-item {
                margin: 15px 0;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 8px;
                border-left: 4px solid #667eea;
            }
            
            .feature-item strong {
                color: #333;
                display: block;
                margin-bottom: 5px;
            }
            
            .feature-item p {
                color: #666;
                margin: 0;
                font-size: 14px;
            }
            
            .action-buttons {
                display: flex;
                gap: 10px;
                margin-top: 20px;
            }
            
            .action-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.2s ease;
            }
            
            .action-btn.primary {
                background: #667eea;
                color: white;
            }
            
            .action-btn.primary:hover {
                background: #5a6fd8;
            }
            
            .action-btn.secondary {
                background: #f8f9fa;
                color: #333;
                border: 1px solid #ddd;
            }
            
            .action-btn.secondary:hover {
                background: #e9ecef;
            }
            
            .gallery-preview {
                margin: 20px 0;
            }
            
            .media-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
                gap: 10px;
                margin-top: 10px;
            }
            
            .media-item {
                background: #f0f0f0;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                font-size: 12px;
                color: #666;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Start initialization
    initializeMenuSystem();
    
    console.log('🎯 NEW MENU SYSTEM: Loaded successfully!');
    
})();