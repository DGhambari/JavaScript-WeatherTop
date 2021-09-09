"use strict";

const conversion = require("../utils/Conversion");
const analytics = require("../utils/Analytics");

const Analytics = {

  windChill(temp, windSpeed) {
    let result = (13.12 + 0.6215 * temp -  11.37 * (Math.pow(windSpeed, 0.16)) + 0.3965 * temp * (Math.pow(windSpeed, 0.16)));
    return Number(result).toFixed(2)
    },

  // getMax(values) {
  //   let max = values[0];
  //   for (let i = 0; i < values.length; i++) {
  //     if (values[i] > max) {
  //       max = value[i];
  //     }
  //   }
  //   return max;
  // },
  //
  // getMin(values) {
  //   let min = values[0];
  //   for (let i = 0; i < values.length; i++) {
  //     if (values[i] < min) {
  //       min = value[i];
  //     }
  //   }
  //   return min;
  // },

  celsiusToFahrenheit(temperature){
    return Number((temperature * (1.8)) + 32).toFixed(2);
  },

  setDate(){
    const d = new Date();
    let yyyy = d.getFullYear();
    let mm = d.getMonth()+1;
    let dd = d.getDate();
    let hh = d.getHours();
    let m = d.getMinutes();
    let s = d.getSeconds();
    let ms = d.getMilliseconds();
    return yyyy+"-"+mm+"-"+dd+" "+hh+":"+m+":"+s+"."+ms;
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

  tempTrend(readings){
    let trend = "";
    let values = [];
    if (readings.length > 2) {
      values = [readings[readings.length - 3].temperature, readings[readings.length - 2].temperature, readings[readings.length - 1].temperature];
    }
    if ((values[2] > values[1]) && (values[1] > values[0])){
      trend = "arrow up";
    } else if ((values[2] < values[1]) && (values[1] < values[0])){
      trend = "arrow down";
    }
    return trend;
  },

  windTrend(readings){
    let trend = "";
    let values = [];
    if (readings.length > 2) {
      values = [readings[readings.length - 3].windSpeed, readings[readings.length - 2].windSpeed, readings[readings.length - 1].windSpeed];
    }
    if ((values[2] > values[1]) && (values[1] > values[0])){
      trend = "arrow up";
    } else if ((values[2] < values[1]) && (values[1] < values[0])){
      trend = "arrow down";
    }
    return trend;
  },

  pressureTrend(readings){
    let trend = "";
    let values = [];
    if (readings.length > 2) {
      values = [readings[readings.length - 3].pressure, readings[readings.length - 2].pressure, readings[readings.length - 1].pressure];
    }
    if ((values[2] > values[1]) && (values[1] > values[0])){
      trend = "arrow up";
    } else if ((values[2] < values[1]) && (values[1] < values[0])){
      trend = "arrow down";
    }
    return trend;
  },

  tempIcon(temp){
    let icon = "";
    if (temp > 15){
      icon ="high";
    } else {
      icon = "low"
    };
    return icon;
  }

};

module.exports = Analytics;
