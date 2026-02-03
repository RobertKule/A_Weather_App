import React from 'react';
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiFog,
  WiNa,
} from 'react-icons/wi';

const WeatherIcon = ({ conditionCode, size = 64, className = '' }) => {
  const getIcon = code => {
    if (code >= 200 && code < 300)
      return <WiThunderstorm size={size} className={className} />;
    if (code >= 300 && code < 400)
      return <WiRain size={size} className={className} />;
    if (code >= 500 && code < 600)
      return <WiRain size={size} className={className} />;
    if (code >= 600 && code < 700)
      return <WiSnow size={size} className={className} />;
    if (code >= 700 && code < 800)
      return <WiFog size={size} className={className} />;
    if (code === 800) return <WiDaySunny size={size} className={className} />;
    if (code > 800 && code < 900)
      return <WiCloudy size={size} className={className} />;
    return <WiNa size={size} className={className} />;
  };

  return getIcon(conditionCode);
};

export default WeatherIcon;
