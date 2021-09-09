"use strict";

const logger = require("../utils/logger");
const stationStore = require("../models/station-store");
const analytics = require("../utils/Analytics");
const conversion = require("../utils/Conversion");
const reading = require("../controllers/reading")
const uuid = require("uuid");
const axios = require("axios");
const accounts = require("./accounts.js");

const station = {
  index(request, response) {
    const stationId = request.params.id;
    const station = stationStore.getStation(stationId);
    const lastReading = station.readings[station.readings.length-1];
    if (station.readings.length > 0) {
      station.code = lastReading.code;
      station.temperature = lastReading.temperature;
      station.windSpeed = lastReading.windSpeed;
      station.windDirection = lastReading.windDirection;
      station.pressure = lastReading.pressure;
      station.windChill = analytics.windChill(lastReading.temperature,lastReading.windSpeed);
      station.tempF = analytics.celsiusToFahrenheit(lastReading.temperature);
      station.latestCode = lastReading.code;
      station.weatherCodes = conversion.weatherCodes(lastReading.code);
      station.weatherCodeIcons = conversion.weatherCodeIcons(lastReading.code);
      station.beaufort = conversion.beaufort(lastReading.windSpeed);
      station.degreesToCompass = conversion.degreesToCompass(lastReading.windDirection);
      station.latestpressure = lastReading.pressure;
      station.maxTemp = analytics.maxTemp(station.readings);
      station.minTemp = analytics.minTemp(station.readings);
      station.maxWind = analytics.maxWind(station.readings);
      station.minWind = analytics.minWind(station.readings);
      station.maxPressure = analytics.maxPressure(station.readings);
      station.minPressure = analytics.minPressure(station.readings);
      station.tempTrend = analytics.tempTrend(station.readings);
      station.windTrend = analytics.windTrend(station.readings);
      station.pressureTrend = analytics.pressureTrend(station.readings);
      station.tempIcon = analytics.tempIcon(lastReading.temperature);
    }
    const viewData = {
      title: station.name + " Station",
      station: station,
    };
    response.render("station", viewData);
  },

  async addReport(request, response) {
    logger.info("rendering new report");
    const loggedInUser = accounts.getCurrentUser(request);
    let report = {};
    const lat = request.body.lat;
    const lng = request.body.lng;
    const requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&units=metric&appid=23ebcf57b5cb28f316d20cd159a44860`
    const result = await axios.get(requestUrl);
    if (result.status == 200) {
      const reading = result.data.current;
      report.lat = request.body.lat;
      report.lng = request.body.lng;
      report.code = reading.weather[0].id;
      report.temperature = reading.temp;
      report.windSpeed = reading.wind_speed;
      report.pressure = reading.pressure;
      report.windDirection = reading.wind_deg;
      report.tempTrend = [];
      report.windTrend = [];
      report.pressureTrend = [];
      report.trendLabels = [];
      const trends = result.data.daily;
      for (let i=0; i<trends.length; i++) {
        report.tempTrend.push(trends[i].temp.day);
        report.windTrend.push(trends[i].wind_speed);
        // Removed pressure as it does not display well with the other readings
        // report.pressureTrend.push(trends[i].pressure);
        const date = new Date(trends[i].dt * 1000);
        report.trendLabels.push(`${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`);
      }
    }
    const viewData = {
      title: "Weather Report",
      reading: report
    };
    response.render("station", viewData);
  },

  deleteReading(request, response) {
    const stationId = request.params.id;
    const readingId = request.params.readingid;
    logger.debug(`Deleting Reading ${readingId} from Station ${stationId}`);
    stationStore.removeReading(stationId, readingId);
    response.redirect("/station/" + stationId);
  },

  addReading(request, response) {
    const stationId = request.params.id;
    const station = stationStore.getStation(stationId);
    let date = analytics.setDate();
    const newReading = {
      id: uuid.v1(),
      code: request.body.code,
      temperature: request.body.temperature,
      windSpeed: request.body.windSpeed,
      windDirection: request.body.windDirection,
      pressure: request.body.pressure,
      date: date,
    };
    logger.debug("New Reading = ", newReading);
    stationStore.addReading(stationId, newReading);
    response.redirect("/station/" + stationId);
  },
};

module.exports = station;
