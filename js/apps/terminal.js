// Terminal App
class TerminalApp {
    constructor() {
        this.commands = {
            'help': 'Available: help, clear, date, echo, whoami, ls, pwd',
            'clear': 'CLEAR',
            'date': new Date().toString(),
            'whoami': 'user@macos-clone',
            'ls': 'Desktop Documents Downloads Music Pictures Videos',
            'pwd': '/Users/user',
            'echo': (args) => args.join(' ')
        };
    }
    
    getContent() {
        return `
            <div class="terminal" id="terminal">
                <div class="terminal-line">Welcome to macOS Terminal v1.0</div>
                <div class="terminal-line">Type 'help' for available commands</div>
                <div class="terminal-line" id="terminal-output"></div>
                <div class="terminal-input-line">
                    <span class="terminal-prompt">$</span>
                    <input type="text" class="terminal-input" id="terminal-input" autofocus>
                </div>
            </div>
        `;
    }
    
    attachEvents() {
        const input = document.getElementById('terminal-input');
        const output = document.getElementById('terminal-output');
        const terminal = document.getElementById('terminal');
        
        const addLine = (text, isCommand = false) => {
            const line = document.createElement('div');
            line.className = 'terminal-line';
            if (isCommand) {
                line.innerHTML = `<span class="terminal-prompt">$</span> ${text}`;
            } else {
                line.textContent = text;
            }
            output.appendChild(line);
            terminal.scrollTop = terminal.scrollHeight;
        };
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const command = input.value.trim();
                if (command) {
                    addLine(command, true);
                    
                    const [cmd, ...args] = command.split(' ');
                    const commandFn = this.commands[cmd.toLowerCase()];
                    
                    if (commandFn) {
                        if (cmd === 'clear') {
                            output.innerHTML = '';
                        } else if (typeof commandFn === 'function') {
                            addLine(commandFn(args));
                        } else {
                            addLine(commandFn);
                        }
                    } else {
                        addLine(`Command not found: ${cmd}. Type 'help' for available commands.`);
                    }
                }
                input.value = '';
            }
        });
    }
}

const terminalApp = new TerminalApp();
window.registerApp('terminal', {
    open: () => {
        if (window.openWindows['terminal']) {
            document.getElementById('window-terminal').classList.add('active');
            return;
        }
        
        const windowDiv = windowManager.createWindow('terminal', 'Terminal', terminalApp.getContent());
        windowDiv.classList.add('active');
        window.openWindows['terminal'] = true;
        terminalApp.attachEvents();
    }
});
