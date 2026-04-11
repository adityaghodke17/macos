// Calculator App
class CalculatorApp {
    constructor() {
        this.currentValue = '0';
        this.previousValue = null;
        this.operation = null;
        this.waitingForOperand = false;
    }
    
    getContent() {
        return `
            <div class="calculator">
                <div class="calc-display" id="calc-display">0</div>
                <div class="calc-btn" data-action="clear">C</div>
                <div class="calc-btn" data-action="sign">±</div>
                <div class="calc-btn" data-action="percent">%</div>
                <div class="calc-btn operator" data-action="divide">÷</div>
                
                <div class="calc-btn" data-digit="7">7</div>
                <div class="calc-btn" data-digit="8">8</div>
                <div class="calc-btn" data-digit="9">9</div>
                <div class="calc-btn operator" data-action="multiply">×</div>
                
                <div class="calc-btn" data-digit="4">4</div>
                <div class="calc-btn" data-digit="5">5</div>
                <div class="calc-btn" data-digit="6">6</div>
                <div class="calc-btn operator" data-action="subtract">-</div>
                
                <div class="calc-btn" data-digit="1">1</div>
                <div class="calc-btn" data-digit="2">2</div>
                <div class="calc-btn" data-digit="3">3</div>
                <div class="calc-btn operator" data-action="add">+</div>
                
                <div class="calc-btn" data-digit="0">0</div>
                <div class="calc-btn" data-action="decimal">.</div>
                <div class="calc-btn equals" data-action="equals">=</div>
            </div>
        `;
    }
    
    attachEvents() {
        const display = document.getElementById('calc-display');
        
        // Digit buttons
        document.querySelectorAll('[data-digit]').forEach(btn => {
            btn.addEventListener('click', () => {
                const digit = btn.dataset.digit;
                this.inputDigit(digit);
                display.textContent = this.currentValue;
            });
        });
        
        // Actions
        document.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.handleAction(action);
                display.textContent = this.currentValue;
            });
        });
    }
    
    inputDigit(digit) {
        if (this.waitingForOperand) {
            this.currentValue = digit;
            this.waitingForOperand = false;
        } else {
            this.currentValue = this.currentValue === '0' ? digit : this.currentValue + digit;
        }
    }
    
    handleAction(action) {
        switch(action) {
            case 'clear':
                this.currentValue = '0';
                this.previousValue = null;
                this.operation = null;
                break;
            case 'sign':
                this.currentValue = String(parseFloat(this.currentValue) * -1);
                break;
            case 'percent':
                this.currentValue = String(parseFloat(this.currentValue) / 100);
                break;
            case 'decimal':
                if (!this.currentValue.includes('.')) {
                    this.currentValue += '.';
                }
                break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                this.setOperation(action);
                break;
            case 'equals':
                this.compute();
                break;
        }
    }
    
    setOperation(op) {
        if (this.operation && !this.waitingForOperand) {
            this.compute();
        }
        this.previousValue = parseFloat(this.currentValue);
        this.operation = op;
        this.waitingForOperand = true;
    }
    
    compute() {
        if (!this.operation || this.previousValue === null) return;
        
        const current = parseFloat(this.currentValue);
        let result;
        
        switch(this.operation) {
            case 'add':
                result = this.previousValue + current;
                break;
            case 'subtract':
                result = this.previousValue - current;
                break;
            case 'multiply':
                result = this.previousValue * current;
                break;
            case 'divide':
                result = this.previousValue / current;
                break;
        }
        
        this.currentValue = String(result);
        this.operation = null;
        this.previousValue = null;
        this.waitingForOperand = false;
    }
}

// Register app
const calculatorApp = new CalculatorApp();
window.registerApp('calculator', {
    open: () => {
        if (window.openWindows['calculator']) {
            document.getElementById('window-calculator').classList.add('active');
            return;
        }
        
        const windowDiv = windowManager.createWindow('calculator', 'Calculator', calculatorApp.getContent());
        windowDiv.classList.add('active');
        window.openWindows['calculator'] = true;
        calculatorApp.attachEvents();
    }
});
