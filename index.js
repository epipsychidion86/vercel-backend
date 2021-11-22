import { rootGet } from "./controllers/rootController.js";
import { globalErrorHandler } from "./middleware/globalErrorHandler.js";

// Import dotenv
import dotenv from "dotenv";
dotenv.config();

// const express = require("express");
import express from "express";

//const cors = require("cors");
import cors from "cors";

// Morgan logging middleware
import morgan from "morgan";

// Import our custom logging middleware
import logger from "./middleware/logger.js";

// Import our new route to handle requests to the "/new-album" endpoint
// import newAlbum from "./routes/newAlbum.js";

import albums from "./routes/albums.js";

// Import our new route to handle requests to the "/login" endpoint
import login from "./routes/login.js";

// Import our new route to handle requests to the "/user" endpoint
import user from "./routes/user.js";
import bands from "./routes/bands.js";

// Import mongoose
import mongoose from "mongoose";

// Connecting to a MongoDB database using a connection string
// Remember: if this db doesn't exist yet, it is created implicitly for you!
mongoose.connect("mongodb://localhost:27017/albums-project");

// Callbacks for mongoose - one for when the db connection is opened, another for when there's an error
mongoose.connection.on("open", () => console.log("Database connection established"));
mongoose.connection.on("error", () => console.error);

// ! ===== We are no longer using LowDB
// Import lowdb
// import { Low, JSONFile } from "lowdb";

// lowdb uses adapters for reading and writing JSON files
// "An adapter is a simple class that just needs to expose two methods: read and write"
// const adapter = new JSONFile("./data/db.json");
// export const db = new Low(adapter);

// Wait for lowdb to read the contents of the db.json file before continuing
// await db.read();

// If there's already some data in db.json, that's cool!
// If db.json has nothing in it, create starting data ---> { users: [], albums: [] }
//db.data ||= { users: [] };
// ! ================================

// ! Deprecated
//const bodyParser = require("body-parser");

const app = express();

// Register our custom middleware
// Using app.use() globally enables our middleware to run for every request
// app.use() is expecting a function that will take in req, res, and next
app.use(logger);

// Register morgan as middleware in our server
// Morgan will log some basic details about the request we received
app.use(morgan("tiny"));

// The current use of cors allows ALL cors requests to all our routes
app.use(cors());

// ! Deprecated
// app.use(bodyParser.json());

// Instead of body-parser, we can use express's .json() method to parse JSON data
app.use(express.json());

// New "/" endpoint
app.get("/", rootGet);

// Register our new route for the "/albums" endpoint.
app.use("/albums", albums);

// Register our new route for the "/login" endpoint.
app.use("/login", login);

// Register our new route for the "/user" endpoint
app.use("/user", user);

// Register our new route for the "/bands" endpoint
app.use("/bands", bands);

// ! No longer using LowDB
// Log the current db.data object
// console.log("The current db.data object:", db.data)

// * The last middleware registered should always be the global Error handler
// The reason is that then, when a route has an error, it can call next()
// And pass the error to this middleware to be handled
// Note that error handling middleware has a fourth parameter
app.use(globalErrorHandler);

// printenv | grep PORT -> grep is a feature for searching through large pieces of text.
app.listen(process.env.PORT || 3001, () => {
    console.log("Server has started on port", process.env.PORT);
})
