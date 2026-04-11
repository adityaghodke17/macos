// Calendar App
class CalendarApp {
    constructor() {
        this.currentDate = new Date();
        this.events = this.loadEvents();
    }
    
    loadEvents() {
        const saved = localStorage.getItem('macos-calendar-events');
        return saved ? JSON.parse(saved) : {};
    }
    
    saveEvents() {
        localStorage.setItem('macos-calendar-events', JSON.stringify(this.events));
    }
    
    getContent() {
        return `
            <div class="calendar-app">
                <div class="calendar-header">
                    <button class="calendar-nav" data-nav="prev">◀</button>
                    <h3 id="calendar-month-year">${this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                    <button class="calendar-nav" data-nav="next">▶</button>
                </div>
                <div class="calendar-grid" id="calendar-grid"></div>
                <div class="events-section">
                    <h4>Events</h4>
                    <input type="text" id="event-input" placeholder="Add event..." style="width: 70%; background: rgba(255,255,255,0.1); border: none; color: white; padding: 8px; border-radius: 6px;">
                    <button id="add-event" style="background: rgba(0,122,255,0.8); border: none; color: white; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Add</button>
                    <div class="events-list" id="events-list"></div>
                </div>
            </div>
        `;
    }
    
    attachEvents() {
        this.renderCalendar();
        
        document.querySelector('[data-nav="prev"]').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.renderCalendar();
        });
        
        document.querySelector('[data-nav="next"]').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.renderCalendar();
        });
        
        document.getElementById('add-event').addEventListener('click', () => {
            const input = document.getElementById('event-input');
            const text = input.value.trim();
            if (text) {
                const dateKey = this.getCurrentDateKey();
                if (!this.events[dateKey]) this.events[dateKey] = [];
                this.events[dateKey].push(text);
                this.saveEvents();
                this.renderEvents();
                input.value = '';
            }
        });
    }
    
    getCurrentDateKey() {
        return this.currentDate.toISOString().split('T')[0];
    }
    
    renderCalendar() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startingDay = firstDay.getDay();
        const daysInMonth = lastDay.getDate();
        
        const grid = document.getElementById('calendar-grid');
        grid.innerHTML = '';
        
        // Day headers
        ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.textContent = day;
            dayHeader.style.fontWeight = 'bold';
            dayHeader.style.textAlign = 'center';
            dayHeader.style.padding = '8px';
            grid.appendChild(dayHeader);
        });
        
        // Empty cells for previous month
        for (let i = 0; i < startingDay; i++) {
            const empty = document.createElement('div');
            grid.appendChild(empty);
        }
        
        // Days of current month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            dayCell.textContent = day;
            
            const today = new Date();
            if (today.getDate() === day && today.getMonth() === month && today.getFullYear() === year) {
                dayCell.classList.add('today');
            }
            
            const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            if (this.events[dateKey] && this.events[dateKey].length > 0) {
                dayCell.style.border = '2px solid rgba(0,122,255,0.8)';
            }
            
            dayCell.addEventListener('click', () => this.selectDate(dateKey));
            grid.appendChild(dayCell);
        }
        
        document.getElementById('calendar-month-year').textContent = 
            this.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        
        this.renderEvents();
    }
    
    selectDate(dateKey) {
        this.selectedDate = dateKey;
        this.renderEvents();
    }
    
    renderEvents() {
        const eventsList = document.getElementById('events-list');
        if (!eventsList) return;
        
        const dateKey = this.selectedDate || this.getCurrentDateKey();
        const dayEvents = this.events[dateKey] || [];
        
        eventsList.innerHTML = '';
        dayEvents.forEach((event, index) => {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event-item';
            eventDiv.innerHTML = `
                <span>📝 ${event}</span>
                <button data-index="${index}" style="float: right; background: rgba(255,95,87,0.8); border: none; color: white; padding: 2px 8px; border-radius: 4px; cursor: pointer;">Delete</button>
            `;
            eventDiv.querySelector('button').addEventListener('click', () => {
                this.events[dateKey].splice(index, 1);
                if (this.events[dateKey].length === 0) delete this.events[dateKey];
                this.saveEvents();
                this.renderEvents();
                this.renderCalendar();
            });
            eventsList.appendChild(eventDiv);
        });
        
        if (dayEvents.length === 0) {
            eventsList.innerHTML = '<div style="opacity: 0.5; text-align: center;">No events for this day</div>';
        }
    }
}

const calendarApp = new CalendarApp();
window.registerApp('calendar', {
    open: () => {
        if (window.openWindows['calendar']) {
            document.getElementById('window-calendar').classList.add('active');
            return;
        }
        
        const windowDiv = windowManager.createWindow('calendar', 'Calendar', calendarApp.getContent());
        windowDiv.classList.add('active');
        window.openWindows['calendar'] = true;
        calendarApp.attachEvents();
    }
});
