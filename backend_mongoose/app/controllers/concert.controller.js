const Concert = require("../models/concert.model.js");
const Category = require("../models/category.model.js");
const Artist = require("../models/artist.model.js");

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
    // const concerts = await Concert.find(query).limit(Number(limit)).skip(Number(offset));
    console.log(`${concerts} conce`);
    const concerts_count = await Concert.find(query).countDocuments();
    console.log(`${concerts_count} total`);
    return res.status(200).json({ concerts: await Promise.all(concerts.map((concert) => concert.toConcertResponse())), concerts_count: concerts_count });
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener los conciertos", error: error.message });
  }
};

const getOneConcert = async (req, res) => {
  try {
    const { slug } = req.params;
    const concert = await Concert.findOne({ slug }).exec();
    if (!concert) {
      return res.status(404).json({ message: "Concierto no encontrado" });
    }
    return res.status(200).json(await concert.toConcertResponse());
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
    return res.status(500).json({ message: "Error al obtener los conciertos", error: error.message });
  }
};

const createConcert = async (req, res) => {
  try {
    const concertData = {
      name: req.body.name || null,
      price: req.body.price || 0,
      venue: req.body.venue || null,
      description: req.body.description || null,
      date: req.body.date || null,
      images: req.body.images || [],
      category: req.body.category || null,
      artists: req.body.artists || null,
    };
    const id_cat = req.body.category;
    const category = await Category.findOne({ _id: id_cat }).exec();
    if (!category) {
      res.status(400).json({ message: "Ha ocurrido un error al buscar la categoria" });
    }

    // const id_artist = req.body.artist;
    // const artist = await Artist.findOne({ _id: id_artist }).exec();
    // if (!artist) {
    //   res.status(400).json({ message: "Ha ocurrido un error al buscar el Artista" });
    // }

    const newConcert = new Concert(concertData);
    await newConcert.save();
    if (!newConcert) {
      return res.status(400).json({ message: "Error al crear el concierto" });
    }
    await category.addConcert(newConcert._id);
    return res.status(201).json({ concert: await newConcert.toConcertResponse() });
  } catch (error) {
    return res.status(500).json({ message: "Error al crear el concierto", error: error.message });
  }
};

const deleteOneConcert = async (req, res) => {
  try {
    const { slug } = req.params;
    const concert = await Concert.findOne({ slug }).exec();
    if (!concert) {
      return res.status(404).json({ message: "Concierto no encontrado" });
    }
    const id_cat = concert.category;
    const category = await Category.findOne({ _id: id_cat }).exec();
    if (!category) {
      return res.status(404).json({ message: "Categoria del concierto no encontrada" });
    }
    await Concert.deleteOne({ _id: concert._id });
    await category.removeConcert(concert._id);
    return res.status(200).json({ message: "Concierto eliminado" });
  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar el concierto", error: error.message });
  }
};

module.exports = {
  getAllConcerts,
  getOneConcert,
  getAllConcertsFromCategory,
  createConcert,
  deleteOneConcert,
};
