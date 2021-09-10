"use strict";

const _ = require("lodash");
const JsonStore = require("./json-store");

const userStore = {
  store: new JsonStore("./models/user-store.json", { users: [] }),
  collection: "users",

  getAllUsers() {
    return this.store.findAll(this.collection);
  },

  addUser(user) {
    this.store.add(this.collection, user);
    this.store.save();
  },

  getUserById(id) {
    return this.store.findOneBy(this.collection, { id: id });
  },

  getUserByEmail(email) {
    return this.store.findOneBy(this.collection, { email: email });
  },

  getUserByPassword(password) {
    return this.store.findOneBy(this.collection, { password: password });
  },

  // Removed as could not get it working

  // editUser(loggedInUser, updatedUser){
  //   loggedInUser.firstName = updatedUser.firstName;
  //   loggedInUser.lastName = updatedUser.lastName;
  //   loggedInUser.email = updatedUser.email;
  //   loggedInUser.password = updatedUser.password;
  //   this.store.save();
  // }

};

module.exports = userStore;
