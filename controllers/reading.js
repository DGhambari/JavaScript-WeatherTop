"use strict";

const logger = require("../utils/logger");
const stationStore = require("../models/station-store");
const uuid = require("uuid");
const analytics = require("../utils/Analytics");
// const station = require("../controllers/station");

const reading = {
  index(request, response) {
    const stationId = request.params.id;
    const readingId = request.params.readingid;
    const station = stationStore.getStation(stationId);
    let windChill = null;
    let celsiusToFahrenheit = analytics.celsiusToFahrenheit(20);
    // logger.debug(`Editing Reading ${readingId} from Station ${stationId}`);
    console.log(celsiusToFahrenheit);
    if (station.readings.size > 0){
      // windChill = analytics.windChill(10,15);
      // latestWeatherCondition = Conversion.weatherCodes(reading.code),

    }
    // windChill = analytics.windChill(10,15);
    const viewData = {
      title: "Edit Reading",
      station: stationStore.getStation(stationId),
      reading: stationStore.getAllReadings(stationId),
      readingSummary : {
        lat: request.body.lat,
        lng: request.body.lng,
        date: request.body.date,
        // windChill: windChill,
        celsiusToFahrenheit: celsiusToFahrenheit,

      }
    };
    response.render("reading", viewData);
  },

  update(request, response) {
    const stationId = request.params.id;
    const readingId = request.params.readingid;
    const reading = stationStore.getReading(stationId, readingId)
    const newReading = {
      code: request.station.code,
      temperature: request.readings.temperature,
      windSpeed: request.body.windSpeed,
      windDirection: request.body.windDirection,
      pressure: request.body.pressure,
    };
    logger.debug(`Updating Reading ${readingId} from Station ${stationId}`);
    stationStore.updateReading(reading, newReading);
    response.redirect("/station/" + stationId);
  },

};

module.exports = reading;
