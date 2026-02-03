import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
 * Variantes pour l'entrée en scène (stagger effect)
 * Permet aux enfants d'apparaître les uns après les autres
 */
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

const WeatherCard = ({
  weatherData,
  loading = false,
  onRefresh,
  className = '',
}) => {

  // 1. ÉTAT DE CHARGEMENT (SKELETON ANIMÉ)
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
      >
        <Card className={`animate-pulse ${className}`}>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </Card>
      </motion.div>
    );
  }

  // 2. ÉTAT VIDE (AUCUNE DONNÉE)
  if (!weatherData) {
    return (
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <Card className={`text-center ${className}`}>
          <div className="text-6xl mb-4">🌤️</div>
          <h3 className="text-xl font-semibold mb-2">Aucune donnée météo</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Recherchez une ville pour voir la météo
          </p>
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
    unit = 'metric',
  } = weatherData;

  const tempUnit = unit === 'metric' ? '°C' : '°F';
  const windUnit = unit === 'metric' ? 'km/h' : 'mph';

  return (
    <motion.div
      key={`${city}-${temperature}`} // Re-déclenche l'animation si la ville ou temp change
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className={`max-w-2xl mx-auto shadow-lg ${className}`}>
        
        {/* HEADER : Ville et bouton actualiser */}
        <CardHeader>
          <motion.div variants={itemVariants} className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {city}, {country}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Mise à jour à {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {onRefresh && (
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="small" onClick={onRefresh} className="flex items-center gap-2">
                  <motion.span 
                    animate={loading ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="text-lg"
                  >
                    ↻
                  </motion.span>
                  Actualiser
                </Button>
              </motion.div>
            )}
          </motion.div>
        </CardHeader>

        {/* BODY : Température et détails */}
        <CardBody>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            
            {/* Section Gauche : Icône et Température principale */}
            <motion.div variants={itemVariants} className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
                <motion.div
                  animate={{ 
                    y: [0, -10, 0], // Petit flottement de l'icône
                    rotate: conditionId === 800 ? [0, 10, -10, 0] : 0 
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <WeatherIcon conditionCode={conditionId} size={80} className="text-weather-primary" />
                </motion.div>
                
                <div>
                  <motion.div 
                    key={temperature}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-6xl font-bold text-gray-900 dark:text-white"
                  >
                    {Math.round(temperature)}{tempUnit}
                  </motion.div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Ressenti {Math.round(feelsLike)}{tempUnit}
                  </p>
                </div>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
                {condition}
              </h2>
            </motion.div>

            {/* Section Droite : Grille des détails (Humidité, Vent, etc.) */}
            <div className="flex-1 w-full">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <WiHumidity className="text-2xl text-blue-500" />, label: "Humidité", value: `${humidity}%` },
                  { icon: <WiStrongWind className="text-2xl text-green-500" />, label: "Vent", value: `${windSpeed} ${windUnit}` },
                  { icon: <WiBarometer className="text-2xl text-purple-500" />, label: "Pression", value: `${pressure} hPa` },
                  { icon: <WiDaySunny className="text-2xl text-yellow-500" />, label: "Index UV", value: uvIndex, level: getUVLevel(uvIndex) }
                ].map((detail, index) => (
                  <motion.div
                    key={detail.label}
                    variants={itemVariants}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.02)" }}
                  >
                    <WeatherDetail {...detail} />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </CardBody>

        {/* FOOTER : Sources et Unités */}
        <CardFooter>
          <motion.div variants={itemVariants} className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <span>Données : OpenWeatherMap</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="small" className={`text-xs ${unit === 'metric' ? 'font-bold' : ''}`}>°C</Button>
              <span className="text-gray-400">|</span>
              <Button variant="ghost" size="small" className={`text-xs ${unit === 'imperial' ? 'font-bold' : ''}`}>°F</Button>
            </div>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

/**
 * Composant interne pour l'affichage d'une statistique unique
 */
const WeatherDetail = ({ icon, label, value, level }) => {
  const getLevelColor = (lvl) => {
    const colors = {
      low: 'text-green-600',
      moderate: 'text-yellow-600',
      high: 'text-orange-600',
      'very-high': 'text-red-600',
      extreme: 'text-purple-600'
    };
    return colors[lvl] || 'text-gray-600 dark:text-gray-400';
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
      <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">{icon}</div>
      <div>
        <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
        <div className={`font-semibold ${getLevelColor(level)}`}>{value}</div>
      </div>
    </div>
  );
};

const getUVLevel = (uv) => {
  if (uv <= 2) return 'low';
  if (uv <= 5) return 'moderate';
  if (uv <= 7) return 'high';
  if (uv <= 10) return 'very-high';
  return 'extreme';
};

export default WeatherCard;