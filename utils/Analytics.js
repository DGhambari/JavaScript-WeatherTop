"use strict";

const conversion = require("../utils/Conversion");
const station = require("../controllers/station");
const analytics = require("../utils/Analytics");

const Analytics = {
  updateWeather(station) {
    if (station.readings.length > 0) {
      const lastReading = station.readings[station.reading.length - 1];
      station.code = lastReading.code;
      station.weather = conversion.weatherCodes(lastReading.code);
      station.tempC = lastReading.temperature;
      station.tempF = analytics.celsiusToFahrenheit(lastReading.temperature);
      station.maxTemp = Analytics.maxTemp(station.readings);
      station.minTemp = Analytics.minTemp(station.readings);
      station.tempTrend = Analytics.tempTrend(station.readings);

      station.windBft = conversion.beaufort(lastReading.windSpeed);
      station.maxWind = Analytics.maxWind(station.reading);
      station.minWind = Analytics.minWind(station.readings);
      // station.windTrend = Analytics.windTrend(station.readings);

      station.windChill = analytics.windChill(lastReading.temperature,lastReading.windSpeed),
      station.windCompass = conversion.degreesToCompass(lastReading.windDirection);

      station.pressure = lastReading.pressure;
      station.maxPressure = Analytics.maxPressure(station.readings);
      station.minPressure = Analytics.minPressure(station.readings);
      station.pressureTrend = Analytics.pressureTrend(station.readings);
      console.log(lastReading);
    }
  },

  windChill(temp, windSpeed) {
    return 13.12 + 0.6215 * temp -  11.37 * (Math.pow(windSpeed, 0.16)) + 0.3965 * temp * (Math.pow(windSpeed, 0.16));
  },

  getMax(values) {
    let max = values[0];
    for (let i = 0; i < values.length; i++) {
      if (values[i] > max) {
        max = value[i];
      }
    }
    return max;
  },

  getMin(values) {
    let min = values[0];
    for (let i = 0; i < values.length; i++) {
      if (values[i] < min) {
        min = value[i];
      }
    }
    return min;
  },

  celsiusToFahrenheit(temperature){
    return ((temperature * (1.8)) + 32);
  },

  setDate(){
    let today = new Date().toLocaleDateString();
    console.log(today);
    return today;
  },

  getMaxTemp(readings){
    let values = [readings.length]
  }

};

module.exports = Analytics;
