export default interface WeatherData {
    location: string; // Ubicación, como "Guayaquil - Ecuador"
    temperatureK: number; // Temperatura en Kelvin
    condition: string; // Condición climática, como "Soleado"
    windSpeed: number; // Velocidad del viento en m/s
    windDirection: string; // Dirección del viento, como "NE"
    visibility: number; // Visibilidad en metros
    lastUpdated: string; // Fecha y hora de la última actualización, formato ISO
  }
  