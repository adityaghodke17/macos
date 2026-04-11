// Window Manager - Drag, Resize, Close, Minimize
class WindowManager {
    constructor() {
        this.dragElement = null;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        this.init();
    }
    
    init() {
        this.setupGlobalListeners();
    }
    
    createWindow(appName, title, content) {
        const container = document.getElementById('windows-container');
        const windowId = `window-${appName}`;
        
        // Remove existing window if any
        const existing = document.getElementById(windowId);
        if (existing) {
            existing.remove();
        }
        
        const windowDiv = document.createElement('div');
        windowDiv.id = windowId;
        windowDiv.className = 'window';
        windowDiv.style.left = '100px';
        windowDiv.style.top = '60px';
        windowDiv.style.width = '600px';
        windowDiv.style.height = '500px';
        windowDiv.style.zIndex = ++nextZIndex;
        
        windowDiv.innerHTML = `
            <div class="window-header" data-window="${windowId}">
                <div class="window-controls">
                    <div class="window-close" data-app="${appName}"></div>
                    <div class="window-minimize" data-app="${appName}"></div>
                    <div class="window-maximize" data-app="${appName}"></div>
                </div>
                <div class="window-title">${title}</div>
            </div>
            <div class="window-content">
                ${content}
            </div>
        `;
        
        container.appendChild(windowDiv);
        
        // Add event listeners
        const header = windowDiv.querySelector('.window-header');
        header.addEventListener('mousedown', (e) => this.startDrag(e, windowDiv));
        
        const closeBtn = windowDiv.querySelector('.window-close');
        closeBtn.addEventListener('click', () => this.closeWindow(appName, windowDiv));
        
        const minimizeBtn = windowDiv.querySelector('.window-minimize');
        minimizeBtn.addEventListener('click', () => this.minimizeWindow(windowDiv));
        
        const maximizeBtn = windowDiv.querySelector('.window-maximize');
        maximizeBtn.addEventListener('click', () => this.maximizeWindow(windowDiv));
        
        windowDiv.addEventListener('mousedown', () => {
            windowDiv.style.zIndex = ++nextZIndex;
        });
        
        return windowDiv;
    }
    
    startDrag(e, windowDiv) {
        this.dragElement = windowDiv;
        this.dragOffsetX = e.clientX - windowDiv.offsetLeft;
        this.dragOffsetY = e.clientY - windowDiv.offsetTop;
        
        document.addEventListener('mousemove', this.onDrag);
        document.addEventListener('mouseup', this.stopDrag);
    }
    
    onDrag = (e) => {
        if (this.dragElement) {
            const newX = e.clientX - this.dragOffsetX;
            const newY = e.clientY - this.dragOffsetY;
            
            // Keep within bounds
            const maxX = window.innerWidth - this.dragElement.offsetWidth;
            const maxY = window.innerHeight - this.dragElement.offsetHeight - 80;
            
            this.dragElement.style.left = `${Math.max(0, Math.min(newX, maxX))}px`;
            this.dragElement.style.top = `${Math.max(28, Math.min(newY, maxY))}px`;
        }
    }
    
    stopDrag = () => {
        this.dragElement = null;
        document.removeEventListener('mousemove', this.onDrag);
        document.removeEventListener('mouseup', this.stopDrag);
    }
    
    closeWindow(appName, windowDiv) {
        windowDiv.classList.remove('active');
        delete window.openWindows[appName];
        
        // Remove active class from dock
        const dockItem = document.querySelector(`.dock-item[data-app="${appName}"]`);
        if (dockItem) {
            dockItem.classList.remove('active');
        }
    }
    
    minimizeWindow(windowDiv) {
        windowDiv.style.transform = 'scale(0)';
        windowDiv.style.opacity = '0';
        setTimeout(() => {
            windowDiv.classList.remove('active');
            windowDiv.style.transform = '';
            windowDiv.style.opacity = '';
        }, 200);
    }
    
    maximizeWindow(windowDiv) {
        if (windowDiv.style.width === '100%') {
            // Restore
            windowDiv.style.width = '';
            windowDiv.style.height = '';
            windowDiv.style.left = '';
            windowDiv.style.top = '';
        } else {
            // Maximize
            windowDiv.style.width = 'calc(100% - 40px)';
            windowDiv.style.height = 'calc(100% - 108px)';
            windowDiv.style.left = '20px';
            windowDiv.style.top = '28px';
        }
    }
}

// Initialize window manager
const windowManager = new WindowManager();
