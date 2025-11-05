const Concert = require("../models/concert.model.js");
const Category = require("../models/category.model.js");
const Artist = require("../models/artist.model.js");
const Venue = require("../models/venue.model.js");
const User = require("../models/user.model.js");

const getAllConcerts = async (req, res) => {
  try {
    let query = {};
    let getQueryParam = (varQuery, otherResult) => {
      return varQuery != "undefined" && varQuery ? varQuery : otherResult;
    };
    let limit = getQueryParam(req.query.limit, 4);
    let offset = getQueryParam(req.query.offset, 0);
    let category = getQueryParam(req.query.category, "");
    let venue = getQueryParam(req.query.venue, "");
    let artist = getQueryParam(req.query.artist, "");
    let name = getQueryParam(req.query.name, "");
    let price_min = getQueryParam(req.query.price_min, 0);
    let price_max = getQueryParam(req.query.price_max, Number.MAX_SAFE_INTEGER);
    let nameReg = new RegExp(name, "i");
    query = {
      name: { $regex: nameReg },
      $and: [{ price: { $gte: price_min } }, { price: { $lte: price_max } }],
    };

    if (category != "") {
      query.category = category;
    }
    if (venue != "") {
      query.venue = venue;
    }
    if (artist != "") {
      query.artists = artist;
    }
    const concerts = await Concert.find(query).limit(Number(limit)).skip(Number(offset));
    const concerts_count = await Concert.find(query).countDocuments();
    return res.status(200).json({
      concerts: await Promise.all(concerts.map((concert) => concert.toConcertResponse())),
      concerts_count: concerts_count,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener los conciertos", error: error.message });
  }
};

const getOneConcert = async (req, res) => {
  try {
    const { slug } = req.params;
    const userId = req.userId;
    const user = await User.findOne({ _id: userId });
    const concert = await Concert.findOne({ slug }).exec();
    if (!concert) {
      return res.status(404).json({ message: "Concierto no encontrado" });
    }
    return res.status(200).json(await concert.toConcertResponse(user));
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener el concierto", error: error.message });
  }
};

const getAllConcertsFromCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const categoria = await Category.findOne({ slug }).exec();
    if (!categoria) {
      return res.status(400).json({ message: "Categoria no encontrada", error: error.message });
    }
    return res.status(200).json(
      await Promise.all(
        categoria.concerts.map(async (concert_id) => {
          const concert = await Concert.findById(concert_id);
          return concert.toConcertResponse();
        })
      )
    );
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener los conciertos", error: error.message });
  }
};

const favoriteConcert = async (req, res) => {
  const id = req.userId;
  const { slug } = req.params;
  const loginUser = await User.findById(id).exec();
  if (!loginUser) {
    return res.status(401).json({
      message: "Usuario no encontrado",
      isCompleted: false,
    });
  }
  const concert = await Concert.findOne({ slug }).exec();
  if (!concert) {
    return res.status(401).json({
      message: "Trabajo no encontrado",
      isCompleted: false,
    });
  }
  await loginUser.favorite(concert._id);
  const updatedConcert = await concert.updateFavoriteCount();
  return res.status(200).json({ isCompleted: true });
};

const unfavoriteConcert = async (req, res) => {
  const id = req.userId;
  const { slug } = req.params;
  const loginUser = await User.findById(id).exec();
  if (!loginUser) {
    return res.status(401).json({
      message: "Usuario no encontrado",
      isCompleted: false,
    });
  }
  const concert = await Concert.findOne({ slug }).exec();
  if (!concert) {
    return res.status(401).json({
      message: "Trabajo no encontrado",
      isCompleted: false,
    });
  }
  await loginUser.unfavorite(concert._id);
  await concert.updateFavoriteCount();
  return res.status(200).json({ isCompleted: true });
};

module.exports = {
  getAllConcerts,
  getOneConcert,
  getAllConcertsFromCategory,
  favoriteConcert,
  unfavoriteConcert,
};
