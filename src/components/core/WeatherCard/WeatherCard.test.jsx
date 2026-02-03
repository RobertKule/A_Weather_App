import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import WeatherCard from './WeatherCard';

const mockWeatherData = {
  city: 'Goma',
  country: 'FR',
  temperature: 22,
  feelsLike: 20,
  condition: 'Ensoleillé',
  conditionId: 800,
  humidity: 65,
  windSpeed: 12,
  windDirection: 'NE',
  pressure: 1013,
  uvIndex: 6,
  unit: 'metric',
};

describe('WeatherCard', () => {
  it('renders loading state correctly', () => {
    render(<WeatherCard loading={true} />);

    // Vérifie que le skeleton est présent
    expect(screen.getByRole('article')).toHaveClass('animate-pulse');

    // Vérifie qu'il n'y a pas de données
    expect(screen.queryByText('Goma')).not.toBeInTheDocument();
  });

  it('renders error state when no data provided', () => {
    render(<WeatherCard weatherData={null} />);

    expect(screen.getByText('Aucune donnée météo')).toBeInTheDocument();
    expect(screen.getByText('Rechercher une ville')).toBeInTheDocument();
  });

  it('renders weather data correctly', () => {
    render(<WeatherCard weatherData={mockWeatherData} />);

    // Vérifie les données principales
    expect(screen.getByText('Goma, FR')).toBeInTheDocument();
    expect(screen.getByText('22°C')).toBeInTheDocument();
    expect(screen.getByText('Ensoleillé')).toBeInTheDocument();

    // Vérifie les détails
    expect(screen.getByText('65%')).toBeInTheDocument();
    expect(screen.getByText('12 km/h NE')).toBeInTheDocument();
    expect(screen.getByText('1013 hPa')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('calls onRefresh when refresh button is clicked', () => {
    const mockRefresh = vi.fn();

    render(
      <WeatherCard weatherData={mockWeatherData} onRefresh={mockRefresh} />
    );

    const refreshButton = screen.getByRole('button', { name: /actualiser/i });
    fireEvent.click(refreshButton);

    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility attributes', () => {
    render(<WeatherCard weatherData={mockWeatherData} />);

    // Vérifie les attributs ARIA
    const article = screen.getByRole('article');
    expect(article).toHaveAttribute('aria-labelledby', 'weather-card-title');

    // Vérifie les labels
    expect(screen.getByLabelText(/température actuelle/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ressenti/i)).toBeInTheDocument();

    // Vérifie les régions
    expect(
      screen.getByRole('region', { name: /détails météorologiques/i })
    ).toBeInTheDocument();
  });

  it('displays temperature with correct unit', () => {
    const imperialData = {
      ...mockWeatherData,
      unit: 'imperial',
      temperature: 72,
    };

    render(<WeatherCard weatherData={imperialData} />);

    expect(screen.getByText('72°F')).toBeInTheDocument();
  });
});
