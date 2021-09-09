"use strict";

const logger = require("../utils/logger");
const stationStore = require("../models/station-store");

const reading = {
  index(request, response) {
    const stationId = request.params.id;
    const viewData = {
      title: "Edit Reading",
      station: stationStore.getStation(stationId),
      reading: stationStore.getAllReadings(stationId),
      readingSummary : {
        lat: request.body.lat,
        lng: request.body.lng,
        date: request.body.date,
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
