import express from "express";
import compression from "compression";  // compresses requests
import bodyParser from "body-parser";

import DB from "./db";
import ApiController from "./Api/api.controller";

// Connect to MongoDB
const db = new DB();
db.connect()
    .then(() => console.log("MongoDB ready to use."))
    .catch((err: Error) => console.log("MongoDB connection error:", err));

// Express server
const app = express();
app.set("port", process.env.API_PORT || 3000);

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Controllers
new ApiController(app);

export default app;
