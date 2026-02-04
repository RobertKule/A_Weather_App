import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { motion } from 'framer-motion';
import { FiDroplet, FiCloudRain } from 'react-icons/fi';

const PrecipitationChart = ({ forecastData = [], className = '' }) => {
  if (!forecastData || forecastData.length === 0) {
    return (
      <div className={`card p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <FiCloudRain className="text-blue-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Précipitations cette semaine
          </h3>
        </div>
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          Données de prévisions non disponibles
        </div>
      </div>
    );
  }

  // Préparer les données pour le graphique (7 jours)
  const chartData = forecastData.slice(0, 7).map(day => ({
    day: day.date?.split(' ')[0] || 'Jour',
    précipitation: Math.floor(Math.random() * 100), // Simulé pour l'exemple
    humidité: day.humidity || 50,
    probabilité: Math.floor(Math.random() * 100),
  }));

  const isDark = document.documentElement.classList.contains('dark');

  // Couleurs basées sur l'intensité des précipitations
  const getPrecipitationColor = value => {
    if (value < 20) return '#60a5fa'; // Léger
    if (value < 50) return '#3b82f6'; // Modéré
    if (value < 80) return '#1d4ed8'; // Fort
    return '#1e40af'; // Très fort
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">
            {label}
          </p>
          <div className="space-y-1">
            <p className="text-sm text-blue-600 dark:text-blue-400">
              💧 Précipitation: {payload[0].value}mm
            </p>
            <p className="text-sm text-green-600 dark:text-green-400">
              ☔ Probabilité: {payload[1]?.value || 0}%
            </p>
            <p className="text-sm text-purple-600 dark:text-purple-400">
              💦 Humidité: {payload[2]?.value || 0}%
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`card p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <FiCloudRain className="text-blue-500 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Précipitations cette semaine
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Prédictions sur 7 jours
            </p>
          </div>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
          <FiDroplet />
          <span>mm de pluie</span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? '#374151' : '#e5e7eb'}
              vertical={false}
            />
            <XAxis
              dataKey="day"
              stroke={isDark ? '#9ca3af' : '#6b7280'}
              tick={{ fill: isDark ? '#9ca3af' : '#6b7280' }}
            />
            <YAxis
              stroke={isDark ? '#9ca3af' : '#6b7280'}
              tick={{ fill: isDark ? '#9ca3af' : '#6b7280' }}
              label={{
                value: 'mm',
                angle: -90,
                position: 'insideLeft',
                fill: isDark ? '#9ca3af' : '#6b7280',
              }}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Barres de précipitation */}
            <Bar
              dataKey="précipitation"
              name="Précipitation (mm)"
              radius={[4, 4, 0, 0]}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getPrecipitationColor(entry.précipitation)}
                />
              ))}
            </Bar>

            {/* Barres de probabilité (lignes) */}
            <Bar
              dataKey="probabilité"
              name="Probabilité (%)"
              fill="#10b981"
              fillOpacity={0.3}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Légende des intensités */}
      <div className="grid grid-cols-4 gap-2 mt-6">
        <div className="flex flex-col items-center">
          <div className="w-8 h-2 bg-blue-400 rounded"></div>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Léger
          </span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-2 bg-blue-500 rounded"></div>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Modéré
          </span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-2 bg-blue-600 rounded"></div>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Fort
          </span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-2 bg-blue-800 rounded"></div>
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Très fort
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Jour le plus pluvieux
          </div>
          <div className="font-bold text-gray-900 dark:text-white">
            {
              chartData.reduce((max, day) =>
                day.précipitation > max.précipitation ? day : max
              ).day
            }
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Moyenne quotidienne
          </div>
          <div className="font-bold text-blue-600 dark:text-blue-400">
            {Math.round(
              chartData.reduce((a, b) => a + b.précipitation, 0) /
                chartData.length
            )}
            mm
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total semaine
          </div>
          <div className="font-bold text-purple-600 dark:text-purple-400">
            {chartData.reduce((a, b) => a + b.précipitation, 0)}mm
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PrecipitationChart;
