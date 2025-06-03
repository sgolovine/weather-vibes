import type {
  WeatherData,
  ForecastPeriod,
  WeatherAlert,
  NWSLocationData,
  WeatherStationDetails,
  NWSObservationStationsResponse,
  NWSOfficeDetails,
  Coordinates,
} from "../types/weather";

const BASE_URL = "https://api.weather.gov";

class WeatherService {
  async getLocationData(lat: number, lng: number): Promise<NWSLocationData> {
    try {
      const response = await fetch(`${BASE_URL}/points/${lat},${lng}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.properties;
    } catch (error) {
      console.error("Error fetching location data:", error);
      throw new Error("Failed to get location data from NWS");
    }
  }

  async getForecast(forecastUrl: string): Promise<ForecastPeriod[]> {
    try {
      const response = await fetch(forecastUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.properties.periods;
    } catch (error) {
      console.error("Error fetching forecast:", error);
      throw new Error("Failed to get forecast data");
    }
  }

  async getHourlyForecast(
    hourlyForecastUrl: string
  ): Promise<ForecastPeriod[]> {
    try {
      const response = await fetch(hourlyForecastUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.properties.periods.slice(0, 24); // Get next 24 hours
    } catch (error) {
      console.error("Error fetching hourly forecast:", error);
      throw new Error("Failed to get hourly forecast data");
    }
  }

  async getWeatherAlerts(lat: number, lng: number): Promise<WeatherAlert[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/alerts/active?point=${lat},${lng}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.features;
    } catch (error) {
      console.error("Error fetching weather alerts:", error);
      // Don't throw error for alerts as they're not critical
      return [];
    }
  }

  // Calculate distance between two coordinates in miles
  private calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 3959; // Earth's radius in miles
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async getNearbyWeatherStations(
    lat: number,
    lng: number
  ): Promise<WeatherStationDetails[]> {
    try {
      // First get the location data to get the observation stations URL
      const locationData = await this.getLocationData(lat, lng);

      // Fetch the observation stations
      const response = await fetch(locationData.observationStations);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: NWSObservationStationsResponse = await response.json();

      // Transform the data and calculate distances
      const stations: WeatherStationDetails[] = data.features
        .map((feature) => {
          const [lng_station, lat_station] = feature.geometry.coordinates;
          const distance = this.calculateDistance(
            lat,
            lng,
            lat_station,
            lng_station
          );

          return {
            id: feature.properties.stationIdentifier,
            name: feature.properties.name,
            stationIdentifier: feature.properties.stationIdentifier,
            timeZone: feature.properties.timeZone,
            coordinates: {
              lat: lat_station,
              lng: lng_station,
            },
            elevation: feature.properties.elevation,
            county: feature.properties.county,
            state: feature.properties.state,
            distance: distance,
          };
        })
        .sort((a, b) => (a.distance || 0) - (b.distance || 0)) // Sort by distance
        .slice(0, 10); // Get closest 10 stations

      return stations;
    } catch (error) {
      console.error("Error fetching nearby weather stations:", error);
      throw new Error("Failed to get nearby weather stations");
    }
  }

  async getWeatherStationDetails(
    stationId: string
  ): Promise<WeatherStationDetails | null> {
    try {
      const response = await fetch(`${BASE_URL}/stations/${stationId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const properties = data.properties;
      const [lng_station, lat_station] = data.geometry.coordinates;

      return {
        id: properties.stationIdentifier,
        name: properties.name,
        stationIdentifier: properties.stationIdentifier,
        timeZone: properties.timeZone,
        coordinates: {
          lat: lat_station,
          lng: lng_station,
        },
        elevation: properties.elevation,
        county: properties.county,
        state: properties.state,
      };
    } catch (error) {
      console.error("Error fetching weather station details:", error);
      return null;
    }
  }

  async getOfficeDetails(officeUrl: string): Promise<NWSOfficeDetails | null> {
    try {
      const response = await fetch(officeUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log("office data: ", data);

      const properties = data.properties;

      return {
        id: properties["@id"] || properties.id,
        name: properties.name,
        address: {
          streetAddress: properties.address?.streetAddress || "",
          addressLocality: properties.address?.addressLocality || "",
          addressRegion: properties.address?.addressRegion || "",
          postalCode: properties.address?.postalCode || "",
        },
        telephone: properties.telephone || "",
        faxNumber: properties.faxNumber || "",
        email: properties.email || "",
        sameAs: properties.sameAs || "",
        nwsRegion: properties.nwsRegion || "",
        parentOrganization: properties.parentOrganization || "",
        responsibleCounties: properties.responsibleCounties || [],
        responsibleForecastZones: properties.responsibleForecastZones || [],
        responsibleFireZones: properties.responsibleFireZones || [],
        approvedObservationStations:
          properties.approvedObservationStations || [],
      };
    } catch (error) {
      console.error("Error fetching office details:", error);
      return null;
    }
  }

  async getCompleteWeatherData(lat: number, lng: number): Promise<WeatherData> {
    try {
      // Step 1: Get location data and grid info
      const locationData = await this.getLocationData(lat, lng);

      // Step 2: Get forecast data and office details
      const [forecast, hourlyForecast, alerts, officeDetails] =
        await Promise.all([
          this.getForecast(locationData.forecast),
          this.getHourlyForecast(locationData.forecastHourly),
          this.getWeatherAlerts(lat, lng),
          this.getOfficeDetails(locationData.forecastOffice),
        ]);

      return {
        location: {
          city: locationData.relativeLocation?.properties?.city || "Unknown",
          state: locationData.relativeLocation?.properties?.state || "Unknown",
          coordinates: { lat, lng },
        },
        station: {
          forecastOffice: locationData.forecastOffice,
          cwa: locationData.cwa,
          gridId: locationData.gridId,
          radarStation: locationData.radarStation,
          timeZone: locationData.timeZone,
        },
        officeDetails: officeDetails || undefined,
        current: forecast[0], // First period is current/today
        forecast: forecast.slice(1, 8), // Next 7 periods
        hourly: hourlyForecast,
        alerts: alerts,
      };
    } catch (error) {
      console.error("Error getting complete weather data:", error);
      throw error;
    }
  }
}

export default new WeatherService();
