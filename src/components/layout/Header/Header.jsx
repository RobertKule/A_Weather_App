import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiMenu,
  FiX,
  FiMapPin,
  FiStar,
  FiSettings,
  FiSun,
  FiMoon,
  FiCloud,
} from 'react-icons/fi';
import { WiDaySunny } from 'react-icons/wi';
import Button from '../../ui/Button/Button';
import { useWeather } from '../../../contexts/WeatherContext';

const Header = ({ className = '' }) => {
  const {
    city,
    favorites,
    searchCity,
    useGeolocation,
    clearError,
    loading,
  } = useWeather();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('rk-weather-theme');
    if (savedTheme) return savedTheme === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const searchInputRef = useRef(null);
  const menuRef = useRef(null);

  // Gérer le thème
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('rk-weather-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('rk-weather-theme', 'light');
    }
  }, [isDarkMode]);

  // Fermer le menu mobile lors d'un clic extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  // Focus automatique sur l'input de recherche
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 200);
    }
  }, [isSearchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchCity(searchQuery.trim());
      setIsSearchOpen(false);
      setSearchQuery('');
      clearError();
    }
  };

  const handleQuickCitySelect = (selectedCity) => {
    searchCity(selectedCity);
    setIsSearchOpen(false);
    setSearchQuery('');
    clearError();
  };

  const handleLocationClick = async () => {
    try {
      await useGeolocation();
      clearError();
    } catch (err) {
      console.error('Erreur géolocalisation:', err);
    }
  };

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleToggleFavorite = (cityToToggle) => {
    // Cette fonction serait implémentée dans le contexte si besoin
    console.log('Toggle favorite:', cityToToggle);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-sm ${className}`}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* 1. LOGO & NOM */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Menu principal"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>

            <div className="flex items-center gap-2">
              <WiDaySunny
                size={32}
                className="text-yellow-500 animate-pulse-slow flex-shrink-0"
              />
              <div className="flex flex-col">
                <h1 className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent leading-none">
                  rk-weather
                </h1>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                  {city || 'Chargement...'}
                </span>
              </div>
            </div>
          </div>

          {/* 2. ONGLETS DESKTOP */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-xl">
            <button className="px-4 py-2 text-sm font-bold rounded-lg bg-white dark:bg-gray-700 shadow-sm text-blue-600">
              Météo
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
              Prévisions
            </button>
            <button className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
              Cartes
            </button>
          </nav>

          {/* 3. ACTIONS RAPIDES */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2.5 bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-blue-500 rounded-xl transition-all"
              aria-label="Rechercher une ville"
            >
              <FiSearch size={20} />
            </button>

            <div className="hidden sm:flex items-center border-l border-gray-200 dark:border-gray-700 ml-2 pl-2 gap-2">
              <Button
                variant="ghost"
                size="small"
                onClick={handleLocationClick}
                disabled={loading}
                aria-label="Utiliser ma position"
              >
                <FiMapPin size={18} />
              </Button>
              <Button
                variant="ghost"
                size="small"
                onClick={handleToggleTheme}
                aria-label={`Passer en mode ${isDarkMode ? 'clair' : 'sombre'}`}
              >
                {isDarkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
              </Button>
            </div>
          </div>
        </div>

        {/* MENU DÉROULANT MOBILE */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-gray-100 dark:border-gray-800 mt-3"
            >
              <div className="py-4 flex flex-col gap-2">
                <button className="flex items-center gap-4 px-4 py-3 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 font-bold">
                  <FiCloud /> Météo Actuelle
                </button>
                
                {favorites.length > 0 && (
                  <div className="px-4 py-2">
                    <h3 className="font-semibold mb-2 text-gray-600 dark:text-gray-400">
                      Favoris
                    </h3>
                    <div className="space-y-1">
                      {favorites.map((favCity) => (
                        <button
                          key={favCity}
                          onClick={() => {
                            handleQuickCitySelect(favCity);
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-between"
                        >
                          <span>{favCity}</span>
                          <FiStar className="text-yellow-500" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <button
                  onClick={() => {
                    handleLocationClick();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                >
                  <FiMapPin /> Ma Position
                </button>
                
                <button
                  onClick={handleToggleTheme}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                >
                  {isDarkMode ? <FiSun /> : <FiMoon />}
                  {isDarkMode ? 'Mode Clair' : 'Mode Sombre'}
                </button>
                
                <button className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300">
                  <FiSettings /> Paramètres
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* MODAL DE RECHERCHE CENTRÉ */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Overlay sombre */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
            />

            {/* Contenu de la Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden my-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black dark:text-white">
                    Recherche
                  </h2>
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    aria-label="Fermer la recherche"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                <form onSubmit={handleSearch} className="relative mb-6">
                  <FiSearch
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500"
                    size={22}
                  />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Entrez une ville..."
                    className="w-full pl-12 pr-4 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 text-lg font-medium"
                    aria-label="Rechercher une ville"
                  />
                </form>

                <div className="space-y-4">
                  <p className="text-xs font-bold uppercase text-gray-400 tracking-widest">
                    Suggestions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Paris', 'New York', 'Tokyo', 'London', 'Berlin'].map(
                      (suggestedCity) => (
                        <button
                          key={suggestedCity}
                          onClick={() => handleQuickCitySelect(suggestedCity)}
                          className="px-4 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 rounded-xl text-sm font-medium transition-all"
                        >
                          {suggestedCity}
                        </button>
                      )
                    )}
                  </div>
                  
                  {favorites.length > 0 && (
                    <>
                      <p className="text-xs font-bold uppercase text-gray-400 tracking-widest mt-4">
                        Favoris
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {favorites.map((favCity) => (
                          <button
                            key={favCity}
                            onClick={() => handleQuickCitySelect(favCity)}
                            className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/30 hover:bg-yellow-500 hover:text-white dark:hover:bg-yellow-600 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
                          >
                            <FiStar size={14} />
                            {favCity}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;