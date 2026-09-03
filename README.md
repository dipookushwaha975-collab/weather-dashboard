# Weather Dashboard

A modern, feature-rich weather dashboard that fetches real-time weather data from OpenWeatherMap API.

## Features

✨ **Real-time Weather Data**
- Current weather conditions for any city
- Hourly forecast (8 hours)
- 7-day weather forecast
- UV Index tracking

🌡️ **Temperature Units**
- Toggle between Celsius and Fahrenheit
- Automatic conversion

📍 **Location Features**
- Search by city name with autocomplete
- Geolocation-based weather
- Favorite cities saved locally

📊 **Detailed Weather Information**
- Temperature, humidity, wind speed
- Visibility, pressure, feels-like temperature
- Weather description with icons
- UV index

📱 **Responsive Design**
- Beautiful UI for desktop and mobile
- Smooth animations and transitions
- Dark/light mode compatible

## Installation

### Step 1: Get API Key
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Get your free API key from the dashboard

### Step 2: Setup
1. Clone the repository
   ```bash
   git clone https://github.com/dipookushwaha975-collab/weather-dashboard.git
   cd weather-dashboard
   ```

2. Update API Key
   - Open `script.js`
   - Replace `YOUR_OPENWEATHERMAP_API_KEY` with your actual API key
   ```javascript
   const API_KEY = 'your_actual_api_key_here';
   ```

3. Open in Browser
   - Simply open `index.html` in your web browser
   - No server setup required for basic functionality

### Step 3: (Optional) Deploy

#### Using Python HTTP Server
```bash
python -m http.server 8000
# Visit http://localhost:8000
```

#### Using Node.js
```bash
npx http-server
```

## Usage

1. **Search for a City**
   - Type city name in search box
   - See autocomplete suggestions
   - Click suggestion or press Enter

2. **Use Current Location**
   - Click the location button
   - Allow browser permission for geolocation
   - See weather for your current location

3. **Toggle Temperature Unit**
   - Click the °C/°F button
   - All temperatures update automatically

4. **Add to Favorites**
   - View a city's weather
   - Click to add/remove from favorites
   - Favorites saved in browser storage

## API Reference

### OpenWeatherMap Endpoints Used

1. **Geocoding API**
   ```
   GET /geo/1.0/direct?q={city}&limit=5&appid={API_KEY}
   ```
   - Gets coordinates for city name
   - Provides autocomplete suggestions

2. **Current Weather API**
   ```
   GET /data/2.5/weather?lat={lat}&lon={lon}&units={units}&appid={API_KEY}
   ```
   - Gets current weather data

3. **Forecast API**
   ```
   GET /data/2.5/forecast?lat={lat}&lon={lon}&units={units}&appid={API_KEY}
   ```
   - Gets 5-day/40-item forecast
   - 3-hour intervals

4. **UV Index API**
   ```
   GET /data/2.5/uvi?lat={lat}&lon={lon}&appid={API_KEY}
   ```
   - Gets UV index for location

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## File Structure

```
weather-dashboard/
├── index.html       # Main HTML
├── style.css        # Styling
├── script.js        # JavaScript logic
└── README.md        # Documentation
```

## Configuration

### Available Units
- `metric` - Celsius, m/s wind speed
- `imperial` - Fahrenheit, mph wind speed

### API Key Options
- **Free Tier**: 60 calls/min, 1,000,000 calls/month
- **Professional**: Higher rate limits
- **Enterprise**: Custom limits

## Troubleshooting

### Weather data not loading
- Verify API key is correct
- Check OpenWeatherMap API status
- Ensure internet connection
- Check browser console for errors

### Geolocation not working
- Allow location permission in browser
- Ensure HTTPS connection (required for geolocation)
- Check browser privacy settings

### Suggestions not appearing
- Verify city name is spelled correctly
- Check API key has Geocoding API enabled
- Wait a moment for API response

## Performance Tips

1. **Caching**: Weather data is only fetched on search/refresh
2. **Efficient Rendering**: Updates only changed elements
3. **Local Storage**: Favorites stored client-side
4. **Responsive Images**: Weather icons optimized

## Future Enhancements

- [ ] Air quality index (AQI)
- [ ] Pollution levels
- [ ] Severe weather alerts
- [ ] Historical weather data
- [ ] Multiple location comparison
- [ ] Weather maps integration
- [ ] Push notifications
- [ ] PWA support

## License

MIT License - Free to use and modify

## Credits

- Weather data: [OpenWeatherMap](https://openweathermap.org/)
- Icons: [Font Awesome](https://fontawesome.com/)

## Support

For issues or questions:
- Open an issue on GitHub
- Check OpenWeatherMap documentation
- Review browser console for errors

---

**Happy Weather Tracking!** 🌤️