// Format temperature display
export const formatTemperature = (temp: number | null | undefined): string => {
  if (temp === null || temp === undefined) return "N/A";
  return `${Math.round(temp)}°F`;
};

// Format date and time
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
};

export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// Get weather icon based on forecast text
export const getWeatherIcon = (forecast: string | undefined): string => {
  if (!forecast) return "☀️";

  const text = forecast.toLowerCase();

  if (text.includes("sunny") || text.includes("clear")) return "☀️";
  if (text.includes("partly cloudy") || text.includes("partly sunny"))
    return "⛅";
  if (text.includes("cloudy") || text.includes("overcast")) return "☁️";
  if (text.includes("rain") || text.includes("shower")) return "🌧️";
  if (text.includes("thunderstorm") || text.includes("storm")) return "⛈️";
  if (text.includes("snow") || text.includes("blizzard")) return "❄️";
  if (text.includes("fog") || text.includes("mist")) return "🌫️";
  if (text.includes("wind")) return "💨";
  if (text.includes("hot")) return "🔥";
  if (text.includes("cold") || text.includes("freeze")) return "🥶";

  return "🌤️"; // Default partly sunny
};

// Get alert severity color
export const getAlertSeverityColor = (severity: string | undefined): string => {
  switch (severity?.toLowerCase()) {
    case "extreme":
      return "#8B0000"; // Dark red
    case "severe":
      return "#FF4500"; // Orange red
    case "moderate":
      return "#FFA500"; // Orange
    case "minor":
      return "#FFD700"; // Gold
    default:
      return "#4A90E2"; // Blue
  }
};

// Get wind direction from degrees
export const getWindDirection = (
  degrees: number | null | undefined
): string => {
  if (degrees === null || degrees === undefined) return "N/A";

  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

// Format wind speed and direction
export const formatWind = (
  speed: string | undefined,
  direction: string | number | undefined
): string => {
  if (!speed) return "Calm";

  const windDir =
    typeof direction === "number" ? getWindDirection(direction) : direction;
  return `${speed} mph ${windDir || ""}`.trim();
};

// Determine if it's day or night based on forecast name
export const isDayTime = (forecastName: string | undefined): boolean => {
  if (!forecastName) return true;
  return !forecastName.toLowerCase().includes("night");
};

// Get background gradient based on weather conditions
export const getWeatherGradient = (
  forecast: string | undefined,
  isDay: boolean = true
): string => {
  if (!forecast)
    return isDay
      ? "linear-gradient(135deg, #74b9ff, #0984e3)"
      : "linear-gradient(135deg, #2d3436, #636e72)";

  const text = forecast.toLowerCase();

  if (text.includes("clear") || text.includes("sunny")) {
    return isDay
      ? "linear-gradient(135deg, #74b9ff, #0984e3)"
      : "linear-gradient(135deg, #2d3436, #636e72)";
  }
  if (text.includes("rain") || text.includes("storm")) {
    return "linear-gradient(135deg, #636e72, #2d3436)";
  }
  if (text.includes("snow")) {
    return "linear-gradient(135deg, #ddd, #74b9ff)";
  }
  if (text.includes("cloudy")) {
    return isDay
      ? "linear-gradient(135deg, #a29bfe, #6c5ce7)"
      : "linear-gradient(135deg, #2d3436, #636e72)";
  }

  return isDay
    ? "linear-gradient(135deg, #74b9ff, #0984e3)"
    : "linear-gradient(135deg, #2d3436, #636e72)";
};

// Truncate long text
export const truncateText = (
  text: string | undefined,
  maxLength: number = 100
): string => {
  if (!text || text.length <= maxLength) return text || "";
  return text.substring(0, maxLength) + "...";
};

// Format weather station information using API data
export const formatWeatherStation = (
  forecastOffice: string | undefined,
  cwa: string | undefined,
  officeDetails?: {
    name: string;
    address?: { addressLocality?: string; addressRegion?: string };
  }
): string => {
  if (!forecastOffice && !cwa) return "Unknown Station";

  // Use API data if available
  if (officeDetails?.name) {
    return `NWS ${officeDetails.name}`;
  }

  // Fallback to forecast office code if API data not available
  if (forecastOffice) {
    return `NWS ${forecastOffice.toUpperCase()}`;
  } else {
    return `NWS ${cwa?.toUpperCase()}`;
  }
};
