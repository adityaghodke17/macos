// Todo List App
class TodoApp {
    constructor() {
        this.todos = this.loadTodos();
    }
    
    loadTodos() {
        const saved = localStorage.getItem('macos-todos');
        return saved ? JSON.parse(saved) : [
            { id: 1, text: 'Welcome to Todo App!', completed: false },
            { id: 2, text: 'Click to complete tasks', completed: false },
            { id: 3, text: 'Add new tasks below', completed: false }
        ];
    }
    
    saveTodos() {
        localStorage.setItem('macos-todos', JSON.stringify(this.todos));
    }
    
    getContent() {
        return `
            <div class="todo-container">
                <div class="todo-input-group">
                    <input type="text" class="todo-input" id="todo-input" placeholder="Add a new task...">
                    <button class="add-todo" id="add-todo">Add</button>
                </div>
                <div class="todos-list" id="todos-list"></div>
            </div>
        `;
    }
    
    attachEvents() {
        this.renderTodos();
        
        document.getElementById('add-todo').addEventListener('click', () => {
            const input = document.getElementById('todo-input');
            const text = input.value.trim();
            if (text) {
                this.todos.unshift({
                    id: Date.now(),
                    text: text,
                    completed: false
                });
                this.saveTodos();
                this.renderTodos();
                input.value = '';
            }
        });
        
        document.getElementById('todo-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                document.getElementById('add-todo').click();
            }
        });
    }
    
    renderTodos() {
        const container = document.getElementById('todos-list');
        if (!container) return;
        
        container.innerHTML = '';
        this.todos.forEach(todo => {
            const todoDiv = document.createElement('div');
            todoDiv.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            todoDiv.innerHTML = `
                <input type="checkbox" class="todo-check" ${todo.completed ? 'checked' : ''} data-id="${todo.id}">
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <button class="delete-todo" data-id="${todo.id}">Delete</button>
            `;
            
            todoDiv.querySelector('.todo-check').addEventListener('change', (e) => {
                const todoItem = this.todos.find(t => t.id == e.target.dataset.id);
                if (todoItem) {
                    todoItem.completed = e.target.checked;
                    this.saveTodos();
                    this.renderTodos();
                }
            });
            
            todoDiv.querySelector('.delete-todo').addEventListener('click', (e) => {
                this.todos = this.todos.filter(t => t.id != e.target.dataset.id);
                this.saveTodos();
                this.renderTodos();
            });
            
            container.appendChild(todoDiv);
        });
        
        if (this.todos.length === 0) {
            container.innerHTML = '<div style="text-align: center; opacity: 0.5;">No tasks! Add some above.</div>';
        }
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

const todoApp = new TodoApp();
window.registerApp('todo', {
    open: () => {
        if (window.openWindows['todo']) {
            document.getElementById('window-todo').classList.add('active');
            return;
        }
        
        const windowDiv = windowManager.createWindow('todo', 'Todo List', todoApp.getContent());
        windowDiv.classList.add('active');
        window.openWindows['todo'] = true;
        todoApp.attachEvents();
    }
});
