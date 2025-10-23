const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const corsOptions = {
  origin: process.env.CORSURL || "http://localhost:4200",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const dbConfig = require("../config/database.config.js");
mongoose.Promise = global.Promise;
mongoose
  .connect(dbConfig.url, { useNewUrlParser: true })
  .then(() => console.log("Successfully connected to the database"))
  .catch((err) => {
    console.error("❌ Error al conectar con la base de datos:", err);
    process.exit();
  });

require("../routes/category.router.js")(app);
require("../routes/artist.router.js")(app);
require("../routes/venue.router.js")(app);
require("../routes/concert.router.js")(app);
require("../routes/carousel.router.js")(app);
require("../routes/auth.router.js")(app);
require("../routes/user.router.js")(app);
require("../routes/profile.router.js")(app);
require("../routes/comment.router.js")(app);

app.listen(process.env.PORT, () => {
  console.log(`Servidor Express en el puerto ${process.env.PORT}`);
});

// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const dotenv = require("dotenv");

// const app = express();
// dotenv.config();

// const corsOptions = {
//   origin: process.env.CORSURL,
//   optionsSuccessStatus: 200,
// };

// app.use(cors(corsOptions));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// const dbConfig = require("../config/database.config.js");
// const mongoose = require("mongoose");
// mongoose.Promise = global.Promise;
// mongoose
//   .connect(dbConfig.url, {
//     useNewUrlParser: true,
//   })
//   .then(() => {
//     console.log("Successfully connected to the database");
//   })
//   .catch((err) => {
//     console.log("Could not connect to the database. Exiting now...", err);
//     process.exit();
//   });

// require("../routes/category.router.js")(app);
// require("../routes/artist.router.js")(app);
// require("../routes/venue.router.js")(app);
// require("../routes/concert.router.js")(app);
// require("../routes/carousel.router.js")(app);
// require("../routes/auth.router.js")(app);
// require("../routes/user.router.js")(app);
// require("../routes/profile.router.js")(app);
// require("../routes/comment.router.js")(app);

// app.listen(process.env.PORT, () => {
//   console.log(`Servidor Express en el puerto ${process.env.PORT}`);
// });

// const cookieParser = require("cookie-parser");
// app.use(cookieParser());
