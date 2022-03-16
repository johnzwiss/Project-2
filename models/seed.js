///////////////////////////////////////
// Import Dependencies
///////////////////////////////////////
const mongoose = require("./connection");
const User = require('../models/user')
require('dotenv').config()


///////////////////////////////////////////
// Seed Code
////////////////////////////////////////////

// save the connection in a variable
const db = mongoose.connection; 

// Make sure code is not run till connected
db.on("open", () => {
    ///////////////////////////////////////////////
    // Write your Seed Code Below
    //////////////////////////////////////////////
  
    // Run any database queries in this function
    const admin = [
        { username: process.env.ADMINNAME, password: process.env.ADMINPASS, role: "admin"}
    ]
  
    // Delete all fruits
    User.deleteMany({})
      .then((deletedUsers) => {
        // add the starter fruits
        User.create(admin)
          .then((newUsers) => {
            // log the new fruits to confirm their creation
            console.log(newUsers);
            db.close();
          })
          .catch((error) => {
            console.log(error);
            db.close();
          });
      })
      .catch((error) => {
        console.log(error);
        db.close();
      });
  
    ///////////////////////////////////////////////
    // Write your Seed Code Above
    //////////////////////////////////////////////
  });