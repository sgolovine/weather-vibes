import React, { useState } from "react";
import {
  formatTemperature,
  getWeatherIcon,
  formatWind,
  truncateText,
  formatWeatherStation,
} from "../utils/helpers";
import type { WeatherData } from "../types/weather";
import WeatherStationModal from "./WeatherStationModal";

interface WeatherCardProps {
  weatherData: WeatherData | null;
  onStationSelect?: (lat: number, lng: number) => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  weatherData,
  onStationSelect,
}) => {
  const [isStationModalOpen, setIsStationModalOpen] = useState(false);

  if (!weatherData) return null;

  const { location, station, current, alerts } = weatherData;

  const handleStationClick = () => {
    setIsStationModalOpen(true);
  };

  const handleStationSelect = (lat: number, lng: number) => {
    if (onStationSelect) {
      onStationSelect(lat, lng);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Weather Alerts */}
      {alerts && alerts.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm border border-red-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-5 h-5 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Weather Alerts
            </h2>
          </div>
          <div className="space-y-3">
            {alerts.slice(0, 3).map((alert, index) => (
              <div
                key={index}
                className="bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <div className="font-semibold mb-2 text-red-800">
                  {alert.properties?.headline || "Weather Alert"}
                </div>
                <div className="text-red-700 text-sm leading-relaxed">
                  {truncateText(alert.properties?.description, 200)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Weather */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 text-white">
          <h2 className="text-2xl font-bold mb-1">
            {formatWeatherStation(
              station.forecastOffice,
              station.cwa,
              weatherData.officeDetails
            )}
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className="text-blue-200 text-sm opacity-80">
              {location.city}, {location.state}
            </p>
            <div className="flex items-center gap-1 text-blue-200 text-xs opacity-75">
              <svg
                className="w-3 h-3"
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
              <span>
                {location.coordinates.lat.toFixed(4)},{" "}
                {location.coordinates.lng.toFixed(4)}
              </span>
            </div>
          </div>
        </div>

        {/* Main Weather Display */}
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-8xl mb-4">
              {getWeatherIcon(current.shortForecast)}
            </div>
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {formatTemperature(current.temperature)}
            </div>
            <div className="text-xl text-gray-600 mb-4">
              {current.shortForecast}
            </div>

            {/* Wind and Period Info */}
            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"
                  />
                </svg>
                <span>
                  {formatWind(current.windSpeed, current.windDirection)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                <span>{current.name}</span>
              </div>
            </div>
          </div>

          {/* Weather Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {current.relativeHumidity && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                <div className="flex items-center space-x-2 mb-2">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">
                    Humidity
                  </span>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {current.relativeHumidity.value}%
                </div>
              </div>
            )}

            {current.dewpoint && (
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-center space-x-2 mb-2">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">
                    Dewpoint
                  </span>
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {formatTemperature(current.dewpoint.value)}
                </div>
              </div>
            )}
          </div>

          {/* Weather Station Info */}
          <div
            className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-100 mb-6 cursor-pointer hover:border-indigo-300 hover:shadow-md transition-all"
            onClick={handleStationClick}
          >
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-indigo-600"
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
                <span>Weather Station Details</span>
              </div>
              <div className="flex items-center space-x-1 text-indigo-600">
                <span className="text-xs">View nearby stations</span>
                <svg
                  className="w-4 h-4"
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
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Office:</span>
                <span className="ml-1 font-medium">
                  {formatWeatherStation(
                    station.forecastOffice,
                    station.cwa,
                    weatherData.officeDetails
                  )}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Grid:</span>
                <span className="ml-1 font-medium">{station.gridId}</span>
              </div>
              <div>
                <span className="text-gray-600">Radar:</span>
                <span className="ml-1 font-medium">{station.radarStation}</span>
              </div>
              <div>
                <span className="text-gray-600">Time Zone:</span>
                <span className="ml-1 font-medium">{station.timeZone}</span>
              </div>
            </div>
          </div>

          {/* NWS Office Details */}
          {weatherData.officeDetails && (
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-emerald-600"
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
                <span>NWS Office Information</span>
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600 font-medium">
                    Office Name:
                  </span>
                  <div className="text-gray-900 mt-1">
                    {weatherData.officeDetails.name}
                  </div>
                </div>

                {weatherData.officeDetails.address &&
                  (weatherData.officeDetails.address.streetAddress ||
                    weatherData.officeDetails.address.addressLocality ||
                    weatherData.officeDetails.address.addressRegion) && (
                    <div>
                      <span className="text-gray-600 font-medium">
                        Address:
                      </span>
                      <div className="text-gray-900 mt-1">
                        {weatherData.officeDetails.address.streetAddress && (
                          <div>
                            {weatherData.officeDetails.address.streetAddress}
                          </div>
                        )}
                        <div>
                          {weatherData.officeDetails.address.addressLocality}
                          {weatherData.officeDetails.address.addressLocality &&
                            weatherData.officeDetails.address.addressRegion &&
                            ", "}
                          {weatherData.officeDetails.address.addressRegion}
                          {weatherData.officeDetails.address.postalCode &&
                            ` ${weatherData.officeDetails.address.postalCode}`}
                        </div>
                      </div>
                    </div>
                  )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {weatherData.officeDetails.telephone && (
                    <div>
                      <span className="text-gray-600 font-medium">Phone:</span>
                      <div className="text-gray-900 mt-1">
                        <a
                          href={`tel:${weatherData.officeDetails.telephone}`}
                          className="text-emerald-600 hover:text-emerald-800 transition-colors"
                        >
                          {weatherData.officeDetails.telephone}
                        </a>
                      </div>
                    </div>
                  )}

                  {weatherData.officeDetails.email && (
                    <div>
                      <span className="text-gray-600 font-medium">Email:</span>
                      <div className="text-gray-900 mt-1">
                        <a
                          href={`mailto:${weatherData.officeDetails.email}`}
                          className="text-emerald-600 hover:text-emerald-800 transition-colors"
                        >
                          {weatherData.officeDetails.email}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {weatherData.officeDetails.nwsRegion && (
                  <div>
                    <span className="text-gray-600 font-medium">
                      NWS Region:
                    </span>
                    <div className="text-gray-900 mt-1">
                      {weatherData.officeDetails.nwsRegion}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Detailed Forecast */}
          {current.detailedForecast && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span>Detailed Forecast</span>
              </h4>
              <p className="text-gray-700 leading-relaxed">
                {current.detailedForecast}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Weather Station Modal */}
      <WeatherStationModal
        isOpen={isStationModalOpen}
        onClose={() => setIsStationModalOpen(false)}
        weatherData={weatherData}
        onStationSelect={handleStationSelect}
      />
    </div>
  );
};

export default WeatherCard;
