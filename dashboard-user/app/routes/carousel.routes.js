module.exports = (app) => {
  const carousel = require("../controllers/carousel.controller");

  //GET carousel all Categories
  app.get("/carousel", carousel.getCarouselCategory);

  //GET Carousel of images from one Product
  app.get("/carousel/:slug", carousel.getCarouselConcert);
};
