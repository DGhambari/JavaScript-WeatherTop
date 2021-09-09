"use strict";

const userstore = require("../models/user-store");
const logger = require("../utils/logger");
const uuid = require("uuid");

const accounts = {
  index(request, response) {
    const viewData = {
      title: "Login or Signup",
    };
    response.render("index", viewData);
  },

  login(request, response) {
    const viewData = {
      title: "Login to WeatherTop"
    };
    response.render("login", viewData);
  },

  logout(request, response) {
    response.cookie("station", "");
    response.redirect("/");
  },

  signup(request, response) {
    const viewData = {
      title: "Signup to WeatherTop"
    };
    response.render("signup", viewData);
  },

  register(request, response) {
    const user = request.body;
    user.id = uuid.v1();
    userstore.addUser(user);
    logger.info(`registering ${user.email}`);
    response.redirect("/");
  },

  authenticate(request, response) {
    const user = userstore.getUserByEmail(request.body.email);
    const password = userstore.getUserByPassword(request.body.password);
    if (user&&password) {
      response.cookie("station", user.email);
      logger.info(`logging in ${user.email}`);
      response.redirect("/dashboard");
    } else {
      response.redirect("/login");
    }
  },

  getCurrentUser(request) {
    const userEmail = request.cookies.station;
    return userstore.getUserByEmail(userEmail);
  },

  settings(request, response){
    // const loggedInUser = this.getCurrentUser();
    // const viewData = {
    //   loggedInUser: loggedInUser,
    //   firstName: loggedInUser.firstName,
    //   lastName: loggedInUser.lastName,
    //   email: loggedInUser.email,
    //   password: loggedInUser.password,
    // }
    response.render("/settings"); // , viewData
  },

  // editUser(request, response){
  //   const loggedInUser = userstore.getUserByEmail(request.body.email);
  //   const updatedUser = userstore.getUserByEmail(request.body.email);
  //   loggedInUser.firstName = updatedUser.firstName;
  //   loggedInUser.lastName = updatedUser.lastName;
  //   loggedInUser.email = updatedUser.email;
  //   loggedInUser.password = updatedUser.password;
  //   response.redirect("/dashboard", updatedUser)
  // }
};

module.exports = accounts;
