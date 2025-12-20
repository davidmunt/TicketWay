const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../../.env"),
});

console.log("ACCESS_TOKEN_SECRET:", process.env.ACCESS_TOKEN_SECRET);
console.log("REFRESH_TOKEN_SECRET:", process.env.REFRESH_TOKEN_SECRET);

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const corsOptions = {
  origin: ["http://localhost:4200", "http://frontend:80"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const dbConfig = require("../config/database.config.js");

mongoose.Promise = global.Promise;
mongoose
  .connect(dbConfig.url, { useNewUrlParser: true })
  .then(() => {
    console.log("✅ Conectado a la base de datos");
  })
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
require("../routes/role.router.js")(app);
require("../routes/profile.router.js")(app);
require("../routes/comment.router.js")(app);
require("../routes/cart.router.js")(app);
require("../routes/product.router.js")(app);
require("../routes/productCategory.js")(app);
require("../routes/payment.router.js")(app);

const PORT = process.env.PORT || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor Express escuchando en el puerto ${PORT}`);
});
