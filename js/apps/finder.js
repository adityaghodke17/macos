// Finder App - File Browser
class FinderApp {
    constructor() {
        this.currentPath = '/Users/user';
        this.files = {
            '/Users/user': [
                { name: 'Desktop', type: 'folder', icon: '📁' },
                { name: 'Documents', type: 'folder', icon: '📁' },
                { name: 'Downloads', type: 'folder', icon: '📁' },
                { name: 'Music', type: 'folder', icon: '🎵' },
                { name: 'Pictures', type: 'folder', icon: '🖼️' },
                { name: 'Videos', type: 'folder', icon: '🎬' },
                { name: 'readme.txt', type: 'file', icon: '📄', size: '1.2 KB' },
                { name: 'notes.txt', type: 'file', icon: '📄', size: '0.5 KB' }
            ],
            '/Users/user/Documents': [
                { name: '..', type: 'back', icon: '📂' },
                { name: 'work.docx', type: 'file', icon: '📄', size: '45 KB' },
                { name: 'project.pdf', type: 'file', icon: '📄', size: '128 KB' }
            ],
            '/Users/user/Downloads': [
                { name: '..', type: 'back', icon: '📂' },
                { name: 'setup.dmg', type: 'file', icon: '💿', size: '2.1 MB' }
            ]
        };
    }
    
    getContent() {
        return `
            <div class="finder-app">
                <div class="finder-sidebar" style="width: 150px; float: left; border-right: 1px solid rgba(255,255,255,0.1);">
                    <div style="padding: 10px;">
                        <div><strong>Favorites</strong></div>
                        <div data-path="/Users/user" class="finder-nav">🏠 User</div>
                        <div data-path="/Users/user/Desktop" class="finder-nav">🖥️ Desktop</div>
                        <div data-path="/Users/user/Documents" class="finder-nav">📄 Documents</div>
                        <div data-path="/Users/user/Downloads" class="finder-nav">⬇️ Downloads</div>
                    </div>
                </div>
                <div class="finder-content" style="margin-left: 160px; padding: 10px;">
                    <div class="finder-path" style="padding: 5px; background: rgba(255,255,255,0.05); border-radius: 6px; margin-bottom: 10px;">
                        📍 <span id="finder-path">${this.currentPath}</span>
                    </div>
                    <div class="finder-grid" id="finder-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(80px, 1fr)); gap: 10px;"></div>
                </div>
            </div>
        `;
    }
    
    attachEvents() {
        this.renderFinder();
        
        document.querySelectorAll('.finder-nav').forEach(nav => {
            nav.addEventListener('click', () => {
                this.currentPath = nav.dataset.path;
                this.renderFinder();
            });
        });
    }
    
    renderFinder() {
        const grid = document.getElementById('finder-grid');
        const pathSpan = document.getElementById('finder-path');
        if (!grid) return;
        
        pathSpan.textContent = this.currentPath;
        
        const items = this.files[this.currentPath] || [];
        grid.innerHTML = '';
        
        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'finder-item';
            itemDiv.style.cssText = 'text-align: center; padding: 10px; cursor: pointer; border-radius: 8px;';
            itemDiv.innerHTML = `
                <div style="font-size: 32px;">${item.icon}</div>
                <div style="font-size: 11px; margin-top: 5px;">${item.name}</div>
                ${item.size ? `<div style="font-size: 9px; opacity: 0.5;">${item.size}</div>` : ''}
            `;
            
            if (item.type === 'folder' && this.files[`${this.currentPath}/${item.name}`]) {
                itemDiv.addEventListener('dblclick', () => {
                    this.currentPath = `${this.currentPath}/${item.name}`;
                    this.renderFinder();
                });
            } else if (item.type === 'back') {
                itemDiv.addEventListener('dblclick', () => {
                    const parts = this.currentPath.split('/');
                    parts.pop();
                    this.currentPath = parts.join('/') || '/Users/user';
                    this.renderFinder();
                });
            }
            
            grid.appendChild(itemDiv);
        });
        
        if (items.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; opacity: 0.5;">This folder is empty</div>';
        }
    }
}

const finderApp = new FinderApp();
window.registerApp('finder', {
    open: () => {
        if (window.openWindows['finder']) {
            document.getElementById('window-finder').classList.add('active');
            return;
        }
        
        const windowDiv = windowManager.createWindow('finder', 'Finder', finderApp.getContent());
        windowDiv.classList.add('active');
        window.openWindows['finder'] = true;
        finderApp.attachEvents();
    }
});
