import React from 'react';
import Card, { CardHeader, CardBody, CardFooter } from '../../ui/Card/Card';
import { WeatherIcon } from '../../ui/Icon';
import Button from '../../ui/Button/Button';
import {
  WiThermometer,
  WiHumidity,
  WiStrongWind,
  WiBarometer,
  WiDaySunny,
} from 'react-icons/wi';

const WeatherCard = ({
  weatherData,
  loading = false,
  onRefresh,
  className = '',
}) => {
  if (loading) {
    return (
      <Card className={`animate-pulse ${className}`}>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="h-16 bg-gray-200 dark:bg-gray-700 rounded"
            ></div>
          ))}
        </div>
      </Card>
    );
  }

  if (!weatherData) {
    return (
      <Card className={`text-center ${className}`}>
        <div className="text-6xl mb-4">🌤️</div>
        <h3 className="text-xl font-semibold mb-2">Aucune donnée météo</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Recherchez une ville pour voir la météo
        </p>
        <Button variant="primary">Rechercher une ville</Button>
      </Card>
    );
  }

  const {
    city,
    country,
    temperature,
    feelsLike,
    condition,
    conditionId,
    humidity,
    windSpeed,
    windDirection,
    pressure,
    uvIndex,
    unit = 'metric',
  } = weatherData;

  const tempUnit = unit === 'metric' ? '°C' : '°F';
  const windUnit = unit === 'metric' ? 'km/h' : 'mph';

  return (
    <Card className={`max-w-2xl mx-auto ${className}`}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {city}, {country}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Mise à jour à{' '}
              {new Date().toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          {onRefresh && (
            <Button
              variant="ghost"
              size="small"
              onClick={onRefresh}
              className="flex items-center gap-2"
            >
              <span className="text-lg">↻</span>
              Actualiser
            </Button>
          )}
        </div>
      </CardHeader>

      <CardBody>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {/* Section principale température */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
              <WeatherIcon
                conditionCode={conditionId}
                size={80}
                className="text-weather-primary"
              />
              <div>
                <div className="text-6xl font-bold text-gray-900 dark:text-white">
                  {Math.round(temperature)}°C
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Ressenti {Math.round(feelsLike)}°C
                </p>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {condition}
            </h2>
          </div>

          {/* Section détails */}
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              <WeatherDetail
                icon={<WiHumidity className="text-2xl text-blue-500" />}
                label="Humidité"
                value={`${humidity}%`}
              />
              <WeatherDetail
                icon={<WiStrongWind className="text-2xl text-green-500" />}
                label="Vent"
                value={`${windSpeed} ${windUnit} ${windDirection}`}
              />
              <WeatherDetail
                icon={<WiBarometer className="text-2xl text-purple-500" />}
                label="Pression"
                value={`${pressure} hPa`}
              />
              <WeatherDetail
                icon={<WiDaySunny className="text-2xl text-yellow-500" />}
                label="Index UV"
                value={uvIndex}
                level={getUVLevel(uvIndex)}
              />
            </div>
          </div>
        </div>
      </CardBody>

      <CardFooter>
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
          <span>Données fournies par OpenWeatherMap</span>
          <div className="flex items-center gap-2">
            <span className="text-xs">Unité :</span>
            <Button variant="ghost" size="small" className="text-xs">
              °C
            </Button>
            <span className="text-gray-400">|</span>
            <Button variant="ghost" size="small" className="text-xs">
              °F
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

// Composant pour les détails météo
const WeatherDetail = ({ icon, label, value, level }) => {
  const getLevelColor = level => {
    switch (level) {
      case 'low':
        return 'text-green-600';
      case 'moderate':
        return 'text-yellow-600';
      case 'high':
        return 'text-orange-600';
      case 'very-high':
        return 'text-red-600';
      case 'extreme':
        return 'text-purple-600';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
      <div className="p-2 bg-white dark:bg-gray-700 rounded-lg">{icon}</div>
      <div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
        <div className={`font-semibold ${getLevelColor(level)}`}>{value}</div>
      </div>
    </div>
  );
};

// Fonction pour déterminer le niveau UV
const getUVLevel = uvIndex => {
  if (uvIndex <= 2) return 'low';
  if (uvIndex <= 5) return 'moderate';
  if (uvIndex <= 7) return 'high';
  if (uvIndex <= 10) return 'very-high';
  return 'extreme';
};

export default WeatherCard;
