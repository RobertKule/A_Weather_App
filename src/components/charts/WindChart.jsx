import React from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import { FiWind } from 'react-icons/fi';

const WindChart = ({ weatherData, className = '' }) => {
  if (!weatherData) {
    return (
      <div className={`card p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <FiWind className="text-green-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Rose des vents
          </h3>
        </div>
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          Données de vent non disponibles
        </div>
      </div>
    );
  }

  // Données pour la rose des vents (8 directions)
  const windData = [
    { direction: 'N', vitesse: Math.random() * 20 },
    { direction: 'NE', vitesse: Math.random() * 15 },
    { direction: 'E', vitesse: Math.random() * 25 },
    { direction: 'SE', vitesse: Math.random() * 18 },
    { direction: 'S', vitesse: Math.random() * 22 },
    { direction: 'SO', vitesse: Math.random() * 16 },
    { direction: 'O', vitesse: Math.random() * 20 },
    { direction: 'NO', vitesse: Math.random() * 14 },
  ];

  const isDark = document.documentElement.classList.contains('dark');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`card p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <FiWind className="text-green-500 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Rose des vents
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Direction et intensité du vent
            </p>
          </div>
        </div>
        <div className="text-sm px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
          {weatherData.windSpeed || 0} km/h
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={windData}>
            <PolarGrid stroke={isDark ? '#4b5563' : '#d1d5db'} />
            <PolarAngleAxis
              dataKey="direction"
              tick={{
                fill: isDark ? '#9ca3af' : '#6b7280',
                fontSize: 12,
              }}
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 30]}
              tick={{
                fill: isDark ? '#9ca3af' : '#6b7280',
                fontSize: 10,
              }}
            />
            <Radar
              name="Vitesse du vent (km/h)"
              dataKey="vitesse"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.6}
            />
            <Legend
              wrapperStyle={{
                color: isDark ? '#e5e7eb' : '#374151',
                fontSize: '12px',
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Infos vent actuel */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Direction
          </div>
          <div className="text-xl font-bold text-green-600 dark:text-green-400">
            {weatherData.windDirection || 'N'}
          </div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Vitesse
          </div>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {weatherData.windSpeed || 0} km/h
          </div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Rafales
          </div>
          <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
            {(weatherData.windSpeed || 0) + 5} km/h
          </div>
        </div>
      </div>

      {/* Description de l'intensité */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
          Vent léger ({weatherData.windSpeed < 20 ? '✓' : '✗'})
        </p>
        <p className="flex items-center gap-2 mt-1">
          <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full"></span>
          Vent modéré (
          {weatherData.windSpeed >= 20 && weatherData.windSpeed < 40
            ? '✓'
            : '✗'}
          )
        </p>
        <p className="flex items-center gap-2 mt-1">
          <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
          Vent fort ({weatherData.windSpeed >= 40 ? '✓' : '✗'})
        </p>
      </div>
    </motion.div>
  );
};

export default WindChart;
