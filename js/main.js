// Main Application Controller
let windows = [];
let nextZIndex = 100;

// Update time
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
    });
    document.getElementById('time').textContent = timeString;
}
setInterval(updateTime, 1000);
updateTime();

// Desktop icons click
document.querySelectorAll('.desktop-icon').forEach(icon => {
    icon.addEventListener('click', () => {
        const appName = icon.dataset.app;
        if (appName && window.openApp) {
            window.openApp(appName);
        }
    });
});

// Global app registry
window.apps = {};
window.openWindows = {};

// Register app with window manager
window.registerApp = (appName, appWindow) => {
    window.apps[appName] = appWindow;
};

window.openApp = (appName) => {
    if (window.apps[appName]) {
        window.apps[appName].open();
    }
};

window.closeApp = (appName) => {
    if (window.openWindows[appName]) {
        const windowDiv = document.getElementById(`window-${appName}`);
        if (windowDiv) {
            windowDiv.classList.remove('active');
        }
        delete window.openWindows[appName];
    }
};

// Bring window to front
window.bringToFront = (windowId) => {
    nextZIndex++;
    const windowDiv = document.getElementById(windowId);
    if (windowDiv) {
        windowDiv.style.zIndex = nextZIndex;
    }
};

// Initialize wallpaper from settings
const savedWallpaper = localStorage.getItem('wallpaper');
if (savedWallpaper) {
    document.body.style.backgroundImage = `url('${savedWallpaper}')`;
}

console.log('macOS Clone Ready! 🚀');
