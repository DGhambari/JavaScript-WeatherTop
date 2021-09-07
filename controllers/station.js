"use strict";

const logger = require("../utils/logger");
const stationStore = require("../models/station-store");
const analytics = require("../utils/Analytics");
const conversion = require("../utils/Conversion");
const uuid = require("uuid");

const station = {
  index(request, response) {
    const stationId = request.params.id;
    // logger.debug("Station id = ", stationId);
    const station = stationStore.getStation(stationId);
    const lastReading = station.readings[station.readings.length-1];
    // const windChill = analytics.windChill(lastReading.temperature,lastReading.windSpeed);
    // const tempF = analytics.celsiusToFahrenheit(lastReading.temperature);
    // analytics.windChill(lastReading.temperature,lastReading.windSpeed);
    // const lastReading = station.readings.get(station.readings.size - 1);
    analytics.updateWeather(station);
    const viewData = {
      title: station.name + " Station",
      station: station,
      stationSummary : {
        readings: stationStore.getAllReadings(stationId),
        lastReading: lastReading,
        station: station,
        lat: request.body.lat,
        lng: request.body.lng,
        date: request.body.date,
        // windChill: analytics.windChill(lastReading.temperature,lastReading.windSpeed),
        // tempF: analytics.celsiusToFahrenheit(lastReading.temperature),
        // code: lastReading.code,
        // weatherCodes: conversion.weatherCodes(lastReading.code),
        // weatherCodeIcons: conversion.weatherCodeIcons(lastReading.code),


        // latestWeatherCondition: conversion.weatherCodes(station.readings.code),
        // weatherCodeIcon: conversion.weatherCodeIcons(station.readings.code),
        // test: conversion.weatherCodeIcons(station.readings.code),
        // beaufort: conversion.beaufort(50),
      },

    };
    // analytics.updateWeather();
    console.log(viewData);
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
  }
};

module.exports = station;
