"use strict";

const logger = require("../utils/logger");
const axios = require("axios");
const stationStore = require('../models/station-store');
const accounts = require("./accounts.js");
const uuid = require("uuid");
const conversion = require("../utils/Conversion");
const analytics = require("../utils/Analytics");

const dashboard = {
  index(request, response) {
    const stationId = request.params.id;
    logger.info("dashboard rendering");
    const loggedInUser = accounts.getCurrentUser(request);
    const stations = stationStore.getUserStations(loggedInUser.id);
    // const stationsSummary = stations[viewData];
    // const readings = stationStore.getAllReadings(stationId);
    // let windChill = analytics.windChill(10,15);
    // let weatherCodes = analytics.weatherCodes()
    const viewData = {
      title: "WeatherTop",
      stations: stationStore.getUserStations(loggedInUser.id),
      readings: stationStore.getAllReadings(stationId),
      summary: {
        temperature: request.body.temperature,
        windSpeed: request.body.windSpeed,
        windDirection: request.body.windDirection,
        pressure: request.body.pressure,

      }
    };
    // logger.info("about to render", stationStore.getAllStations());
    // analytics.updateWeather(stations);
    response.render("dashboard", viewData);
  },
  async addReport(request, response) {
    logger.info("rendering new report");
    let report = {};
    const lat = request.body.lat;
    const lng = request.body.lng;
    const requestUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&units=metric&appid=23ebcf57b5cb28f316d20cd159a44860`
    const result = await axios.get(requestUrl);
    if (result.status == 200) {
      const reading = result.data.current;
      report.code = reading.weather[0].id;
      report.temperature = reading.temp;
      report.windSpeed = reading.wind_speed;
      report.pressure = reading.pressure;
      report.windDirection = reading.wind_deg;
      report.tempTrend = [];
      report.trendLabels = [];
      const trends = result.data.daily;
      for (let i=0; i<trends.length; i++) {
        report.tempTrend.push(trends[i].temp.day);
        const date = new Date(trends[i].dt * 1000);
        console.log(date);
        report.trendLabels.push(`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}` );
      }
    }
    const viewData = {
      title: "Weather Report",
      reading: report
    };
    response.render("dashboard", viewData);
  },

  // Just need to link this to a button on the dashboard somewhere

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

  deleteReading(request, response) {
    const reportId = request.params.id;
    logger.debug(`Deleting Station ${reportId}`);
    stationStore.removeStation(reportId);
    response.redirect("/dashboard");
  },
};

module.exports = dashboard;
