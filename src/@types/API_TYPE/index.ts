export interface WeatherApi {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getWeather: (city?: string) => Promise<any>; // Define the expected API function
}

export interface OtherApi {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getWeatherABB: (city?: string) => Promise<any>; // Define another function
}

// Union type for API modules
type ApiModules = {
  WeatherApi: WeatherApi;
  OtherApi: OtherApi;
};

export default ApiModules;
