"use strict";

const logger = require("../utils/logger");
const axios = require("axios");
const stationStore = require('../models/station-store');
const accounts = require("./accounts.js");
const uuid = require("uuid");
const analytics = require("../utils/Analytics");
const conversion = require("../utils/Conversion");

const dashboard = {
  index(request, response) {
    const stationId = request.params.id;
    logger.info("dashboard rendering");
    const loggedInUser = accounts.getCurrentUser(request);
    const stations = stationStore.getUserStations(loggedInUser.id);
    for (let i = 0; i < stations.length; i++){
      if (stations[i].readings.length > 0){
        const lastReading = stations[i].readings[stations[i].readings.length-1];
        stations[i].code = lastReading.code;
        stations[i].temperature = lastReading.temperature;
        stations[i].windSpeed = lastReading.windSpeed;
        stations[i].windDirection = lastReading.windDirection;
        stations[i].pressure = lastReading.pressure;
        stations[i].windChill = analytics.windChill(lastReading.temperature,lastReading.windSpeed);
        stations[i].tempF = analytics.celsiusToFahrenheit(lastReading.temperature);
        stations[i].latestCode = lastReading.code;
        stations[i].weatherCodes = conversion.weatherCodes(lastReading.code);
        stations[i].weatherCodeIcons = conversion.weatherCodeIcons(lastReading.code);
        stations[i].beaufort = conversion.beaufort(lastReading.windSpeed);
        stations[i].degreesToCompass = conversion.degreesToCompass(lastReading.windDirection);
        stations[i].latestpressure = lastReading.pressure;
        stations[i].maxTemp = analytics.maxTemp(stations[i].readings);
        stations[i].minTemp = analytics.minTemp(stations[i].readings);
        stations[i].maxWind = analytics.maxWind(stations[i].readings);
        stations[i].minWind = analytics.minWind(stations[i].readings);
        stations[i].maxPressure = analytics.maxPressure(stations[i].readings);
        stations[i].minPressure = analytics.minPressure(stations[i].readings);
        stations[i].tempTrend = analytics.tempTrend(stations[i].readings);
        stations[i].windTrend = analytics.windTrend(stations[i].readings);
        stations[i].pressureTrend = analytics.pressureTrend(stations[i].readings);
        stations[i].tempIcon = analytics.tempIcon(lastReading.temperature);
      }
    }
    const viewData = {
      title: "WeatherTop",
      stations: stations,
      // readings: stationStore.getAllReadings(stationId),
      // summary: {
      //   temperature: request.body.temperature,
      //   windSpeed: request.body.windSpeed,
      //   windDirection: request.body.windDirection,
      //   pressure: request.body.pressure,
      // }
    };

    response.render("dashboard", viewData);
  },


  addStation(request, response) {
    const loggedInUser = accounts.getCurrentUser(request);
    const newStation = {
      id: uuid.v1(),
      userid: loggedInUser.id,
      name: request.body.name,
      lat: request.body.lat,
      lng: request.body.lng,
      readings: []
    };
    logger.debug("Creating a new Station", newStation);
    stationStore.addStation(newStation);
    response.redirect("/dashboard");
  },

  deleteStation(request, response) {
    const stationId = request.params.id;
    logger.debug(`Deleting Station ${stationId}`);
    stationStore.removeStation(stationId);
    response.redirect("/dashboard");
  },

};

module.exports = dashboard;
