import React, { useState, useEffect } from 'react';

interface WeatherData {
    location: string;
    temperatureK: number;
    condition: string;
    windSpeed: number;
    windDirection: string;
    visibility: number;
    lastUpdated: string;
}

interface WeatherDisplayProps {
    weatherData: WeatherData | null;
}

const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weatherData }) => {
    const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleString());

    // Actualizar el reloj cada segundo
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleString());
        }, 1000);

        // Limpiar el intervalo cuando el componente se desmonte
        return () => clearInterval(timer);
    }, []);

    if (!weatherData) {
        return <p>Cargando datos del clima...</p>;
    }

    const { temperatureK, condition, windSpeed, windDirection, visibility } = weatherData;
    const temperatureC = (temperatureK - 273.15).toFixed(2); // Convertir Kelvin a Celsius

    return (
        <div style={{ backgroundColor: '#e5e9f1', padding: '20px', borderRadius: '8px', width: '100%', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{color: '#34495e', fontWeight:'bold'}}>LA PERLA DEL PACÍFICO EN TIEMPO REAL</h2>
            <p><strong>Temperatura:</strong> {temperatureC} °C</p>
            <p><strong>Condición:</strong> {condition}</p>
            <p><strong>Viento:</strong> {windSpeed} m/s {windDirection}</p>
            <p><strong>Visibilidad:</strong> {visibility / 1000} km</p>
            <p>
                <strong>Última actualización:</strong> {currentTime}
                <br />
            </p>
        </div>
    );
};

export default WeatherDisplay;
