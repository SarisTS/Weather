import { React, useEffect, useState } from 'react';
import './App.css'
// Images
import search_icon from './assets/search.png'
import humidity_icon from './assets/humidity.png'
import wind_icon from './assets/wind_icon.png'
import clear from './assets/clear.png'
import sun_cloud from './assets/sun_cloud.png'
import cloudy from './assets/cloudy.png'
import broken_clouds from './assets/broken_clouds.png'
import drizzle from './assets/drizzle.png'
import rainy_cloud from './assets/rainycloud.png'
import snow from './assets/snow.png'
import thunderstorm from './assets/thunderstorm.png'
import mist from './assets/mist.png'

console.log(import.meta.env.VITE_API_KEY);


const WeatherApp = ({temp, des,  city, country, lat, lon, humidity, wind, icon})=>{
  return(
    <>
    <div className='data'>
      <div className='image'><img src={icon} alt="" /></div>
      <div className='weather_data'>
        <p className='temp'>{temp}°C</p>
        <p className='description'>{des}</p>
        <p className='country'>{city} ({country})</p>
      </div>
      <div className='location'>
        <div className='lat'>
          <span>Latitude</span>
          <span>{lat}</span>
        </div>
        <div className='lon'>
          <span>Longitude</span>
          <span>{lon}</span>
        </div>
      </div>
      <div className='wind_humidity'>
        <div className='humidity'>
          <img src={humidity_icon} alt="Humidity_Icon" />
          <p className='humidity_text'>Humidity</p>
          <p className='percentage'>{humidity} %</p>
        </div>
        <div className='wind'>
          <img src={wind_icon} alt="Wind_Icon" />
          <p className='wind_text'>Wind</p>
          <p className='speed'>{wind} Kmph</p>
        </div>
      </div>
    </div>
    </>
  )
}

function App(){
  const [data, setData]= useState({text : "Coimbatore", icon: clear, temp:0, des:"Haze", city:"Chennai", country:"IN", lat:0, lon:0, humidity:0, wind:0})
  const [loading, setLoading] = useState(false)
  const [cityNotFound, setCityNotFound] = useState(false)

  const weatherDataIcon = {
    "01d": clear, "01n": clear, "02d": sun_cloud, "02n": sun_cloud, "03d": cloudy, "03n": cloudy,
    "04d": broken_clouds, "04n": broken_clouds, "09d": drizzle, "09n": drizzle,
    "10d": rainy_cloud, "10n": rainy_cloud, "11d": thunderstorm, "11n": thunderstorm,
    "13d": snow, "13n": snow, "50d": mist, "50n": mist,
  }

  const search = async ()=>{
    setCityNotFound(false)
    setLoading(true)
    const apikey = import.meta.env.VITE_API_KEY;
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(data.text)}&appid=${apikey}&units=metric`
    let fetchData = await fetch(url)
    let response = await fetchData.json()
    console.log(response);
    try{
      if(response.cod === "404"){
        setCityNotFound(true)
        return;
      }
      setData({...data,
        icon:weatherDataIcon[response.weather[0].icon],
        temp:Math.floor(response.main.temp),
        des:response.weather[0].main,
        city:response.name,
        country:response.sys.country,
        lat:response.coord.lat,
        lon:response.coord.lon,
        humidity:response.main.humidity,
        wind:response.wind.speed})
    }catch(error){
      console.log("Error", error);
    }finally{
      setLoading(false)
    }
    }

  const handleText = (e)=>{
    setData({...data, text:e.target.value})
  }

  const handleWeather = (e)=>{
    if(e.key === "Enter"){
      search()
    }

  }
  useEffect(()=>{
    search()
  },[])

  return(
    <>
    <div className='container'>
      <h2 className='heading'>Weather App</h2>
      <div className='input_search'>
        <input type="text" placeholder='Enter  a  city' onChange={handleText} onKeyUp={handleWeather}/>
        <img src={search_icon} alt="" onClick={()=>{search()}}/>
      </div>
      {loading && !cityNotFound && <p className='loading'>Loading...</p>}
      {cityNotFound && !loading && <p className='citynotfound'>City Not Found...</p>}
      {!loading && !cityNotFound && <WeatherApp temp={data.temp} des={data.des} city={data.city} country={data.country} lat={data.lat} lon={data.lon} humidity={data.humidity} wind={data.wind} icon={data.icon} />}
      
    </div>
    </>
  )
}

export default App