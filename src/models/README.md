# Models

This directory contains code for models provided by this app.

//External API call add into any controller to call the remove services
@get('/weather/{lat}/{lon}')
async getWeatherData(
@param.path.number('lat') lat: number,
@param.path.number('lon') lon: number,
) {
try {
return await this.weatherServiceProvider.getWeather(lat, lon);
} catch (error) {
return ResponseHelper.error(HTTP_STATUS.BAD_REQUEST, error.message);
}
}
