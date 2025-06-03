import { useWeather } from "./hooks/useWeather";
import LocationSearch from "./components/LocationSearch";
import WeatherCard from "./components/WeatherCard";
import ForecastList from "./components/ForecastList";
import LoadingSpinner from "./components/LoadingSpinner";

function App(): JSX.Element {
  const {
    weatherData,
    loading,
    error,
    locationPermission,
    fetchWeatherByCoordinates,
    fetchWeatherByLocation,
    fetchWeatherByCurrentLocation,
    clearError,
  } = useWeather();

  const handleLocationSearch = (query: string): void => {
    fetchWeatherByLocation(query);
  };

  const handleCurrentLocation = (): void => {
    fetchWeatherByCurrentLocation();
  };

  const handleErrorClose = (): void => {
    clearError();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg font-bold">W</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">
                Weather Vibes
              </h1>
            </div>

            {/* Location Search in Header - Desktop */}
            <div className="flex-1 max-w-md mx-8">
              <LocationSearch
                onLocationSearch={handleLocationSearch}
                onCurrentLocation={handleCurrentLocation}
                loading={loading}
                locationPermission={locationPermission}
                compact={true}
              />
            </div>

            <div className="text-sm text-gray-600">
              Powered by National Weather Service
            </div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden">
            {/* Top row with logo and title */}
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center space-x-3">
                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">W</span>
                </div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Weather Vibes
                </h1>
              </div>
              <div className="text-xs text-gray-500">NWS Data</div>
            </div>

            {/* Bottom row with search */}
            <div className="pb-3">
              <LocationSearch
                onLocationSearch={handleLocationSearch}
                onCurrentLocation={handleCurrentLocation}
                loading={loading}
                locationPermission={locationPermission}
                compact={true}
              />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        {!weatherData && !loading && !error && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6">
              <span className="text-3xl">🌤️</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Professional Weather Insights
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get accurate, real-time weather data and forecasts for any
              location across the United States
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button
              className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors"
              onClick={handleErrorClose}
              aria-label="Close error"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Weather Data */}
        {weatherData && !loading && (
          <>
            <WeatherCard
              weatherData={weatherData}
              onStationSelect={fetchWeatherByCoordinates}
            />
            <ForecastList weatherData={weatherData} />
          </>
        )}

        {/* Welcome Message */}
        {!weatherData && !loading && !error && (
          <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-2xl p-8 text-center shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Smart Search
                </h3>
                <p className="text-gray-600 text-sm">
                  Search by city, zip code, or address across the United States
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-white"
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
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Location Based
                </h3>
                <p className="text-gray-600 text-sm">
                  Get instant weather for your current location with one click
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl border border-purple-100">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Detailed Forecasts
                </h3>
                <p className="text-gray-600 text-sm">
                  7-day forecasts, hourly data, and weather alerts
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 py-8 border-t border-gray-200">
          <div className="text-gray-600 text-sm">
            <p className="mb-2">
              Weather data provided by the{" "}
              <a
                href="https://www.weather.gov/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              >
                National Weather Service
              </a>
            </p>
            <p className="text-xs text-gray-500">
              Built with React • Open Source Weather Data • US Locations Only
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
