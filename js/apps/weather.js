// Weather App with Live API
class WeatherApp {
    async getWeather() {
        try {
            // Using free API (no API key needed for demo)
            const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=28.6139&longitude=77.2090&current_weather=true');
            const data = await response.json();
            return data.current_weather;
        } catch (error) {
            return { temperature: 24, windspeed: 10, weathercode: 0 };
        }
    }
    
    getContent() {
        return `
            <div class="weather-app">
                <h2>Weather</h2>
                <div class="weather-temp" id="weather-temp">--°C</div>
                <div class="weather-condition" id="weather-condition">Loading...</div>
                <div class="weather-details">
                    <div>💨 Wind: <span id="weather-wind">--</span> km/h</div>
                </div>
                <p style="margin-top: 20px; opacity: 0.6;">Location: New Delhi, India</p>
            </div>
        `;
    }
    
    async attachEvents() {
        const weather = await this.getWeather();
        document.getElementById('weather-temp').textContent = `${weather.temperature}°C`;
        document.getElementById('weather-wind').textContent = weather.windspeed;
        
        // Weather condition based on code
        const condition = this.getWeatherCondition(weather.weathercode);
        document.getElementById('weather-condition').textContent = condition;
    }
    
    getWeatherCondition(code) {
        const conditions = {
            0: '☀️ Clear sky',
            1: '🌤️ Mainly clear',
            2: '⛅ Partly cloudy',
            3: '☁️ Overcast',
            45: '🌫️ Foggy',
            51: '🌧️ Light drizzle',
            61: '🌧️ Rainy',
            71: '❄️ Snowfall'
        };
        return conditions[code] || '🌤️ Partly cloudy';
    }
}

const weatherApp = new WeatherApp();
window.registerApp('weather', {
    open: async () => {
        if (window.openWindows['weather']) {
            document.getElementById('window-weather').classList.add('active');
            return;
        }
        
        const windowDiv = windowManager.createWindow('weather', 'Weather', weatherApp.getContent());
        windowDiv.classList.add('active');
        window.openWindows['weather'] = true;
        await weatherApp.attachEvents();
    }
});
