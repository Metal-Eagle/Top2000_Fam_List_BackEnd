// Constants
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const PORT = process.env.PORT || 8080;
const HOST = "0.0.0.0";

//TODO: add origin
const corsOptions = {
  origin: "*", //TODO: change to frontEnd url
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  preflightContinue: true,
  methods: "GET,PUT,POST,DELETE",
};

// App
const app = express();
app.use(
  express.json({
    limit: "10mb",
  })
); // Use express json for body parser

app.use(helmet()); // Use helmet
app.use(cors(corsOptions)); // use cors
require("./routes/routes")(app);

// use only whene in development
if (process.env.NODE_ENV === "development") {
  console.log("DEV MODE");
  app.use(morgan("dev")); // log every request to the console
}

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
