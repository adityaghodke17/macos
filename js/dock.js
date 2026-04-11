// Dock magnification and app launcher
document.addEventListener('DOMContentLoaded', () => {
    const dock = document.querySelector('.dock');
    const dockItems = document.querySelectorAll('.dock-item');
    
    // Magnification effect
    dockItems.forEach(item => {
        item.addEventListener('mouseenter', (e) => {
            const rect = item.getBoundingClientRect();
            const center = rect.left + rect.width / 2;
            const dockRect = dock.getBoundingClientRect();
            
            dockItems.forEach(otherItem => {
                const otherRect = otherItem.getBoundingClientRect();
                const otherCenter = otherRect.left + otherRect.width / 2;
                const distance = Math.abs(center - otherCenter);
                const maxDistance = 150;
                
                if (distance < maxDistance) {
                    const scale = 1 + (1 - distance / maxDistance) * 0.5;
                    const icon = otherItem.querySelector('.dock-icon');
                    if (icon) {
                        icon.style.transform = `scale(${scale})`;
                    }
                }
            });
        });
        
        item.addEventListener('mouseleave', () => {
            dockItems.forEach(otherItem => {
                const icon = otherItem.querySelector('.dock-icon');
                if (icon) {
                    icon.style.transform = '';
                }
            });
        });
    });
    
    // Click to open apps
    dockItems.forEach(item => {
        item.addEventListener('click', () => {
            const appName = item.dataset.app;
            if (appName && window.openApp) {
                window.openApp(appName);
                
                // Add active indicator
                dockItems.forEach(di => di.classList.remove('active'));
                item.classList.add('active');
                
                // Remove active after 2 seconds
                setTimeout(() => {
                    if (window.openWindows[appName]) {
                        // Keep active if window is open
                    } else {
                        item.classList.remove('active');
                    }
                }, 2000);
            }
        });
    });
});

// Handle window close to remove active indicator
window.addEventListener('beforeunload', () => {
    // Cleanup
});
