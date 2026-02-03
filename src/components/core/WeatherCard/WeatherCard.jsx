import React from 'react';
import { motion } from 'framer-motion';
import Card, { CardHeader, CardBody, CardFooter } from '../../ui/Card/Card';
import { WeatherIcon } from '../../ui/Icon';
import Button from '../../ui/Button/Button';
import {
  WiHumidity,
  WiStrongWind,
  WiBarometer,
  WiDaySunny,
} from 'react-icons/wi';

/**
 * Variantes d'animation pour l'entrée en scène
 */
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      when: 'beforeChildren',
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const WeatherCard = ({
  weatherData,
  loading = false,
  onRefresh,
  unit = 'metric',
  onUnitChange,
  className = '',
}) => {
  // 1. ÉTAT DE CHARGEMENT
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
        aria-busy="true"
        aria-label="Chargement des données météo"
      >
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
      </motion.div>
    );
  }

  // 2. ÉTAT VIDE
  if (!weatherData) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <Card className={`text-center ${className}`}>
          <div className="text-6xl mb-4" role="presentation">
            🌤️
          </div>
          <h3 className="text-xl font-semibold mb-2">Aucune donnée météo</h3>
          <Button variant="primary">Rechercher une ville</Button>
        </Card>
      </motion.div>
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
  } = weatherData;

  const tempUnit = unit === 'metric' ? '°C' : '°F';
  const windUnit = unit === 'metric' ? 'km/h' : 'mph';

  return (
    <motion.article
      key={`${city}-${temperature}-${unit}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-labelledby="weather-card-title"
      className={`max-w-2xl mx-auto ${className}`}
    >
      <Card className="shadow-lg">
        {/* HEADER */}
        <CardHeader>
          <motion.div
            variants={itemVariants}
            className="flex justify-between items-start"
          >
            <div>
              <h1
                id="weather-card-title"
                className="text-2xl font-bold text-gray-900 dark:text-white"
              >
                Météo à {city}, {country}
              </h1>
              <div className="sr-only">
                Données mises à jour à {new Date().toLocaleTimeString()}
              </div>
              <p
                aria-hidden="true"
                className="text-gray-600 dark:text-gray-400"
              >
                Mise à jour à{' '}
                {new Date().toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            {onRefresh && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={onRefresh}
                  className="flex items-center gap-2"
                  aria-label={`Actualiser la météo de ${city}`}
                >
                  <motion.span
                    animate={loading ? { rotate: 360 } : { rotate: 0 }}
                    transition={{
                      repeat: loading ? Infinity : 0,
                      duration: 1,
                      ease: 'linear',
                    }}
                    aria-hidden="true"
                    className="text-lg"
                  >
                    ↻
                  </motion.span>
                  <span className="sr-only md:not-sr-only">Actualiser</span>
                </Button>
              </motion.div>
            )}
          </motion.div>
        </CardHeader>

        {/* BODY */}
        <CardBody>
          <div
            className="flex flex-col md:flex-row items-center md:items-start gap-8"
            aria-live="polite"
            aria-atomic="true"
          >
            {/* Section Température */}
            <motion.div
              variants={itemVariants}
              className="flex-1 text-center md:text-left"
            >
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                <motion.div
                  role="img"
                  aria-label={`Icône représentant : ${condition}`}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <WeatherIcon
                    conditionCode={conditionId}
                    size={80}
                    className="text-weather-primary"
                  />
                </motion.div>

                <div>
                  <motion.div
                    key={`${temperature}-${unit}`}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-6xl font-bold text-gray-900 dark:text-white"
                    aria-label={`Température actuelle : ${Math.round(temperature)} ${tempUnit}`}
                  >
                    {Math.round(temperature)}
                    {tempUnit}
                  </motion.div>
                  <p
                    className="text-gray-600 dark:text-gray-400"
                    aria-label={`Ressenti : ${Math.round(feelsLike)} ${tempUnit}`}
                  >
                    Ressenti {Math.round(feelsLike)}
                    {tempUnit}
                  </p>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {condition}
              </h2>
            </motion.div>

            {/* Grille de détails */}
            <div
              className="flex-1 w-full"
              role="region"
              aria-label="Détails météorologiques"
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    icon: <WiHumidity className="text-2xl text-blue-500" />,
                    label: 'Humidité',
                    value: `${humidity}%`,
                  },
                  {
                    icon: <WiStrongWind className="text-2xl text-green-500" />,
                    label: 'Vent',
                    value: `${Math.round(windSpeed)} ${windUnit} ${windDirection || ''}`,
                  },
                  {
                    icon: <WiBarometer className="text-2xl text-purple-500" />,
                    label: 'Pression',
                    value: `${pressure} hPa`,
                  },
                  {
                    icon: <WiDaySunny className="text-2xl text-yellow-500" />,
                    label: 'Index UV',
                    value: uvIndex || 'N/A',
                    level: getUVLevel(uvIndex),
                  },
                ].map((detail, index) => (
                  <motion.div
                    key={detail.label}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                  >
                    <WeatherDetail {...detail} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </CardBody>

        {/* FOOTER avec sélecteur d'unités */}
        <CardFooter>
          <motion.div
            variants={itemVariants}
            className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400"
          >
            <span>Données : OpenWeatherMap</span>
            <div
              className="flex items-center gap-2"
              role="group"
              aria-label="Choix de l'unité"
            >
              <Button
                variant={unit === 'metric' ? 'primary' : 'ghost'}
                size="small"
                className="text-xs"
                onClick={() => onUnitChange?.('metric')}
                aria-pressed={unit === 'metric'}
                aria-label="Utiliser les degrés Celsius"
              >
                °C
              </Button>
              <span className="text-gray-400" aria-hidden="true">
                |
              </span>
              <Button
                variant={unit === 'imperial' ? 'primary' : 'ghost'}
                size="small"
                className="text-xs"
                onClick={() => onUnitChange?.('imperial')}
                aria-pressed={unit === 'imperial'}
                aria-label="Utiliser les degrés Fahrenheit"
              >
                °F
              </Button>
            </div>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.article>
  );
};

const WeatherDetail = ({ icon, label, value, level }) => {
  const getLevelColor = (lvl) => {
    const colors = {
      low: 'text-green-600',
      moderate: 'text-yellow-600',
      high: 'text-orange-600',
      'very-high': 'text-red-600',
      extreme: 'text-purple-600',
    };
    return colors[lvl] || 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div
      tabIndex={0}
      role="group"
      aria-label={`${label} : ${value}`}
      className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
    >
      <div
        className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm"
        aria-hidden="true"
      >
        {icon}
      </div>
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
        <div className={`font-semibold ${getLevelColor(level)}`}>{value}</div>
      </div>
    </div>
  );
};

const getUVLevel = (uv) => {
  if (!uv) return '';
  if (uv <= 2) return 'low';
  if (uv <= 5) return 'moderate';
  if (uv <= 7) return 'high';
  if (uv <= 10) return 'very-high';
  return 'extreme';
};

export default WeatherCard;