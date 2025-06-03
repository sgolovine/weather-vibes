import React, { useState, useEffect } from "react";
import type { WeatherData, WeatherStationDetails } from "../types/weather";
import weatherService from "../services/weatherService";
import LoadingSpinner from "./LoadingSpinner";

interface WeatherStationModalProps {
  isOpen: boolean;
  onClose: () => void;
  weatherData: WeatherData;
  onStationSelect: (lat: number, lng: number) => void;
}

const WeatherStationModal: React.FC<WeatherStationModalProps> = ({
  isOpen,
  onClose,
  weatherData,
  onStationSelect,
}) => {
  const [nearbyStations, setNearbyStations] = useState<WeatherStationDetails[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && weatherData) {
      fetchNearbyStations();
    }
  }, [isOpen, weatherData]);

  const fetchNearbyStations = async () => {
    setLoading(true);
    setError(null);
    try {
      const stations = await weatherService.getNearbyWeatherStations(
        weatherData.location.coordinates.lat,
        weatherData.location.coordinates.lng
      );
      setNearbyStations(stations);
    } catch (err) {
      setError("Failed to load nearby weather stations");
      console.error("Error fetching nearby stations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStationClick = (station: WeatherStationDetails) => {
    onStationSelect(station.coordinates.lat, station.coordinates.lng);
    onClose();
  };

  const formatElevation = (elevation: { unitCode: string; value: number }) => {
    if (elevation.unitCode === "wmoUnit:m") {
      const feet = Math.round(elevation.value * 3.28084);
      return `${feet} ft (${Math.round(elevation.value)} m)`;
    }
    return `${Math.round(elevation.value)} ${elevation.unitCode}`;
  };

  const formatDistance = (distance?: number) => {
    if (!distance) return "";
    return distance < 1
      ? `${(distance * 5280).toFixed(0)} ft`
      : `${distance.toFixed(1)} mi`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Weather Station Information
              </h2>
              <p className="text-blue-100 text-sm">
                {weatherData.location.city}, {weatherData.location.state}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-200 transition-colors"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Current Station Info */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 text-blue-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              Current Weather Station
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  Forecast Office
                </div>
                <div className="font-medium text-gray-900">
                  {weatherData.station.forecastOffice}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Grid ID</div>
                <div className="font-medium text-gray-900">
                  {weatherData.station.gridId}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">
                  County Warning Area
                </div>
                <div className="font-medium text-gray-900">
                  {weatherData.station.cwa}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Time Zone</div>
                <div className="font-medium text-gray-900">
                  {weatherData.station.timeZone}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Radar Station</div>
                <div className="font-medium text-gray-900">
                  {weatherData.station.radarStation}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600 mb-1">Coordinates</div>
                <div className="font-medium text-gray-900">
                  {weatherData.location.coordinates.lat.toFixed(4)},{" "}
                  {weatherData.location.coordinates.lng.toFixed(4)}
                </div>
              </div>
            </div>
          </div>

          {/* Nearby Stations */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg
                className="w-5 h-5 text-green-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Nearby Weather Stations
            </h3>

            {loading && (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                <div className="text-red-800 font-medium">Error</div>
                <div className="text-red-700 text-sm">{error}</div>
              </div>
            )}

            {!loading && !error && nearbyStations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No nearby weather stations found
              </div>
            )}

            {!loading && !error && nearbyStations.length > 0 && (
              <div className="space-y-3">
                {nearbyStations.map((station, index) => (
                  <div
                    key={station.id}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                    onClick={() => handleStationClick(station)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                            {index + 1}
                          </div>
                          <h4 className="font-medium text-gray-900">
                            {station.name}
                          </h4>
                          {station.distance && (
                            <span className="text-sm text-gray-500">
                              ({formatDistance(station.distance)})
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                          <div>
                            <span className="text-gray-600">ID:</span>
                            <span className="ml-1 font-medium">
                              {station.stationIdentifier}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">County:</span>
                            <span className="ml-1 font-medium">
                              {station.county}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">State:</span>
                            <span className="ml-1 font-medium">
                              {station.state}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Elevation:</span>
                            <span className="ml-1 font-medium">
                              {formatElevation(station.elevation)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Time Zone:</span>
                            <span className="ml-1 font-medium">
                              {station.timeZone}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Coordinates:</span>
                            <span className="ml-1 font-medium">
                              {station.coordinates.lat.toFixed(3)},{" "}
                              {station.coordinates.lng.toFixed(3)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="ml-4 flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Click on any station to view its weather data
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherStationModal;
