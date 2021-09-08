"use strict";

const _ = require("lodash");
const JsonStore = require("./json-store");
const analytics = require("../utils/Analytics");
const conversion = require("../utils/Conversion");

const stationStore = {
  store: new JsonStore("./models/station-store.json", {
    stationCollection: []
  }),
  collection: "stationCollection",

  getAllStations() {
    return this.store.findAll(this.collection);
  },

  getStation(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getUserStations(userid) {
    let stations = this.store.findBy(this.collection, { userid: userid });
    const sortedStations = _.sortBy(stations, o => o.name)
    return sortedStations
  },

  addStation(station) {
    this.store.add(this.collection, station);
    this.store.save();
  },

  removeStation(id) {
    const station = this.getStation(id);
    this.store.remove(this.collection, station);
    this.store.save();
  },

  removeAllStations() {
    this.store.removeAll(this.collection);
    this.store.save();
  },

  // addReading(id, reading) {
  //   const station = this.getStation(id);
  //   station.readings.push(reading);
  //
  //   let duration = 0;
  //   for (let i = 0; i < station.readings.length; i++) {
  //     duration += station.readings[i].duration;
  //   }
  //
  //   station.duration = duration;
  //   this.store.save();
  // },

  addReading(id, reading) {
    const station = this.getStation(id);
    station.readings.push(reading);
    let code, temp, windSpeed, windDirection, pressure = 0;

    for (let i = 0; i < station.readings.length; i++) {
      code += station.readings[i].code;
      temp += station.readings[i].temp;
      windSpeed += station.readings[i].windSpeed;
      windDirection += station.readings[i].windDirection;
      pressure += station.readings[i].pressure;
    }
    station.code = code;
    station.temperature = temp;
    station.windSpeed = windSpeed;
    station.windDirection = windDirection;
    station.pressure = pressure;
    this.store.save();
  },

  removeReading(id, readingId) {
    const station = this.getStation(id);
    const readings = station.readings;
    _.remove(readings, { id: readingId });
    this.store.save();
  },

  getReading(id, readingId) {
    const station = this.store.findOneBy(this.collection, { id: id });
    const readings = station.readings.filter(reading => reading.id == readingId);
    return readings[0];
  },

  getAllReadings(id) {
    return this.store.findAll(this.collection, { id: id });
  },

  updateReading(reading, updatedReading) {
    reading.code = updatedReading.code;
    reading.temperature = updatedReading.temperature;
    reading.windSpeed = updatedReading.windSpeed;
    reading.windDirection = updatedReading.windDirection;
    reading.pressure = updatedReading.pressure;
    this.store.save();
  },

};

module.exports = stationStore;
