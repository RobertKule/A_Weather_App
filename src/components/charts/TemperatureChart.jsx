import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import { FiThermometer } from 'react-icons/fi';

const TemperatureChart = ({
  hourlyForecast = [],
  unit = 'metric',
  className = '',
}) => {
  if (!hourlyForecast || hourlyForecast.length === 0) {
    return (
      <div className={`card p-6 ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <FiThermometer className="text-red-500" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Température sur 24h
          </h3>
        </div>
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          Données horaires non disponibles
        </div>
      </div>
    );
  }

  // Préparer les données pour le graphique
  const chartData = hourlyForecast.map(hour => ({
    time: hour.time,
    température: hour.temperature,
    ressenti: hour.temperature - 2, // Simulé pour l'exemple
    humidité: hour.humidity,
  }));

  // Couleurs pour le thème
  const themeColors = {
    light: {
      grid: '#e5e7eb',
      tooltip: '#ffffff',
      border: '#d1d5db',
    },
    dark: {
      grid: '#374151',
      tooltip: '#1f2937',
      border: '#4b5563',
    },
  };

  const isDark = document.documentElement.classList.contains('dark');
  const colors = isDark ? themeColors.dark : themeColors.light;

  // Formatter pour l'axe Y
  const formatYAxis = value => `${value}°${unit === 'metric' ? 'C' : 'F'}`;

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">
            {label}
          </p>
          <div className="space-y-1">
            <p className="text-sm text-red-600 dark:text-red-400">
              🌡️ Temp: {payload[0].value}°{unit === 'metric' ? 'C' : 'F'}
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400">
              💧 Humidité: {payload[1]?.value || 0}%
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
      transition={{ duration: 0.5 }}
      className={`card p-6 ${className}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <FiThermometer className="text-red-500 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Température sur 24h
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Évolution horaire avec humidité
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-600 rounded"></div>
            <span className="text-gray-600 dark:text-gray-300">
              Température
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-600 rounded"></div>
            <span className="text-gray-600 dark:text-gray-300">Humidité</span>
          </div>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={colors.grid}
              vertical={false}
            />
            <XAxis
              dataKey="time"
              stroke={colors.border}
              tick={{ fill: isDark ? '#9ca3af' : '#6b7280' }}
              tickLine={{ stroke: colors.border }}
            />
            <YAxis
              stroke={colors.border}
              tick={{ fill: isDark ? '#9ca3af' : '#6b7280' }}
              tickLine={{ stroke: colors.border }}
              tickFormatter={formatYAxis}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* Gradient pour la température */}
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>

            {/* Courbe de température */}
            <Area
              type="monotone"
              dataKey="température"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#tempGradient)"
              name="Température"
            />

            {/* Courbe d'humidité (échelle secondaire) */}
            <Area
              type="monotone"
              dataKey="humidité"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#humidityGradient)"
              name="Humidité"
              yAxisId="right"
              strokeDasharray="3 3"
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              stroke={colors.border}
              tick={{ fill: isDark ? '#9ca3af' : '#6b7280' }}
              tickLine={{ stroke: colors.border }}
              tickFormatter={value => `${value}%`}
            />

            <Legend
              wrapperStyle={{
                paddingTop: '10px',
                color: isDark ? '#e5e7eb' : '#374151',
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stats en bas */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Max</div>
          <div className="text-xl font-bold text-red-600 dark:text-red-400">
            {Math.max(...chartData.map(d => d.température))}°
          </div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Moyenne
          </div>
          <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
            {Math.round(
              chartData.reduce((a, b) => a + b.température, 0) /
                chartData.length
            )}
            °
          </div>
        </div>
        <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-sm text-gray-500 dark:text-gray-400">Min</div>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {Math.min(...chartData.map(d => d.température))}°
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TemperatureChart;
