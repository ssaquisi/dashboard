import Item from './interface/Item';
import LineChartData from './interface/LineChartData';
import IndicatorWeather from './components/IndicatorWeather';
import TableWeather from './components/TableWeather';
import ControlWeather from './components/ControlWeather';
import LineChartWeather from './components/LineChartWeather';
import DrawerAppBar from './components/DrawerAppBar';
import Grid from '@mui/material/Grid2'
import './App.css'

{/* Hooks */ }
import { useEffect, useState } from 'react';

interface Indicator {
  title?: String;
  subtitle?: String;
  value?: String;
}

function App() {

  {/* Variable de estado y función de actualización */ }
  let [indicators, setIndicators] = useState<Indicator[]>([])
  let [owm, setOWM] = useState(localStorage.getItem("openWeatherMap"))
  let [items, setItems] = useState<Item[]>([]);
  let [chartData, setChartData] = useState<LineChartData | null>(null);
  let [selectedVariable, setSelectedVariable] = useState<number>(-1);



  {/* Hook: useEffect */ }
  useEffect(() => {

    let request = async () => {

      {/* Referencia a las claves del LocalStorage: openWeatherMap y expiringTime */ }
      let savedTextXML = localStorage.getItem("openWeatherMap") || "";
      let expiringTime = localStorage.getItem("expiringTime");

      {/* Obtenga la estampa de tiempo actual */ }
      let nowTime = (new Date()).getTime();


      {/* Verifique si es que no existe la clave expiringTime o si la estampa de tiempo actual supera el tiempo de expiración */ }
      if (expiringTime === null || nowTime > parseInt(expiringTime)) {
        {/* Request */ }
        let API_KEY = "374aa7dde23ce8eda9fb21c8050457fc"
        let response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=Guayaquil&mode=xml&appid=${API_KEY}`)
        let savedTextXML = await response.text();

        {/* Tiempo de expiración */ }
        let hours = 0.01
        let delay = hours * 3600000
        let expiringTime = nowTime + delay


        {/* En el LocalStorage, almacene el texto en la clave openWeatherMap, estampa actual y estampa de tiempo de expiración */ }
        localStorage.setItem("openWeatherMap", savedTextXML)
        localStorage.setItem("expiringTime", expiringTime.toString())
        localStorage.setItem("nowTime", nowTime.toString())

        {/* DateTime */ }
        localStorage.setItem("expiringDateTime", new Date(expiringTime).toString())
        localStorage.setItem("nowDateTime", new Date(nowTime).toString())

        {/* Modificación de la variable de estado mediante la función de actualización */ }
        setOWM(savedTextXML)
      }

      {/* Valide el procesamiento con el valor de savedTextXML */ }
      if (savedTextXML) {
        const parser = new DOMParser();
        const xml = parser.parseFromString(savedTextXML, "application/xml");

        {/* Arreglo para agregar los resultados */ }
        let dataToIndicators: Indicator[] = new Array<Indicator>();
        let dataToItems: Item[] = new Array<Item>();
        let dataToChartData: LineChartData = {
          xDays: [],
          precipitation: [],
          humidity: [],
          clouds: [],
        };

        {/* 
           Análisis, extracción y almacenamiento del contenido del XML 
           en el arreglo de resultados
       */}

        let name = xml.getElementsByTagName("name")[0].innerHTML || ""
        dataToIndicators.push({ "title": "Ciudad", "subtitle": "City", "value": name })

        let location = xml.getElementsByTagName("location")[1]

        let latitude = location.getAttribute("latitude") || ""
        dataToIndicators.push({ "title": "Latitud", "subtitle": "Latitude", "value": latitude })

        let longitude = location.getAttribute("longitude") || ""
        dataToIndicators.push({ "title": "Longitud", "subtitle": "Longitude", "value": longitude })

        let altitude = location.getAttribute("altitude") || ""
        dataToIndicators.push({ "title": "Altitud", "subtitle": "Altitude", "value": altitude })

        //console.log( dataToIndicators )
        const dailyData: Record<string, {
          precipitation: number[];
          humidity: number[];
          clouds: number[];
        }> = {};

        let times = xml.getElementsByTagName("time");

        // Para los datos del gráfico
        for (let i = 0; i < times.length; i++) {
          let time = times[i];
          let precipitation = time.getElementsByTagName("precipitation")[0]?.getAttribute("probability") || "";
          let humidity = time.getElementsByTagName("humidity")[0]?.getAttribute("value") || "";
          let clouds = time.getElementsByTagName("clouds")[0]?.getAttribute("all") || "";

          const from2 = time.getAttribute('from')?.split('T') || "N/A";
          const date = from2[0];
          if (date && !dailyData[date]) {
            dailyData[date] = { precipitation: [], humidity: [], clouds: [] };
          }
          dailyData[date].precipitation.push(precipitation ? parseFloat(precipitation) * 100 : 0);
          dailyData[date].humidity.push(humidity ? parseFloat(humidity) : 0);
          dailyData[date].clouds.push(clouds ? parseFloat(clouds) : 0);

        }

        // Para extraer los datos de los elementos que nos piden y la cantidad de 6 en la tabla

        for (let i = 0; i < Math.min(6, times.length); i++) {
          let time = times[i];
          let from = time.getAttribute("from") || "";
          let to = time.getAttribute("to") || "";
          let precipitation = time.getElementsByTagName("precipitation")[0]?.getAttribute("probability") || "";
          let humidity = time.getElementsByTagName("humidity")[0]?.getAttribute("value") || "";
          let clouds = time.getElementsByTagName("clouds")[0]?.getAttribute("all") || "";

          const from2 = time.getAttribute('from')?.split('T') || "N/A";
          const date = from2[0];
          if (date && !dailyData[date]) {
            dailyData[date] = { precipitation: [], humidity: [], clouds: [] };
          }

          const formatTime = (timeString: string | number | Date) => {
            const date = new Date(timeString);
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
          };

          let fromFormat = formatTime(from);
          let toFormat = formatTime(to);

          let item: Item = {
            dateStart: fromFormat,
            dateEnd: toFormat,
            precipitation: precipitation,
            humidity: humidity,
            clouds: clouds
          };

          dataToItems.push(item);
        };

        for (const [date, data] of Object.entries(dailyData)) {
          dataToChartData.xDays.push(new Date(date).toLocaleDateString()); // Format as DD/MM
          dataToChartData.precipitation.push(data.precipitation.reduce((a, b) => a + b, 0) / data.precipitation.length);
          dataToChartData.humidity.push(data.humidity.reduce((a, b) => a + b, 0) / data.humidity.length);
          dataToChartData.clouds.push(data.clouds.reduce((a, b) => a + b, 0) / data.clouds.length);
        }


        {/* Modificación de la variable de estado mediante la función de actualización */ }
        setIndicators(dataToIndicators);
        setItems(dataToItems);
        setChartData(dataToChartData);


      }
    }

    request();

  }, [owm])

  let handleVariableChange = (selectedIdx: number) => {
    setSelectedVariable(selectedIdx);
  };

  let renderIndicators = () => {

    return indicators.map((indicator, idx) => (
      <Grid key={idx} size={{ xs: 12, xl: 3 }}>
        <IndicatorWeather
          title={indicator["title"]}
          subtitle={indicator["subtitle"]}
          value={indicator["value"]} />
      </Grid>
    )
    )

  }


  {/* JSX */ }
  return (
    <div className="App" id='Principal' style={{backgroundColor:'#fff'}}>
      <DrawerAppBar />
      <div><h1 id="Titulos"> INFORMACIÓN GEOGRÁFICA</h1></div>
      <Grid container spacing={5} sx={{ justifyContent: 'center', alignItems: 'center' }}>
        

        {/* Indicadores */}
        {renderIndicators()}


        <div id='Zona Metereológica'>
          <h1 id="Titulos"> ZONA METEOROLÓGICA</h1>
        </div>

          {/* Grafico */}
          <Grid container spacing={2} sx={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center'
          }}>

            <Grid size={{ xs: 12, xl: 3 }}>
              <ControlWeather onVariableChange={handleVariableChange} />
            </Grid>
            <Grid size={{ xs: 12, xl: 9 }}>
              {chartData && (
                <LineChartWeather chartData={chartData} selectedVariable={selectedVariable} />
              )}
            </Grid>
          </Grid>
        

        <div>
          <h1 id="Titulos"> PREDICCIONES METEOROLÓGICAS</h1>
        </div>

        {/* Tabla */}
        <TableWeather itemsIn={items} />

      </Grid>
    </div>
  )
}

export default App
