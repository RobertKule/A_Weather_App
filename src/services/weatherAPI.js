import axios from 'axios'

// Configuration de l'API
const API_BASE_URL = import.meta.env.VITE_WEATHER_API_URL || 'https://api.openweathermap.org/data/2.5'
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

// Créer une instance axios avec configuration de base
const weatherAPI = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  params: {
    appid: API_KEY,
    lang: 'fr',
  }
})

// Fonctions utilitaires
const formatWeatherData = (data, unit = 'metric') => {
  if (!data) return null

  return {
    city: data.name,
    country: data.sys?.country || '',
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    condition: data.weather[0]?.description || '',
    conditionId: data.weather[0]?.id || 800,
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
    windDirection: getWindDirection(data.wind.deg),
    pressure: data.main.pressure,
    sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    visibility: (data.visibility / 1000).toFixed(1), // meters to km
    cloudiness: data.clouds?.all || 0,
    unit: unit,
    timestamp: new Date().toISOString()
  }
}

const formatForecastData = (data) => {
  if (!data || !data.list) return []

  // Grouper par jour
  const dailyForecasts = {}
  
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    })
    
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = {
        date: date,
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        conditions: [],
        humidity: item.main.humidity,
        windSpeed: item.wind.speed * 3.6, // m/s to km/h
        icon: item.weather[0]?.icon,
        description: item.weather[0]?.description
      }
    } else {
      // Mettre à jour les températures min/max
      dailyForecasts[date].temp_min = Math.min(dailyForecasts[date].temp_min, item.main.temp_min)
      dailyForecasts[date].temp_max = Math.max(dailyForecasts[date].temp_max, item.main.temp_max)
    }
  })

  // Convertir en array et formater
  return Object.values(dailyForecasts).slice(0, 7).map(day => ({
    date: day.date,
    temp_min: Math.round(day.temp_min),
    temp_max: Math.round(day.temp_max),
    condition: day.description,
    icon: day.icon,
    humidity: day.humidity,
    windSpeed: Math.round(day.windSpeed)
  }))
}

const formatHourlyForecast = (data) => {
  if (!data || !data.list) return []

  return data.list.slice(0, 8).map(item => ({
    time: new Date(item.dt * 1000).toLocaleTimeString('fr-FR', {
      hour: '2-digit'
    }),
    temperature: Math.round(item.main.temp),
    condition: item.weather[0]?.description,
    conditionId: item.weather[0]?.id,
    humidity: item.main.humidity,
    precipitation: item.pop ? Math.round(item.pop * 100) : 0, // Probabilité de précipitation en %
    icon: item.weather[0]?.icon
  }))
}

const getWindDirection = (degrees) => {
  if (degrees >= 337.5 || degrees < 22.5) return 'N'
  if (degrees >= 22.5 && degrees < 67.5) return 'NE'
  if (degrees >= 67.5 && degrees < 112.5) return 'E'
  if (degrees >= 112.5 && degrees < 157.5) return 'SE'
  if (degrees >= 157.5 && degrees < 202.5) return 'S'
  if (degrees >= 202.5 && degrees < 247.5) return 'SO'
  if (degrees >= 247.5 && degrees < 292.5) return 'O'
  if (degrees >= 292.5 && degrees < 337.5) return 'NO'
  return ''
}

// Services principaux
export const weatherService = {
  
  // Récupérer la météo actuelle par nom de ville
  async getCurrentWeather(city, unit = 'metric') {
    try {
      const response = await weatherAPI.get('/weather', {
        params: {
          q: city,
          units: unit
        }
      })
      
      return {
        success: true,
        data: formatWeatherData(response.data, unit),
        raw: response.data
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la météo:', error)
      return {
        success: false,
        error: this.handleAPIError(error),
        data: null
      }
    }
  },

  // Récupérer la météo actuelle par coordonnées
  async getWeatherByCoords(lat, lon, unit = 'metric') {
    try {
      const response = await weatherAPI.get('/weather', {
        params: {
          lat,
          lon,
          units: unit
        }
      })
      
      return {
        success: true,
        data: formatWeatherData(response.data, unit),
        raw: response.data
      }
    } catch (error) {
      console.error('Erreur lors de la récupération par coordonnées:', error)
      return {
        success: false,
        error: this.handleAPIError(error),
        data: null
      }
    }
  },

  // Récupérer les prévisions sur 5 jours
  async getForecast(city, unit = 'metric') {
    try {
      const response = await weatherAPI.get('/forecast', {
        params: {
          q: city,
          units: unit,
          cnt: 40 // Nombre d'éléments (5 jours * 8 par jour)
        }
      })
      
      return {
        success: true,
        data: formatForecastData(response.data),
        hourly: formatHourlyForecast(response.data),
        raw: response.data
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des prévisions:', error)
      return {
        success: false,
        error: this.handleAPIError(error),
        data: null
      }
    }
  },

  // Rechercher des villes (geocoding)
  async searchCities(query, limit = 5) {
    try {
      const response = await axios.get('https://api.openweathermap.org/geo/1.0/direct', {
        params: {
          q: query,
          limit,
          appid: API_KEY
        }
      })
      
      return {
        success: true,
        data: response.data.map(city => ({
          name: city.name,
          country: city.country,
          state: city.state,
          lat: city.lat,
          lon: city.lon,
          label: `${city.name}, ${city.country}${city.state ? `, ${city.state}` : ''}`
        }))
      }
    } catch (error) {
      console.error('Erreur lors de la recherche de villes:', error)
      return {
        success: false,
        error: this.handleAPIError(error),
        data: []
      }
    }
  },

  // Gestion des erreurs API
  handleAPIError(error) {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          return 'Clé API invalide. Veuillez vérifier votre configuration.'
        case 404:
          return 'Ville non trouvée. Vérifiez le nom de la ville.'
        case 429:
          return 'Trop de requêtes. Veuillez patienter quelques instants.'
        case 500:
        case 502:
        case 503:
        case 504:
          return 'Service temporairement indisponible. Veuillez réessayer plus tard.'
        default:
          return `Erreur serveur: ${error.response.status}`
      }
    } else if (error.request) {
      return 'Impossible de joindre le serveur. Vérifiez votre connexion internet.'
    } else {
      return 'Une erreur inattendue est survenue.'
    }
  },

  // Convertir les unités
  convertUnits(data, toUnit) {
    if (!data || data.unit === toUnit) return data
    
    const converted = { ...data }
    
    if (toUnit === 'imperial') {
      // Celsius to Fahrenheit
      converted.temperature = Math.round((data.temperature * 9/5) + 32)
      converted.feelsLike = Math.round((data.feelsLike * 9/5) + 32)
      // km/h to mph
      converted.windSpeed = Math.round(data.windSpeed * 0.621371)
      converted.unit = 'imperial'
    } else {
      // Fahrenheit to Celsius
      converted.temperature = Math.round((data.temperature - 32) * 5/9)
      converted.feelsLike = Math.round((data.feelsLike - 32) * 5/9)
      // mph to km/h
      converted.windSpeed = Math.round(data.windSpeed / 0.621371)
      converted.unit = 'metric'
    }
    
    return converted
  }
}

export default weatherService