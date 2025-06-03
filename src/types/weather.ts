// Location types
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Location {
  city: string;
  state: string;
  coordinates: Coordinates;
}

export interface GeocodeResult {
  lat: number;
  lng: number;
  displayName: string;
  city: string;
  state: string;
}

// Weather forecast types
export interface ForecastPeriod {
  number: number;
  name: string;
  startTime: string;
  endTime: string;
  isDaytime: boolean;
  temperature: number;
  temperatureUnit: string;
  temperatureTrend?: string;
  windSpeed: string;
  windDirection: string;
  icon: string;
  shortForecast: string;
  detailedForecast: string;
  relativeHumidity?: {
    unitCode: string;
    value: number;
  };
  dewpoint?: {
    unitCode: string;
    value: number;
  };
}

// Weather alert types
export interface WeatherAlert {
  id: string;
  type: string;
  properties: {
    id: string;
    areaDesc: string;
    geocode: {
      FIPS6: string[];
      UGC: string[];
    };
    affectedZones: string[];
    references: any[];
    sent: string;
    effective: string;
    onset: string;
    expires: string;
    ends: string;
    status: string;
    messageType: string;
    category: string;
    severity: string;
    certainty: string;
    urgency: string;
    event: string;
    sender: string;
    senderName: string;
    headline: string;
    description: string;
    instruction: string;
    response: string;
    parameters: Record<string, any>;
  };
}

// Weather station information
export interface WeatherStation {
  forecastOffice: string;
  cwa: string;
  gridId: string;
  radarStation: string;
  timeZone: string;
}

// NWS Office information
export interface NWSOfficeDetails {
  id: string;
  name: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
  };
  telephone: string;
  faxNumber: string;
  email: string;
  sameAs: string;
  nwsRegion: string;
  parentOrganization: string;
  responsibleCounties: string[];
  responsibleForecastZones: string[];
  responsibleFireZones: string[];
  approvedObservationStations: string[];
}

// Detailed weather station information
export interface WeatherStationDetails {
  id: string;
  name: string;
  stationIdentifier: string;
  timeZone: string;
  coordinates: Coordinates;
  elevation: {
    unitCode: string;
    value: number;
  };
  county: string;
  state: string;
  distance?: number; // Distance from current location in miles
}

// NWS observation stations API response
export interface NWSObservationStationsResponse {
  features: Array<{
    id: string;
    type: string;
    geometry: {
      type: string;
      coordinates: [number, number];
    };
    properties: {
      "@id": string;
      "@type": string;
      elevation: {
        unitCode: string;
        value: number;
      };
      stationIdentifier: string;
      name: string;
      timeZone: string;
      forecast: string;
      county: string;
      state: string;
    };
  }>;
}

// Complete weather data structure
export interface WeatherData {
  location: Location;
  station: WeatherStation;
  officeDetails?: NWSOfficeDetails;
  current: ForecastPeriod;
  forecast: ForecastPeriod[];
  hourly: ForecastPeriod[];
  alerts: WeatherAlert[];
}

// NWS API response types
export interface NWSLocationData {
  cwa: string;
  forecastOffice: string;
  gridId: string;
  gridX: number;
  gridY: number;
  forecast: string;
  forecastHourly: string;
  forecastGridData: string;
  observationStations: string;
  relativeLocation?: {
    type: string;
    geometry: {
      type: string;
      coordinates: number[];
    };
    properties: {
      city: string;
      state: string;
      distance: {
        unitCode: string;
        value: number;
      };
      bearing: {
        unitCode: string;
        value: number;
      };
    };
  };
  forecastZone: string;
  county: string;
  fireWeatherZone: string;
  timeZone: string;
  radarStation: string;
}

// Hook return type
export interface UseWeatherReturn {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  locationPermission: PermissionState | "prompt";
  fetchWeatherByCoordinates: (lat: number, lng: number) => Promise<void>;
  fetchWeatherByLocation: (query: string) => Promise<void>;
  fetchWeatherByCurrentLocation: () => Promise<void>;
  clearError: () => void;
  clearWeatherData: () => void;
}
