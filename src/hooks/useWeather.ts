import { useState, useEffect } from "react";
import weatherService from "../services/weatherService";
import locationService from "../services/locationService";
import type { WeatherData, UseWeatherReturn } from "../types/weather";

export const useWeather = (): UseWeatherReturn => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<
    PermissionState | "prompt"
  >("prompt");

  const fetchWeatherByCoordinates = async (
    lat: number,
    lng: number
  ): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // Validate coordinates are within US bounds
      if (!locationService.isValidUSCoordinates(lat, lng)) {
        throw new Error(
          "Location is outside the United States. NWS API only covers US locations."
        );
      }

      const data = await weatherService.getCompleteWeatherData(lat, lng);
      setWeatherData(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByLocation = async (query: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const locations = await locationService.geocodeLocation(query);
      if (locations.length === 0) {
        throw new Error("Location not found");
      }

      // Use the first result
      const { lat, lng } = locations[0];
      await fetchWeatherByCoordinates(lat, lng);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      setWeatherData(null);
      setLoading(false);
    }
  };

  const fetchWeatherByCurrentLocation = async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const position = await locationService.getCurrentPosition();
      setLocationPermission("granted");
      await fetchWeatherByCoordinates(position.lat, position.lng);
    } catch (err) {
      setLocationPermission("denied");
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      setWeatherData(null);
      setLoading(false);
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  const clearWeatherData = (): void => {
    setWeatherData(null);
    setError(null);
  };

  // Check geolocation permission status on mount
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).then((result) => {
        setLocationPermission(result.state);
      });
    }
  }, []);

  return {
    weatherData,
    loading,
    error,
    locationPermission,
    fetchWeatherByCoordinates,
    fetchWeatherByLocation,
    fetchWeatherByCurrentLocation,
    clearError,
    clearWeatherData,
  };
};
