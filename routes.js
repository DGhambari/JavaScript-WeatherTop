"use strict";

const express = require("express");
const router = express.Router();

const accounts = require("./controllers/accounts.js");
const dashboard = require("./controllers/dashboard.js");
const about = require("./controllers/about.js");
const station = require("./controllers/station.js");
const reading = require("./controllers/reading.js");

// Accounts
router.get("/", accounts.index);
router.get("/login", accounts.login);
router.get("/signup", accounts.signup);
router.get("/logout", accounts.logout);
router.post("/register", accounts.register);
router.post("/authenticate", accounts.authenticate);
// router.get("/settings", accounts.settings);

// Home Page
router.get("/dashboard", dashboard.index);
router.get("/about", about.index);
router.get("/station/:id", station.index);
router.post("/dashboard/addStation", dashboard.addStation);
router.get("/dashboard/deleteStation/:id", dashboard.deleteStation);
router.post("/station/addReport", station.addReport);

router.get("/station/:id/deleteReading/:readingid", station.deleteReading);
router.post("/station/:id/addReading", station.addReading);
router.get("/reading/:id/editReading/:readingid", reading.index);
router.get("/reading/:id/updateReading/:readingid", reading.update);
router.get("/dashboard/deleteReport/:id", station.deleteReading);

module.exports = router;
