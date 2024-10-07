import WEATHER_URL from '@src/constants/WEATHER_URL';
import useRequest from '@src/utils/request';
const baseURL = WEATHER_URL.BASE_URL;
const key = import.meta.env.VITE_WEATHER_API_KEY;
const getWeatherABB = (city: string = 'guelph') => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useRequest.get<any>({
    baseURL,
    url: WEATHER_URL.GET_WEATHER,
    params: {
      key,
      q: city,
      aqi: 'no',
    },
  });
};

export default {
  getWeatherABB,
};
