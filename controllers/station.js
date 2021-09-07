"use strict";

const logger = require("../utils/logger");
const stationStore = require("../models/station-store");
const analytics = require("../utils/Analytics");
const conversion = require("../utils/Conversion");
const reading = require("../controllers/reading")
const uuid = require("uuid");

const station = {
  index(request, response) {
    const stationId = request.params.id;
    // logger.debug("Station id = ", stationId);
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
    }

    const viewData = {
      title: station.name + " Station",
      station: station,
      summary : {
        // readings: stationStore.getAllReadings(stationId),
        // lastReading: station.lastReading,
        // station: station,
        // windChill: station.windChill,
        // tempF: analytics.celsiusToFahrenheit(lastReading.temperature),
        // code: lastReading.code,
        // weatherCodes: conversion.weatherCodes(lastReading.code),
        // weatherCodeIcons: conversion.weatherCodeIcons(lastReading.code),
        // beaufort: conversion.beaufort(lastReading.windSpeed),
        // degreesToCompass: conversion.degreesToCompass(lastReading.windDirection),
        // pressure: lastReading.pressure,
        // maxTemp: analytics.maxTemp(station.readings),
        // minTemp: analytics.minTemp(station.readings),
        // maxWind: analytics.maxWind(station.readings),
        // minWind: analytics.minWind(station.readings),
        // maxPressure: analytics.maxPressure(station.readings),
        // minPressure: analytics.minPressure(station.readings),
      },
    };
    response.render("station", viewData);
    console.log(viewData);
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

  // update(request, response) {
  //   const stationId = request.params.id;
  //   const readingId = request.params.readingid;
  //   const reading = stationStore.getReading(stationId, readingId)
  //   const station = stationStore.getStation(stationId);
  //   const lastReading = station.readings[station.readings.length-1];
  //   const newStation = {
  //     code: request.station.code,
  //     temperature: request.readings.temperature,
  //     windSpeed: request.body.windSpeed,
  //     windDirection: request.body.windDirection,
  //     pressure: request.body.pressure,
  //     readings: stationStore.getAllReadings(stationId),
  //     lastReading: lastReading,
  //     station: station,
  //     windChill: analytics.windChill(lastReading.temperature,lastReading.windSpeed),
  //     tempF: analytics.celsiusToFahrenheit(lastReading.temperature),
  //     latestcode: lastReading.code,
  //     weatherCodes: conversion.weatherCodes(lastReading.code),
  //     weatherCodeIcons: conversion.weatherCodeIcons(lastReading.code),
  //     beaufort: conversion.beaufort(lastReading.windSpeed),
  //     degreesToCompass: conversion.degreesToCompass(lastReading.windDirection),
  //     latestpressure: lastReading.pressure,
  //     maxTemp: analytics.maxTemp(station.readings),
  //     minTemp: analytics.minTemp(station.readings),
  //     maxWind: analytics.maxWind(station.readings),
  //     minWind: analytics.minWind(station.readings),
  //     maxPressure: analytics.maxPressure(station.readings),
  //     minPressure: analytics.minPressure(station.readings),
  //   };
  //   stationStore.updateStation(station, newStation);
  //   response.redirect("/station/" + stationId);
  // },
};

module.exports = station;
