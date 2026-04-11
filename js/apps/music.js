// Music Player App
class MusicApp {
    constructor() {
        this.currentTrack = 0;
        this.isPlaying = false;
        this.tracks = [
            { title: 'Summer Breeze', artist: 'Ambient Waves', duration: '3:45' },
            { title: 'Midnight City', artist: 'Electronic Dreams', duration: '4:20' },
            { title: 'Mountain High', artist: 'Nature Sounds', duration: '5:10' },
            { title: 'Ocean Drive', artist: 'Synthwave', duration: '3:55' }
        ];
    }
    
    getContent() {
        return `
            <div class="music-player">
                <div class="album-art">🎵</div>
                <h3 id="track-title">${this.tracks[0].title}</h3>
                <p id="track-artist">${this.tracks[0].artist}</p>
                <div class="music-controls">
                    <button class="control-btn" data-action="prev">⏮</button>
                    <button class="control-btn" data-action="play">▶</button>
                    <button class="control-btn" data-action="next">⏭</button>
                </div>
                <div class="playlist">
                    <h4>Playlist</h4>
                    <ul id="playlist" style="list-style: none; text-align: left;">
                        ${this.tracks.map((track, i) => `
                            <li data-index="${i}" style="padding: 8px; cursor: pointer; border-bottom: 1px solid rgba(255,255,255,0.1);">
                                🎧 ${track.title} - ${track.artist}
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
    
    attachEvents() {
        document.querySelector('[data-action="prev"]').addEventListener('click', () => this.prevTrack());
        document.querySelector('[data-action="play"]').addEventListener('click', () => this.playPause());
        document.querySelector('[data-action="next"]').addEventListener('click', () => this.nextTrack());
        
        document.querySelectorAll('#playlist li').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                this.playTrack(index);
            });
        });
    }
    
    playTrack(index) {
        this.currentTrack = index;
        const track = this.tracks[index];
        document.getElementById('track-title').textContent = track.title;
        document.getElementById('track-artist').textContent = track.artist;
        this.isPlaying = true;
        const playBtn = document.querySelector('[data-action="play"]');
        playBtn.textContent = '⏸';
    }
    
    playPause() {
        this.isPlaying = !this.isPlaying;
        const playBtn = document.querySelector('[data-action="play"]');
        playBtn.textContent = this.isPlaying ? '⏸' : '▶';
    }
    
    nextTrack() {
        this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
        this.playTrack(this.currentTrack);
    }
    
    prevTrack() {
        this.currentTrack = (this.currentTrack - 1 + this.tracks.length) % this.tracks.length;
        this.playTrack(this.currentTrack);
    }
}

const musicApp = new MusicApp();
window.registerApp('music', {
    open: () => {
        if (window.openWindows['music']) {
            document.getElementById('window-music').classList.add('active');
            return;
        }
        
        const windowDiv = windowManager.createWindow('music', 'Music', musicApp.getContent());
        windowDiv.classList.add('active');
        window.openWindows['music'] = true;
        musicApp.attachEvents();
    }
});
