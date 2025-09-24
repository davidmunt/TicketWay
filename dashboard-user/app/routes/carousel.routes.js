module.exports = (app) => {
  const carousel = require("../controllers/carousel.controller");

  //GET ALL
  app.get("/carousel", carousel.getCarouselCategory);
  //GET ALL IMAGES FROM ONE PRODUCT
  app.get("/carousel/:slug", carousel.getCarouselConcert);
};
