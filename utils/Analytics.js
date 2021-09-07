"use strict";

const conversion = require("../utils/Conversion");
const analytics = require("../utils/Analytics");

const Analytics = {

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

  maxTemp(readings){
    let max = readings[0].temperature;
    for (let i = 0; i < readings.length; i++ ) {
      if (readings[i].temperature > max){
        max = readings[i].temperature;
      }
    }
    return max;
  },

  minTemp(readings){
    let min = readings[0].temperature;
    for (let i = 0; i < readings.length; i++ ) {
      if (readings[i].temperature < min){
        min = readings[i].temperature;
      }
    }
    return min;
  },

  maxWind(readings){
    let max = readings[0].windSpeed;
    for (let i = 0; i < readings.length; i++ ) {
      if (readings[i].windSpeed > max){
        max = readings[i].windSpeed;
      }
    }
    return max;
  },

  minWind(readings){
    let min = readings[0].windSpeed;
    for (let i = 0; i < readings.length; i++ ) {
      if (readings[i].windSpeed < min){
        min = readings[i].windSpeed;
      }
    }
    return min;
  },

  maxPressure(readings){
    let max = readings[0].pressure;
    for (let i = 0; i < readings.length; i++ ) {
      if (readings[i].pressure > max){
        max = readings[i].pressure;
      }
    }
    return max;
  },

  minPressure(readings){
    let min = readings[0].pressure;
    for (let i = 0; i < readings.length; i++ ) {
      if (readings[i].pressure < min){
        min = readings[i].pressure;
      }
    }
    return min;
  },

};

module.exports = Analytics;
