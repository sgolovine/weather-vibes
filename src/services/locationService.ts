import type { Coordinates, GeocodeResult } from "../types/weather";

class LocationService {
  async getCurrentPosition(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          let errorMessage = "Unable to retrieve location";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location access denied by user";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out";
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  // Simple geocoding using a free service for demo purposes
  async geocodeLocation(query: string): Promise<GeocodeResult[]> {
    try {
      // Using OpenStreetMap Nominatim API for geocoding (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&countrycodes=us&limit=5`
      );

      if (!response.ok) {
        throw new Error("Geocoding service unavailable");
      }

      const data = await response.json();

      if (data.length === 0) {
        throw new Error("Location not found");
      }

      return data.map((item: any) => ({
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        displayName: item.display_name,
        city: this.extractCity(item.display_name),
        state: this.extractState(item.display_name),
      }));
    } catch (error) {
      console.error("Geocoding error:", error);
      throw new Error("Failed to find location");
    }
  }

  extractCity(displayName: string): string {
    // Extract city from display name (format varies)
    const parts = displayName.split(",");
    return parts[0]?.trim() || "Unknown";
  }

  extractState(displayName: string): string {
    // Extract state from display name
    const parts = displayName.split(",");
    // Look for state abbreviation or name
    for (let i = parts.length - 2; i >= 0; i--) {
      const part = parts[i]?.trim();
      if (part && part.length === 2 && part.match(/^[A-Z]{2}$/)) {
        return part;
      }
    }
    return "Unknown";
  }

  // Validate coordinates are within US bounds (NWS API coverage)
  isValidUSCoordinates(lat: number, lng: number): boolean {
    // Rough US bounds including Alaska and Hawaii
    const minLat = 18.0; // Southern tip of Hawaii
    const maxLat = 71.5; // Northern Alaska
    const minLng = -179.0; // Western Alaska
    const maxLng = -66.0; // Eastern Maine

    return lat >= minLat && lat <= maxLat && lng >= minLng && lng <= maxLng;
  }
}

export default new LocationService();
