import Api from '@src/Api';
import { useEffect, useState } from 'react';
type CityWeatherProps = {
  city?: string; // default value is guelph
};
const CityWeather = (props: CityWeatherProps): JSX.Element => {
  const { city } = props;
  const [currentWeather, setCurrentWeather] = useState<string>('...');
  const [airIconUrl, setAirIconUrl] = useState<string>('');
  useEffect(() => {
    Api.weatherApi.getWeather(city).then((res) => {
      const { location, current, air_quality } = res;
      const weather = `${current.condition?.text} ${current.temp_c}°C ${location.region} ${location.name} ${location.country} ${air_quality?.pm2_5 ? 'Air:' + air_quality.pm2_5 : ''}`;
      setCurrentWeather(weather);
      setAirIconUrl(current.condition?.icon ?? '');
    });
  }, [city]);
  return (
    <div className="flex items-center justify-center">
      {airIconUrl && <img className="h-8 w-8" src={`https:${airIconUrl}`} alt="air_icon" />}
      <span className="inline-block px-4 text-white">{currentWeather}</span>
    </div>
  );
};
export default CityWeather;
