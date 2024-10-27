import { weather_res_type } from '@src/@types/typeWeather';
import WEATHER_URL from '@src/constants/WEATHER_URL';
import useRequest from '@src/utils/request';
const baseURL = WEATHER_URL.BASE_URL;
const key = import.meta.env.VITE_WEATHER_API_KEY;
// https://www.weatherapi.com/api-explorer.aspx
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getWeather = (city: string = 'guelph', data: Record<string, any> = {}) => {
  // http://api.weatherapi.com/v1/current.json?key=86ba2a18b77a44db88d33324242409&q=guelph&aqi=no
  return useRequest.get<weather_res_type>({
    baseURL,
    url: WEATHER_URL.GET_WEATHER,
    abortRepetitiveRequest: false,
    params: {
      key,
      q: city,
      aqi: 'yes',
      ...data,
    },
  });
};

export default {
  getWeather,
};
