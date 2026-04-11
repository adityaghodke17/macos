// Settings App
class SettingsApp {
    getContent() {
        return `
            <div class="settings-app">
                <div class="setting-item">
                    <span>🌙 Dark Mode</span>
                    <label class="switch">
                        <input type="checkbox" id="dark-mode-toggle">
                        <span class="slider"></span>
                    </label>
                </div>
                <div class="setting-item">
                    <span>🖼️ Wallpaper</span>
                    <select id="wallpaper-select" class="wallpaper-select">
                        <option value="default">Default macOS</option>
                        <option value="bigsur">Big Sur</option>
                        <option value="monterey">Monterey</option>
                    </select>
                </div>
                <div class="setting-item">
                    <span>🔊 Sound Effects</span>
                    <input type="range" min="0" max="100" value="50" id="volume-slider">
                </div>
                <div class="setting-item">
                    <span>💾 Clear All Data</span>
                    <button id="clear-data" style="background: rgba(255,95,87,0.8); border: none; color: white; padding: 5px 15px; border-radius: 6px; cursor: pointer;">Clear</button>
                </div>
                <div class="setting-item">
                    <span>ℹ️ About</span>
                    <span>macOS Clone v1.0</span>
                </div>
            </div>
        `;
    }
    
    attachEvents() {
        // Dark mode
        const darkModeToggle = document.getElementById('dark-mode-toggle');
        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    document.body.style.background = '#1a1a2e';
                    document.body.style.backgroundImage = 'none';
                } else {
                    document.body.style.backgroundImage = "url('../assets/wallpapers/default.jpg')";
                    document.body.style.backgroundSize = 'cover';
                }
            });
        }
        
        // Wallpaper
        const wallpaperSelect = document.getElementById('wallpaper-select');
        if (wallpaperSelect) {
            wallpaperSelect.addEventListener('change', (e) => {
                const wallpapers = {
                    default: '../assets/wallpapers/default.jpg',
                    bigsur: '../assets/wallpapers/bigsur.jpg',
                    monterey: '../assets/wallpapers/monterey.jpg'
                };
                const url = wallpapers[e.target.value];
                if (url) {
                    document.body.style.backgroundImage = `url('${url}')`;
                    document.body.style.backgroundSize = 'cover';
                    localStorage.setItem('wallpaper', url);
                }
            });
        }
        
        // Clear data
        const clearBtn = document.getElementById('clear-data');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                if (confirm('Clear all app data? This cannot be undone.')) {
                    localStorage.clear();
                    alert('All data cleared! Refresh the page.');
                    location.reload();
                }
            });
        }
        
        // Volume
        const volumeSlider = document.getElementById('volume-slider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                console.log(`Volume set to ${e.target.value}%`);
            });
        }
    }
}

const settingsApp = new SettingsApp();
window.registerApp('settings', {
    open: () => {
        if (window.openWindows['settings']) {
            document.getElementById('window-settings').classList.add('active');
            return;
        }
        
        const windowDiv = windowManager.createWindow('settings', 'Settings', settingsApp.getContent());
        windowDiv.classList.add('active');
        window.openWindows['settings'] = true;
        settingsApp.attachEvents();
    }
});
