// Notes App with localStorage
class NotesApp {
    constructor() {
        this.notes = this.loadNotes();
        this.currentNoteId = null;
    }
    
    loadNotes() {
        const saved = localStorage.getItem('macos-notes');
        return saved ? JSON.parse(saved) : [
            { id: '1', title: 'Welcome', content: 'Welcome to macOS Notes! Create and save your notes here.' }
        ];
    }
    
    saveNotes() {
        localStorage.setItem('macos-notes', JSON.stringify(this.notes));
    }
    
    getContent() {
        return `
            <div class="notes-container">
                <div class="notes-sidebar">
                    <button class="new-note-btn">+ New Note</button>
                    <ul class="notes-list" id="notes-list"></ul>
                </div>
                <div class="notes-editor">
                    <input type="text" class="note-title" id="note-title" placeholder="Title">
                    <textarea class="note-content" id="note-content" placeholder="Write your note here..."></textarea>
                </div>
            </div>
        `;
    }
    
    attachEvents() {
        this.renderNotesList();
        
        const newBtn = document.querySelector('.new-note-btn');
        newBtn.addEventListener('click', () => this.createNewNote());
        
        const titleInput = document.getElementById('note-title');
        const contentInput = document.getElementById('note-content');
        
        const saveHandler = () => {
            if (this.currentNoteId) {
                const note = this.notes.find(n => n.id === this.currentNoteId);
                if (note) {
                    note.title = titleInput.value;
                    note.content = contentInput.value;
                    this.saveNotes();
                    this.renderNotesList();
                }
            }
        };
        
        titleInput.addEventListener('input', saveHandler);
        contentInput.addEventListener('input', saveHandler);
    }
    
    renderNotesList() {
        const list = document.getElementById('notes-list');
        if (!list) return;
        
        list.innerHTML = '';
        this.notes.forEach(note => {
            const li = document.createElement('li');
            li.className = 'note-item';
            if (this.currentNoteId === note.id) li.classList.add('active');
            li.textContent = note.title || 'Untitled';
            li.addEventListener('click', () => this.loadNote(note.id));
            list.appendChild(li);
        });
    }
    
    loadNote(id) {
        const note = this.notes.find(n => n.id === id);
        if (note) {
            this.currentNoteId = note.id;
            document.getElementById('note-title').value = note.title;
            document.getElementById('note-content').value = note.content;
            this.renderNotesList();
        }
    }
    
    createNewNote() {
        const newNote = {
            id: Date.now().toString(),
            title: 'New Note',
            content: ''
        };
        this.notes.unshift(newNote);
        this.saveNotes();
        this.loadNote(newNote.id);
    }
}

const notesApp = new NotesApp();
window.registerApp('notes', {
    open: () => {
        if (window.openWindows['notes']) {
            document.getElementById('window-notes').classList.add('active');
            return;
        }
        
        const windowDiv = windowManager.createWindow('notes', 'Notes', notesApp.getContent());
        windowDiv.classList.add('active');
        window.openWindows['notes'] = true;
        notesApp.attachEvents();
    }
});
