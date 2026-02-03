import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import weatherService from '../services/weatherAPI'

const WeatherContext = createContext()

const initialState = {
  weatherData: null,
  forecastData: [],
  hourlyForecast: [],
  loading: true,
  error: null,
  unit: 'metric',
  city: 'Goma',
  favorites: ['Goma', 'Kinshasa', 'Kigali', 'Paris', 'Lyon'],
  isDarkMode: false,
}

const weatherReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    
    case 'SET_WEATHER_DATA':
      return { 
        ...state, 
        weatherData: action.payload.data,
        city: action.payload.data?.city || state.city,
        loading: false,
        error: null 
      }
    
    case 'SET_FORECAST_DATA':
      return { 
        ...state, 
        forecastData: action.payload.daily || [],
        hourlyForecast: action.payload.hourly || [],
        loading: false 
      }
    
    case 'SET_UNIT':
      return { ...state, unit: action.payload }
    
    case 'ADD_FAVORITE':
      if (state.favorites.includes(action.payload)) return state
      return { ...state, favorites: [...state.favorites, action.payload] }
    
    case 'REMOVE_FAVORITE':
      return { 
        ...state, 
        favorites: state.favorites.filter(city => city !== action.payload) 
      }
    
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    
    case 'SET_DARK_MODE':
      return { ...state, isDarkMode: action.payload }
    
    default:
      return state
  }
}

export const WeatherProvider = ({ children }) => {
  const [state, dispatch] = useReducer(weatherReducer, initialState)

  // Initialiser le thème au chargement
  useEffect(() => {
    const savedTheme = localStorage.getItem('rk-weather-theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const initialDarkMode = savedTheme ? savedTheme === 'dark' : prefersDark
    
    if (initialDarkMode) {
      document.documentElement.classList.add('dark')
      dispatch({ type: 'SET_DARK_MODE', payload: true })
    }
  }, [])

  // Charger les données initiales
  useEffect(() => {
    fetchWeatherData()
  }, [])

  const fetchWeatherData = useCallback(async (cityName = state.city, weatherUnit = state.unit) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    try {
      // Récupérer la météo actuelle
      const weatherResult = await weatherService.getCurrentWeather(cityName, weatherUnit)
      
      if (!weatherResult.success) {
        throw new Error(weatherResult.error || 'Erreur inconnue')
      }

      dispatch({ 
        type: 'SET_WEATHER_DATA', 
        payload: { data: weatherResult.data } 
      })

      // Récupérer les prévisions
      const forecastResult = await weatherService.getForecast(cityName, weatherUnit)
      
      if (forecastResult.success) {
        dispatch({
          type: 'SET_FORECAST_DATA',
          payload: {
            daily: forecastResult.data || [],
            hourly: forecastResult.hourly || []
          }
        })
      }

    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.message })
    }
  }, [state.city, state.unit])

  const searchCity = async (cityName) => {
    if (!cityName.trim()) return
    await fetchWeatherData(cityName)
  }

  const useGeolocation = async () => {
    if (!navigator.geolocation) {
      dispatch({ type: 'SET_ERROR', payload: 'Géolocalisation non supportée par votre navigateur' })
      return
    }

    dispatch({ type: 'SET_LOADING', payload: true })

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords
            const result = await weatherService.getWeatherByCoords(latitude, longitude, state.unit)
            
            if (result.success) {
              dispatch({ 
                type: 'SET_WEATHER_DATA', 
                payload: { data: result.data } 
              })
              
              const forecastResult = await weatherService.getForecast(result.data.city, state.unit)
              if (forecastResult.success) {
                dispatch({
                  type: 'SET_FORECAST_DATA',
                  payload: {
                    daily: forecastResult.data || [],
                    hourly: forecastResult.hourly || []
                  }
                })
              }
              
              resolve(result.data)
            } else {
              throw new Error(result.error)
            }
          } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err.message })
            reject(err)
          }
        },
        (error) => {
          const errorMessage = getGeolocationError(error.code)
          dispatch({ type: 'SET_ERROR', payload: errorMessage })
          reject(new Error(errorMessage))
        }
      )
    })
  }

  const changeUnit = async (newUnit) => {
    if (newUnit === state.unit || !state.weatherData) return
    
    dispatch({ type: 'SET_UNIT', payload: newUnit })
    
    // Convertir les données existantes
    const convertedData = weatherService.convertUnits(state.weatherData, newUnit)
    if (convertedData) {
      dispatch({ 
        type: 'SET_WEATHER_DATA', 
        payload: { data: convertedData } 
      })
    }
    
    // Rafraîchir les prévisions
    await fetchWeatherData(state.city, newUnit)
  }

  const addFavorite = (city) => {
    dispatch({ type: 'ADD_FAVORITE', payload: city })
  }

  const removeFavorite = (city) => {
    dispatch({ type: 'REMOVE_FAVORITE', payload: city })
  }

  const refreshData = async () => {
    await fetchWeatherData()
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const toggleDarkMode = () => {
    const newDarkMode = !state.isDarkMode
    dispatch({ type: 'SET_DARK_MODE', payload: newDarkMode })
    
    // Appliquer à l'HTML
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('rk-weather-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('rk-weather-theme', 'light')
    }
  }

  const getGeolocationError = (code) => {
    switch (code) {
      case 1: return 'Permission de géolocalisation refusée'
      case 2: return 'Position indisponible'
      case 3: return 'Délai dépassé'
      default: return 'Erreur de géolocalisation'
    }
  }

  const value = {
    ...state,
    searchCity,
    useGeolocation,
    changeUnit,
    addFavorite,
    removeFavorite,
    refreshData,
    clearError,
    toggleDarkMode,
  }

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  )
}

export const useWeather = () => {
  const context = useContext(WeatherContext)
  if (!context) {
    throw new Error('useWeather doit être utilisé dans un WeatherProvider')
  }
  return context
}