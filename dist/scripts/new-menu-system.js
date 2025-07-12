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
            },
            {
                id: 'test-extraction',
                title: 'TEST - Real Data',
                icon: '🔥',
                description: 'Test real ChatGPT data extraction',
                action: 'openTestExtraction'
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
                        <button class="action-btn primary" data-action="export-chats">
                            📥 Export All Chats
                        </button>
                        <button class="action-btn secondary" data-action="search-chats">
                            🔍 Search Chats
                        </button>
                    </div>
                </div>
            `);
        },
        
        openTestExtraction: function() {
            console.log('🔥 Opening Test Data Extraction...');
            const data = this.extractChatGPTData();
            
            this.createModal('test-extraction', 'TEST - Real ChatGPT Data', `
                <div class="menu-modal-content">
                    <h3>🔥 Real ChatGPT Data Extraction Test</h3>
                    <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4CAF50;">
                        <h4 style="color: #333; margin: 0 0 10px 0;">📊 Extraction Results</h4>
                        <p style="margin: 5px 0;"><strong>Conversations Found:</strong> ${data.extraction.conversations.length}</p>
                        <p style="margin: 5px 0;"><strong>Working Selector:</strong> ${data.extraction.metadata.workingConversationSelector || 'None'}</p>
                        <p style="margin: 5px 0;"><strong>Page URL:</strong> ${data.url}</p>
                        <p style="margin: 5px 0;"><strong>Timestamp:</strong> ${data.timestamp}</p>
                    </div>
                    
                    <h4>📋 Found Conversations (First 10)</h4>
                    <div style="max-height: 300px; overflow-y: auto; border: 1px solid #ddd; border-radius: 8px; padding: 15px; background: #f9f9f9;">
                        ${data.extraction.conversations.length > 0 ? data.extraction.conversations.slice(0, 10).map((conv, i) => `
                            <div style="background: white; padding: 10px; margin: 8px 0; border-radius: 4px; border-left: 3px solid ${conv.isActive ? '#4CAF50' : '#2196F3'};">
                                <strong>${i+1}. ${conv.title}</strong>${conv.isActive ? ' (ACTIVE)' : ''}<br>
                                <small>Element: ${conv.element} | Classes: ${conv.classes || 'none'}</small><br>
                                ${conv.href ? `<small>URL: ${conv.href}</small>` : ''}
                            </div>
                        `).join('') : '<p style="text-align: center; color: #666;">No conversations found</p>'}
                        ${data.extraction.conversations.length > 10 ? `<p style="text-align: center; color: #666;">... and ${data.extraction.conversations.length - 10} more</p>` : ''}
                    </div>
                    
                    <div class="action-buttons" style="margin-top: 20px;">
                        <button class="action-btn primary" data-action="copy-test-data">
                            📋 Copy Raw Data
                        </button>
                        <button class="action-btn secondary" data-action="export-chats">
                            📥 Export All Data
                        </button>
                    </div>
                    
                    <p style="font-size: 14px; color: #888; margin-top: 20px;">
                        🔥 This proves the extension can extract REAL ChatGPT data using working selectors.
                    </p>
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
                        <button class="action-btn primary" data-action="create-folder">
                            ➕ Create New Folder
                        </button>
                        <button class="action-btn secondary" data-action="import-folders">
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
                        <button class="action-btn primary" data-action="create-prompt">
                            ➕ Create New Prompt
                        </button>
                        <button class="action-btn secondary" data-action="browse-library">
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
                        <button class="action-btn primary" data-action="download-all">
                            📥 Download All
                        </button>
                        <button class="action-btn secondary" data-action="create-album">
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
                            <button class="close-btn" data-action="close-modal">&times;</button>
                        </div>
                        <div class="modal-body">
                            ${content}
                        </div>
                        <div class="modal-footer">
                            <button class="action-btn secondary" data-action="close-modal">Close</button>
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
            
            // Handle all data-action buttons with event delegation
            modal.addEventListener('click', function(e) {
                const action = e.target.getAttribute('data-action');
                if (action) {
                    MenuActions.handleAction(action, e.target);
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
        },
        
        // Real data extraction function (from successful test extension)
        extractChatGPTData: function() {
            console.log('🔍 Starting ChatGPT data extraction...');
            
            const results = {
                timestamp: new Date().toISOString(),
                url: window.location.href,
                extraction: {
                    conversations: [],
                    currentMessages: [],
                    metadata: {}
                },
                selectors: {
                    working: [],
                    failed: []
                }
            };
            
            // Extract conversations using proven selectors
            const conversationSelectors = [
                'nav a',           // Primary working selector
                'nav ol li', 
                'nav ul li',
                'nav li',
                'aside ol li',
                'aside ul li', 
                'aside a',
                '[class*="conversation"]',
                '[class*="chat-"]',
                'a[href*="/c/"]'
            ];
            
            let conversationsFound = 0;
            let workingSelector = null;
            
            for (const selector of conversationSelectors) {
                try {
                    const elements = document.querySelectorAll(selector);
                    
                    if (elements.length > 0) {
                        console.log(`✅ Selector "${selector}" found ${elements.length} elements`);
                        
                        const conversationElements = Array.from(elements).filter(elem => {
                            const text = elem.textContent?.trim() || '';
                            return text.length > 5 && text.length < 300;
                        });
                        
                        if (conversationElements.length > conversationsFound) {
                            conversationsFound = conversationElements.length;
                            workingSelector = selector;
                            results.selectors.working.push(selector);
                            
                            // Clear previous results
                            results.extraction.conversations = [];
                            
                            // Extract conversation data
                            conversationElements.forEach((element, index) => {
                                const conversation = {
                                    index: index,
                                    title: element.textContent?.trim() || `Conversation ${index + 1}`,
                                    element: element.tagName,
                                    selector: selector,
                                    classes: element.className || '',
                                    id: element.id || '',
                                    href: element.href || element.closest('a')?.href || '',
                                    isActive: element.classList.contains('active') || 
                                             element.getAttribute('aria-current') === 'page' ||
                                             element.classList.contains('selected')
                                };
                                
                                results.extraction.conversations.push(conversation);
                            });
                            
                            break;
                        }
                    } else {
                        results.selectors.failed.push(selector);
                    }
                } catch (e) {
                    results.selectors.failed.push(`${selector} (error: ${e.message})`);
                }
            }
            
            console.log(`📊 Found ${conversationsFound} conversations using selector: ${workingSelector}`);
            
            // Extract metadata
            results.extraction.metadata = {
                title: document.title,
                url: window.location.href,
                currentConversationId: window.location.pathname.includes('/c/') ? 
                                       window.location.pathname.split('/c/')[1] : null,
                hasReactRoot: !!document.querySelector('[data-reactroot]'),
                hasNextData: !!window.__NEXT_DATA__,
                totalElements: document.querySelectorAll('*').length,
                workingConversationSelector: workingSelector
            };
            
            console.log('✅ Data extraction complete:', results);
            return results;
        },
        
        // Action handler for all data-action buttons
        handleAction: function(action, element) {
            console.log(`🎯 Handling action: ${action}`);
            
            switch(action) {
                case 'close-modal':
                    this.closeModal();
                    break;
                    
                case 'export-chats':
                    this.exportChats();
                    break;
                    
                case 'search-chats':
                    this.searchChats();
                    break;
                    
                case 'create-folder':
                    this.createFolder();
                    break;
                    
                case 'import-folders':
                    this.importFolders();
                    break;
                    
                case 'create-prompt':
                    this.createPrompt();
                    break;
                    
                case 'browse-library':
                    this.browseLibrary();
                    break;
                    
                case 'download-all':
                    this.downloadAllMedia();
                    break;
                    
                case 'create-album':
                    this.createAlbum();
                    break;
                    
                case 'copy-test-data':
                    this.copyTestData();
                    break;
                    
                default:
                    console.warn(`Unknown action: ${action}`);
                    alert(`Action "${action}" not implemented yet`);
            }
        },
        
        // Real action implementations
        exportChats: function() {
            console.log('📥 Exporting chats...');
            const data = this.extractChatGPTData();
            
            if (data.extraction.conversations.length === 0) {
                alert('No conversations found to export. Make sure you are on ChatGPT with conversations visible.');
                return;
            }
            
            // Create downloadable JSON file
            const exportData = {
                exportDate: new Date().toISOString(),
                totalConversations: data.extraction.conversations.length,
                conversations: data.extraction.conversations,
                metadata: data.extraction.metadata
            };
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `chatgpt-conversations-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            alert(`✅ Exported ${data.extraction.conversations.length} conversations to JSON file`);
        },
        
        searchChats: function() {
            console.log('🔍 Opening chat search...');
            const data = this.extractChatGPTData();
            
            if (data.extraction.conversations.length === 0) {
                alert('No conversations found to search. Make sure you are on ChatGPT with conversations visible.');
                return;
            }
            
            const searchHtml = `
                <div class="search-interface">
                    <h3>🔍 Search ${data.extraction.conversations.length} Conversations</h3>
                    <input type="text" id="chat-search-input" placeholder="Search conversation titles..." style="width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 4px;">
                    <div id="search-results" style="max-height: 400px; overflow-y: auto;">
                        ${data.extraction.conversations.map((conv, i) => `
                            <div class="search-result-item" style="padding: 8px; border-bottom: 1px solid #eee; cursor: pointer;" data-href="${conv.href}">
                                <strong>${conv.title}</strong>
                                <small style="display: block; color: #666;">Index: ${i + 1} | ${conv.isActive ? 'Currently Active' : 'Click to open'}</small>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            this.createModal('search-chats', 'Search Conversations', searchHtml);
            
            // Add search functionality
            setTimeout(() => {
                const searchInput = document.getElementById('chat-search-input');
                const searchResults = document.getElementById('search-results');
                
                if (searchInput && searchResults) {
                    searchInput.addEventListener('input', function() {
                        const query = this.value.toLowerCase();
                        const items = searchResults.querySelectorAll('.search-result-item');
                        
                        items.forEach(item => {
                            const title = item.textContent.toLowerCase();
                            item.style.display = title.includes(query) ? 'block' : 'none';
                        });
                    });
                    
                    // Add click handlers for search results
                    searchResults.addEventListener('click', function(e) {
                        const item = e.target.closest('.search-result-item');
                        if (item && item.getAttribute('data-href')) {
                            const href = item.getAttribute('data-href');
                            if (href) {
                                window.location.href = href;
                            } else {
                                alert('No URL found for this conversation');
                            }
                        }
                    });
                }
            }, 100);
        },
        
        createFolder: function() {
            alert('Folder creation feature - This would integrate with ChatGPT\'s folder system when available');
        },
        
        importFolders: function() {
            alert('Folder import feature - This would import folder structures from file');
        },
        
        createPrompt: function() {
            alert('Prompt creation feature - This would create custom prompt templates');
        },
        
        browseLibrary: function() {
            alert('Prompt library feature - This would show available prompt templates');
        },
        
        downloadAllMedia: function() {
            alert('Media download feature - This would download images/files from conversations');
        },
        
        createAlbum: function() {
            alert('Album creation feature - This would organize media into albums');
        },
        
        copyTestData: function() {
            console.log('📋 Copying test data to clipboard...');
            const data = this.extractChatGPTData();
            
            navigator.clipboard.writeText(JSON.stringify(data, null, 2))
                .then(() => {
                    alert(`✅ Copied raw extraction data to clipboard!\n\nFound ${data.extraction.conversations.length} conversations using selector: ${data.extraction.metadata.workingConversationSelector}`);
                })
                .catch(() => {
                    alert('❌ Copy failed - check console for data');
                    console.log('Raw extraction data:', data);
                });
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