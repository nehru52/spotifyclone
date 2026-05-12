/**
 * Weather Service
 * Fetches weather data for Rome using OpenWeatherMap API
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const WEATHER_API_KEY = 'YOUR_API_KEY'; // You'll need to get a free API key from openweathermap.org
const WEATHER_CACHE_KEY = 'weather_cache';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Rome coordinates
const ROME_LAT = 41.9028;
const ROME_LON = 12.4964;

export interface WeatherData {
  temp: number;
  feelsLike: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  timestamp: number;
}

interface WeatherCache {
  data: WeatherData;
  timestamp: number;
}

class WeatherService {
  /**
   * Get weather icon name for Ionicons based on OpenWeatherMap icon code
   */
  private getWeatherIcon(iconCode: string): string {
    const iconMap: { [key: string]: string } = {
      '01d': 'sunny',           // clear sky day
      '01n': 'moon',            // clear sky night
      '02d': 'partly-sunny',    // few clouds day
      '02n': 'cloudy-night',    // few clouds night
      '03d': 'cloud',           // scattered clouds
      '03n': 'cloud',
      '04d': 'cloudy',          // broken clouds
      '04n': 'cloudy',
      '09d': 'rainy',           // shower rain
      '09n': 'rainy',
      '10d': 'rainy',           // rain day
      '10n': 'rainy',           // rain night
      '11d': 'thunderstorm',    // thunderstorm
      '11n': 'thunderstorm',
      '13d': 'snow',            // snow
      '13n': 'snow',
      '50d': 'cloudy',          // mist
      '50n': 'cloudy',
    };

    return iconMap[iconCode] || 'cloud';
  }

  /**
   * Fetch weather data from OpenWeatherMap API
   */
  async fetchWeather(lat?: number, lon?: number): Promise<WeatherData | null> {
    try {
      // Use Rome coordinates by default
      const latitude = lat || ROME_LAT;
      const longitude = lon || ROME_LON;

      // Check cache first
      const cached = await this.getCachedWeather();
      if (cached) {
        console.log('[WeatherService] Using cached weather data');
        return cached;
      }

      console.log('[WeatherService] Fetching weather data...');

      // Note: You need to get a free API key from https://openweathermap.org/api
      // For now, return mock data if no API key
      if (!WEATHER_API_KEY || WEATHER_API_KEY === 'YOUR_API_KEY') {
        console.warn('[WeatherService] No API key configured, using mock data');
        return this.getMockWeather();
      }

      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error('[WeatherService] API error:', response.status);
        return this.getMockWeather();
      }

      const data = await response.json();

      const weatherData: WeatherData = {
        temp: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        description: data.weather[0].description,
        icon: this.getWeatherIcon(data.weather[0].icon),
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
        timestamp: Date.now(),
      };

      // Cache the data
      await this.cacheWeather(weatherData);

      return weatherData;
    } catch (error) {
      console.error('[WeatherService] Error fetching weather:', error);
      return this.getMockWeather();
    }
  }

  /**
   * Get cached weather data if still valid
   */
  private async getCachedWeather(): Promise<WeatherData | null> {
    try {
      const cached = await AsyncStorage.getItem(WEATHER_CACHE_KEY);
      if (!cached) return null;

      const { data, timestamp }: WeatherCache = JSON.parse(cached);
      
      // Check if cache is still valid (30 minutes)
      if (Date.now() - timestamp < CACHE_DURATION) {
        return data;
      }

      return null;
    } catch (error) {
      console.error('[WeatherService] Error reading cache:', error);
      return null;
    }
  }

  /**
   * Cache weather data
   */
  private async cacheWeather(data: WeatherData): Promise<void> {
    try {
      const cache: WeatherCache = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(cache));
    } catch (error) {
      console.error('[WeatherService] Error caching weather:', error);
    }
  }

  /**
   * Get mock weather data (fallback)
   */
  private getMockWeather(): WeatherData {
    return {
      temp: 22,
      feelsLike: 21,
      description: 'partly cloudy',
      icon: 'partly-sunny',
      humidity: 65,
      windSpeed: 12,
      timestamp: Date.now(),
    };
  }

  /**
   * Clear weather cache
   */
  async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(WEATHER_CACHE_KEY);
    } catch (error) {
      console.error('[WeatherService] Error clearing cache:', error);
    }
  }
}

export const weatherService = new WeatherService();
