// Browser App
class BrowserApp {
    getContent() {
        return `
            <div class="browser-app">
                <div class="browser-url">
                    <input type="text" class="url-input" id="url-input" value="https://www.google.com">
                    <button class="go-btn" id="go-btn">Go</button>
                </div>
                <iframe class="browser-frame" id="browser-frame" src="https://www.google.com" sandbox="allow-same-origin allow-scripts allow-popups allow-forms"></iframe>
            </div>
        `;
    }
    
    attachEvents() {
        const goBtn = document.getElementById('go-btn');
        const urlInput = document.getElementById('url-input');
        const frame = document.getElementById('browser-frame');
        
        const navigate = () => {
            let url = urlInput.value;
            if (!url.startsWith('http')) {
                url = 'https://' + url;
            }
            frame.src = url;
        };
        
        goBtn.addEventListener('click', navigate);
        urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') navigate();
        });
    }
}

const browserApp = new BrowserApp();
window.registerApp('safari', {
    open: () => {
        if (window.openWindows['safari']) {
            document.getElementById('window-safari').classList.add('active');
            return;
        }
        
        const windowDiv = windowManager.createWindow('safari', 'Safari', browserApp.getContent());
        windowDiv.classList.add('active');
        window.openWindows['safari'] = true;
        browserApp.attachEvents();
    }
});
