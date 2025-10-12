const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const corsOptions = {
  origin: process.env.CORSURL,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const dbConfig = require("../config/database.config.js");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Successfully connected to the database");
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });

require("../routes/category.router.js")(app);
require("../routes/artist.router.js")(app);
require("../routes/venue.router.js")(app);
require("../routes/concert.router.js")(app);
require("../routes/carousel.router.js")(app);
require("../routes/auth.router.js")(app);
require("../routes/user.router.js")(app);
require("../routes/profile.routes.js")(app);

app.listen(process.env.PORT, () => {
  console.log(`Servidor Express en el puerto ${process.env.PORT}`);
});
