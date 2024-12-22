import Paper from '@mui/material/Paper';
import LineChartData from '../interface/LineChartData'
import { LineChart } from '@mui/x-charts/LineChart';
import { useEffect, useState } from 'react';

interface ChartWeatherProps{
    chartData: LineChartData | null;
    selectedVariable: number;
}

export default function LineChartWeather({chartData, selectedVariable} : ChartWeatherProps) {
    let [dataToShow, setDataToShow] = useState<{data: number[]; label: string}[]>([]);

    let items = [
        { name: "Todos" , key: "all"},
        { name: "Precipitación" , key: "precipitation"},
        { name: "Humedad (%)" , key: "humidity"},
        { name: "Nubosidad (%)", key: "clouds"}
    ];

    useEffect(() => {
        if(chartData){
            if(selectedVariable === -1 || selectedVariable === 0){
                // Este es el caso default del gráfico cuando no hay selección
                setDataToShow([
                    { data: chartData.precipitation, label: "Precipitación"},
                    { data: chartData.humidity, label: "Humedad (%)"},
                    { data: chartData.clouds, label: "Nubosidad (%)"}
                ]);
            } else{
                // Este es el caso donde se muestra solo la variable seleccionada
                let selectedItem = items[selectedVariable];
                if(selectedItem){
                    let variableData = chartData[selectedItem.key as keyof LineChartData];
                    // Verificando que el dato sea un array de números
                    if (Array.isArray(variableData) && typeof variableData[0] === 'number'){
                        setDataToShow([{ data: variableData as number[], label: selectedItem.name}]);
                    } else{
                        setDataToShow([]);
                    }
                }
            }
        }
    }, [selectedVariable, chartData]);

     return (
         <Paper
             sx={{ p: 2, display: 'flex', flexDirection: 'column'}}>

             {/* Componente para un gráfico de líneas */}
             <LineChart
                 width={700}
                 height={250}

                 series={dataToShow}
                 xAxis={[{ scaleType: 'point', data: chartData?.xDays || [] }]}
             />
         </Paper>
     );
 }