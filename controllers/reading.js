"use strict";

const logger = require("../utils/logger");
const stationStore = require("../models/station-store");
const uuid = require("uuid");

const reading = {
  index(request, response) {
    const stationId = request.params.id;
    const readingId = request.params.readingid;
    logger.debug(`Editing Reading ${readingId} from Station ${stationId}`);
    const viewData = {
      title: "Edit Reading",
      station: stationStore.getStation(stationId),
      reading: stationStore.getReading(stationId, readingId),
      readingSummary : {
        // lat: request.body.lat,
        // lng: request.body.lng,
        // temperature: request.body.temperature,
        // windSpeed: request.body.windSpeed,
        // windDirection: request.body.windDirection,
        // pressure: request.body.pressure,
        // latestWeatherCondition: request.body.latestWeatherCondition,
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

  // deleteReading(request, response) {
  //   const stationId = request.params.id;
  //   const readingId = request.params.readingid;
  //   logger.debug(`Deleting Reading ${readingId} from Station ${stationId}`);
  //   stationStore.removeReading(stationId, readingId);
  //   response.redirect("/station/" + stationId);
  // },

  // addReading(request, response) {
  //   const stationId = request.params.id;
  //   const station = stationStore.getStation(stationId);
  //   const newReading = {
  //     id: uuid.v1(),
  //     code: request.station.code,
  //     temperature: request.station.temperature,
  //     windSpeed: request.station.windSpeed,
  //     windDirection: request.station.windDirection,
  //     pressure: request.station.pressure,
  //   };
  //   logger.debug("New Reading = ", newReading);
  //   stationStore.addReading(stationId, newReading);
  //   response.redirect("/station/" + stationId);
  // }
};

module.exports = reading;
