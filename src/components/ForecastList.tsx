import React from "react";
import {
  formatTemperature,
  getWeatherIcon,
  formatDate,
  formatTime,
  truncateText,
} from "../utils/helpers";
import type { WeatherData } from "../types/weather";

interface ForecastListProps {
  weatherData: WeatherData | null;
}

const ForecastList: React.FC<ForecastListProps> = ({ weatherData }) => {
  if (!weatherData || !weatherData.forecast || !weatherData.hourly) return null;

  const { forecast, hourly } = weatherData;

  return (
    <div className="space-y-6">
      {/* Hourly Forecast */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-4 text-white">
          <h2 className="text-xl font-semibold flex items-center space-x-2">
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>24-Hour Forecast</span>
          </h2>
        </div>
        <div className="p-6">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {hourly.slice(0, 24).map((hour, index) => (
              <div
                key={index}
                className="min-w-[100px] flex-shrink-0 text-center bg-gradient-to-br from-gray-50 to-green-50 border border-gray-200 rounded-xl p-4 transition-all duration-200 hover:ring-2 hover:ring-green-300"
              >
                <div className="text-sm font-medium text-gray-700 mb-2">
                  {formatTime(hour.startTime)}
                </div>
                <div className="text-3xl my-2">
                  {getWeatherIcon(hour.shortForecast)}
                </div>
                <div className="font-bold text-gray-900 mb-1">
                  {formatTemperature(hour.temperature)}
                </div>
                {hour.windSpeed && (
                  <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
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
                        d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"
                      />
                    </svg>
                    <span>{hour.windSpeed}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 text-white">
          <h2 className="text-xl font-semibold flex items-center space-x-2">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>7-Day Forecast</span>
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {forecast.map((period, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 rounded-xl p-4 text-center transition-all duration-200 hover:ring-2 hover:ring-blue-300 hover:-translate-y-1"
              >
                <div className="font-semibold mb-3 text-gray-900 text-sm">
                  {formatDate(period.startTime)}
                </div>
                <div className="text-4xl my-3">
                  {getWeatherIcon(period.shortForecast)}
                </div>
                <div className="mb-3">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatTemperature(period.temperature)}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">
                    {period.temperatureUnit}
                  </div>
                </div>
                <div className="text-sm text-gray-700 mb-2 leading-tight">
                  {truncateText(period.shortForecast, 50)}
                </div>
                {period.windSpeed && (
                  <div className="flex items-center justify-center space-x-1 text-xs text-gray-500">
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
                        d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2"
                      />
                    </svg>
                    <span>
                      {period.windSpeed} {period.windDirection}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Extended Forecast Details */}
      <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-purple-500 to-violet-600 px-6 py-4 text-white">
          <h2 className="text-xl font-semibold flex items-center space-x-2">
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Detailed Forecasts</span>
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {forecast.slice(0, 3).map((period, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-purple-50 border border-gray-200 rounded-xl p-5"
              >
                <div className="flex items-center mb-4 gap-4">
                  <div className="text-4xl">
                    {getWeatherIcon(period.shortForecast)}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-1">
                      {period.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {formatDate(period.startTime)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {formatTemperature(period.temperature)}
                    </div>
                    {period.windSpeed && (
                      <div className="flex items-center justify-end space-x-1 text-sm text-gray-600 mt-1">
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
                          {period.windSpeed} {period.windDirection}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {period.detailedForecast && (
                  <div className="bg-white/60 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {period.detailedForecast}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastList;
