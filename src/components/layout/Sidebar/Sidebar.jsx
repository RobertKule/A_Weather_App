import React from 'react'
import { motion } from 'framer-motion'
import { 
  FiClock, 
  FiCalendar, 
  FiMapPin, 
  FiStar,
  FiTrendingUp,
  FiDroplet,
  FiWind,
  FiSun
} from 'react-icons/fi'
import { WiThermometer, WiBarometer } from 'react-icons/wi'
import Card from '../../ui/Card/Card'
import Button from '../../ui/Button/Button'

const Sidebar = ({ 
  hourlyForecast = [],
  dailyForecast = [],
  nearbyCities = [],
  favorites = [],
  weatherData,
  onCitySelect,
  onToggleFavorite,
  className = ''
}) => {
  return (
    <aside className={`space-y-6 ${className}`}>
      {/* Prévisions horaires */}
      {hourlyForecast.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <HourlyForecast 
            forecast={hourlyForecast} 
            unit={weatherData?.unit || 'metric'}
          />
        </motion.div>
      )}

      {/* Prévisions quotidiennes (version compacte) */}
      {dailyForecast.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DailyForecast 
            forecast={dailyForecast} 
            unit={weatherData?.unit || 'metric'}
          />
        </motion.div>
      )}

      {/* Indices météo */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <WeatherIndices weatherData={weatherData} />
      </motion.div>

      {/* Villes favorites */}
      {favorites.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <FavoriteCities 
            cities={favorites}
            onCitySelect={onCitySelect}
            onToggleFavorite={onToggleFavorite}
          />
        </motion.div>
      )}

      {/* Villes à proximité */}
      {nearbyCities.length > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <NearbyCities 
            cities={nearbyCities}
            onCitySelect={onCitySelect}
          />
        </motion.div>
      )}
    </aside>
  )
}

// Composant Prévisions horaires
const HourlyForecast = ({ forecast, unit }) => {
  const tempUnit = unit === 'metric' ? '°C' : '°F'

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <FiClock className="text-blue-500" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Prévisions horaires
        </h2>
      </div>
      
      <div className="space-y-3">
        {forecast.slice(0, 6).map((hour, index) => (
          <div 
            key={index} 
            className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium min-w-[40px]">
                {hour.time}
              </span>
              <div className="text-xl" role="img" aria-label={hour.condition}>
                {getWeatherIcon(hour.conditionId)}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold text-gray-900 dark:text-white">
                {hour.temperature}{tempUnit}
              </span>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <FiDroplet size={12} />
                <span>{hour.humidity}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// Composant Prévisions quotidiennes
const DailyForecast = ({ forecast, unit }) => {
  const tempUnit = unit === 'metric' ? '°C' : '°F'

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <FiCalendar className="text-purple-500" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Cette semaine
        </h2>
      </div>
      
      <div className="space-y-2">
        {forecast.slice(0, 7).map((day, index) => (
          <div 
            key={index} 
            className="flex justify-between items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-gray-600 dark:text-gray-400 text-sm font-medium min-w-[60px]">
                {formatDay(day.date)}
              </span>
              <div className="text-xl" role="img" aria-label={day.condition}>
                {getWeatherIconFromCondition(day.condition)}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <FiTrendingUp className="text-red-400" size={14} />
                <span className="font-bold text-gray-900 dark:text-white">
                  {day.temp_max}{tempUnit}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <FiTrendingUp className="text-blue-400 rotate-180" size={14} />
                <span className="text-gray-500 text-sm">
                  {day.temp_min}{tempUnit}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// Composant Indices météo
const WeatherIndices = ({ weatherData }) => {
  if (!weatherData) return null

  const indices = [
    {
      icon: <FiSun className="text-yellow-500" />,
      label: 'Index UV',
      value: weatherData.uvIndex || 'N/A',
      level: getUVLevel(weatherData.uvIndex),
      description: getUVDescription(weatherData.uvIndex)
    },
    {
      icon: <FiDroplet className="text-blue-500" />,
      label: 'Humidité',
      value: `${weatherData.humidity}%`,
      level: getHumidityLevel(weatherData.humidity),
      description: getHumidityDescription(weatherData.humidity)
    },
    {
      icon: <FiWind className="text-green-500" />,
      label: 'Vent',
      value: `${Math.round(weatherData.windSpeed)} km/h`,
      level: getWindLevel(weatherData.windSpeed),
      description: weatherData.windDirection || ''
    },
    {
      icon: <WiBarometer className="text-purple-500" />,
      label: 'Pression',
      value: `${weatherData.pressure} hPa`,
      level: getPressureLevel(weatherData.pressure),
      description: getPressureDescription(weatherData.pressure)
    }
  ]

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white">
        Indices météo
      </h2>
      
      <div className="grid grid-cols-2 gap-3">
        {indices.map((index, idx) => (
          <div 
            key={idx} 
            className="flex flex-col items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
          >
            <div className="mb-2">{index.icon}</div>
            <div className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                {index.label}
              </div>
              <div className={`font-bold text-lg ${getLevelColor(index.level)}`}>
                {index.value}
              </div>
              {index.description && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {index.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// Composant Villes favorites
const FavoriteCities = ({ cities, onCitySelect, onToggleFavorite }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiStar className="text-yellow-500" />
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Favoris
          </h2>
        </div>
        <span className="text-xs text-gray-500">
          {cities.length} villes
        </span>
      </div>
      
      <div className="space-y-2">
        {cities.map((city, index) => (
          <div
            key={index}
            className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
          >
            <button
              onClick={() => onCitySelect?.(city)}
              className="flex-1 flex items-center gap-3 text-left"
            >
              <FiMapPin className="text-gray-400 group-hover:text-blue-500 transition-colors" />
              <span className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {city}
              </span>
            </button>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 dark:text-white">
                {index % 3 === 0 ? '22°' : index % 3 === 1 ? '19°' : '24°'}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleFavorite?.(city)
                }}
                className="p-1 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded"
                aria-label={`Retirer ${city} des favoris`}
              >
                <FiStar className="text-yellow-500" size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

// Composant Villes à proximité
const NearbyCities = ({ cities, onCitySelect }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <FiMapPin className="text-green-500" />
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          À proximité
        </h2>
      </div>
      
      <div className="space-y-2">
        {cities.map((city, index) => (
          <button
            key={index}
            onClick={() => onCitySelect?.(city.name)}
            className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className="text-xl">
                {getWeatherIconForCity(index)}
              </div>
              <div className="text-left">
                <div className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {city.name}
                </div>
                <div className="text-xs text-gray-500">
                  {city.distance || `${Math.floor(Math.random() * 20) + 5}km`}
                </div>
              </div>
            </div>
            <span className="font-bold text-gray-900 dark:text-white">
              {city.temp || (index % 3 === 0 ? '23°' : index % 3 === 1 ? '21°' : '20°')}
            </span>
          </button>
        ))}
      </div>
    </Card>
  )
}

// Fonctions utilitaires
const getWeatherIcon = (conditionId) => {
  if (conditionId >= 200 && conditionId < 300) return '⛈️'
  if (conditionId >= 300 && conditionId < 600) return '🌧️'
  if (conditionId >= 600 && conditionId < 700) return '❄️'
  if (conditionId >= 700 && conditionId < 800) return '🌫️'
  if (conditionId === 800) return '☀️'
  if (conditionId > 800) return '☁️'
  return '☀️'
}

const getWeatherIconFromCondition = (condition) => {
  if (!condition) return '☀️'
  const cond = condition.toLowerCase()
  if (cond.includes('soleil') || cond.includes('clear')) return '☀️'
  if (cond.includes('nuage') || cond.includes('cloud')) return '☁️'
  if (cond.includes('pluie') || cond.includes('rain')) return '🌧️'
  if (cond.includes('orage') || cond.includes('storm')) return '⛈️'
  if (cond.includes('neige') || cond.includes('snow')) return '❄️'
  return '☀️'
}

const getWeatherIconForCity = (index) => {
  const icons = ['☀️', '⛅', '☁️', '🌧️', '🌤️']
  return icons[index % icons.length]
}

const formatDay = (dateString) => {
  if (!dateString) return ''
  const parts = dateString.split(' ')
  return parts[0] // Retourne juste le jour (Lun, Mar, etc.)
}

const getUVLevel = (uv) => {
  if (!uv) return 'low'
  if (uv <= 2) return 'low'
  if (uv <= 5) return 'moderate'
  if (uv <= 7) return 'high'
  if (uv <= 10) return 'very-high'
  return 'extreme'
}

const getUVDescription = (uv) => {
  const level = getUVLevel(uv)
  switch (level) {
    case 'low': return 'Faible'
    case 'moderate': return 'Modéré'
    case 'high': return 'Élevé'
    case 'very-high': return 'Très élevé'
    case 'extreme': return 'Extrême'
    default: return ''
  }
}

const getHumidityLevel = (humidity) => {
  if (humidity < 30) return 'low'
  if (humidity < 60) return 'normal'
  if (humidity < 80) return 'high'
  return 'very-high'
}

const getHumidityDescription = (humidity) => {
  const level = getHumidityLevel(humidity)
  switch (level) {
    case 'low': return 'Sec'
    case 'normal': return 'Confortable'
    case 'high': return 'Humide'
    case 'very-high': return 'Très humide'
    default: return ''
  }
}

const getWindLevel = (speed) => {
  if (speed < 5) return 'calm'
  if (speed < 20) return 'moderate'
  if (speed < 40) return 'strong'
  return 'very-strong'
}

const getPressureLevel = (pressure) => {
  if (pressure < 1000) return 'low'
  if (pressure < 1013) return 'normal-low'
  if (pressure < 1020) return 'normal'
  return 'high'
}

const getPressureDescription = (pressure) => {
  const level = getPressureLevel(pressure)
  switch (level) {
    case 'low': return 'Basse'
    case 'normal-low': return 'Normale basse'
    case 'normal': return 'Normale'
    case 'high': return 'Haute'
    default: return ''
  }
}

const getLevelColor = (level) => {
  const colors = {
    low: 'text-green-600',
    moderate: 'text-yellow-600',
    high: 'text-orange-600',
    'very-high': 'text-red-600',
    extreme: 'text-purple-600',
    calm: 'text-green-600',
    normal: 'text-blue-600',
    strong: 'text-orange-600',
    'very-strong': 'text-red-600',
    'normal-low': 'text-blue-600',
    'normal-high': 'text-blue-600'
  }
  return colors[level] || 'text-gray-600 dark:text-gray-400'
}

export default Sidebar