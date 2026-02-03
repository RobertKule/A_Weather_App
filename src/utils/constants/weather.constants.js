export const WEATHER_CONDITIONS = {
  THUNDERSTORM: {
    code: [200, 201, 202, 210, 211, 212, 221, 230, 231, 232],
    label: 'Orage',
    icon: '⛈️',
    color: 'stormy',
  },
  DRIZZLE: {
    code: [300, 301, 302, 310, 311, 312, 313, 314, 321],
    label: 'Bruine',
    icon: '🌧️',
    color: 'rainy',
  },
  RAIN: {
    code: [500, 501, 502, 503, 504, 511, 520, 521, 522, 531],
    label: 'Pluie',
    icon: '🌧️',
    color: 'rainy',
  },
  SNOW: {
    code: [600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622],
    label: 'Neige',
    icon: '❄️',
    color: 'snowy',
  },
  ATMOSPHERE: {
    code: [701, 711, 721, 731, 741, 751, 761, 762, 771, 781],
    label: 'Brume',
    icon: '🌫️',
    color: 'cloudy',
  },
  CLEAR: {
    code: [800],
    label: 'Clair',
    icon: '☀️',
    color: 'sunny',
  },
  CLOUDS: {
    code: [801, 802, 803, 804],
    label: 'Nuageux',
    icon: '☁️',
    color: 'cloudy',
  },
};

export const UNITS = {
  METRIC: {
    temp: '°C',
    speed: 'km/h',
    pressure: 'hPa',
  },
  IMPERIAL: {
    temp: '°F',
    speed: 'mph',
    pressure: 'hPa',
  },
};

export const DEFAULT_CITY = {
  name: 'Goma',
  country: 'FR',
  lat: 48.8566,
  lon: 2.3522,
};
