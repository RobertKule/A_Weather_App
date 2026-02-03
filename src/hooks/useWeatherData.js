import { useState, useEffect, useCallback } from 'react'
import weatherService from '../services/weatherAPI'
import { DEFAULT_CITY } from '../utils/constants/weather.constants'

export const useWeatherData = (initialCity = DEFAULT_CITY.name) => {
  const [weatherData, setWeatherData] = useState(null)
  const [forecastData, setForecastData] = useState([])
  const [hourlyForecast, setHourlyForecast] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [unit, setUnit] = useState('metric')
  const [city, setCity] = useState(initialCity)

  // Charger les données météo
  const fetchWeatherData = useCallback(async (cityName = city, weatherUnit = unit) => {
    setLoading(true)
    setError(null)

    try {
      // Récupérer la météo actuelle
      const weatherResult = await weatherService.getCurrentWeather(cityName, weatherUnit)
      
      if (!weatherResult.success) {
        throw new Error(weatherResult.error || 'Erreur inconnue')
      }

      setWeatherData(weatherResult.data)
      setCity(cityName)

      // Récupérer les prévisions
      const forecastResult = await weatherService.getForecast(cityName, weatherUnit)
      
      if (forecastResult.success) {
        setForecastData(forecastResult.data)
        setHourlyForecast(forecastResult.hourly)
      }

    } catch (err) {
      setError(err.message)
      console.error('Erreur dans fetchWeatherData:', err)
    } finally {
      setLoading(false)
    }
  }, [city, unit])

  // Charger les données au démarrage
  useEffect(() => {
    fetchWeatherData()
  }, [])

  // Rechercher une ville
  const searchCity = async (cityName) => {
    if (!cityName.trim()) return
    
    await fetchWeatherData(cityName)
  }

  // Utiliser la géolocalisation
  const useGeolocation = async () => {
    if (!navigator.geolocation) {
      setError('La géolocalisation n\'est pas supportée par votre navigateur')
      return
    }

    setLoading(true)
    
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            const result = await weatherService.getWeatherByCoords(latitude, longitude, unit)
            
            if (result.success) {
              setWeatherData(result.data)
              setCity(result.data.city)
              
              // Récupérer les prévisions pour cette position
              const forecastResult = await weatherService.getForecast(result.data.city, unit)
              if (forecastResult.success) {
                setForecastData(forecastResult.data)
                setHourlyForecast(forecastResult.hourly)
              }
              
              resolve(result.data)
            } else {
              throw new Error(result.error)
            }
          } catch (err) {
            setError(err.message)
            reject(err)
          } finally {
            setLoading(false)
          }
        },
        (error) => {
          const errorMessage = getGeolocationError(error.code)
          setError(errorMessage)
          setLoading(false)
          reject(new Error(errorMessage))
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    })
  }

  // Changer les unités
  const changeUnit = async (newUnit) => {
    if (newUnit === unit || !weatherData) return
    
    setUnit(newUnit)
    
    // Convertir les données existantes
    const convertedData = weatherService.convertUnits(weatherData, newUnit)
    setWeatherData(convertedData)
    
    // Rafraîchir les prévisions avec les nouvelles unités
    await fetchWeatherData(city, newUnit)
  }

  // Rafraîchir les données
  const refreshData = async () => {
    await fetchWeatherData()
  }

  // Gestion des erreurs de géolocalisation
  const getGeolocationError = (code) => {
    switch (code) {
      case 1:
        return 'Permission refusée. Veuillez autoriser la géolocalisation.'
      case 2:
        return 'Position indisponible. Vérifiez votre connexion GPS.'
      case 3:
        return 'Délai d\'attente dépassé.'
      default:
        return 'Erreur de géolocalisation inconnue.'
    }
  }

  return {
    // Données
    weatherData,
    forecastData,
    hourlyForecast,
    loading,
    error,
    unit,
    city,
    
    // Actions
    searchCity,
    useGeolocation,
    changeUnit,
    refreshData,
    setError
  }
}