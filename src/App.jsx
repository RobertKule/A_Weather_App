import React from 'react';
import './App.css';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="card p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-weather-primary mb-4">
          🌤️ rk-weather
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Application météo moderne en cours de développement
        </p>
        <div className="animate-pulse-slow">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
        </div>
        <div className="mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Projet initialisé avec succès ! 🎉
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
