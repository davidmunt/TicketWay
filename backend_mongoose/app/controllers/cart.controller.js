const Cart = require("../models/cart.model");

const addConcertToCart = async (req, res) => {
  try {
    const slug = req.params.slug;
    const concert = req.body.concert;
    if (!concert || !concert.concertId || concert.ticketsQty == null || !concert.productId || concert.productQty == null) {
      return res.status(400).json({ message: "Datos del concierto incompletos", created: false });
    }
    const cart = await Cart.findOne({ slug }).exec();
    cart.concerts.push({
      concert: concert.concertId,
      ticketsQty: concert.ticketsQty,
      product: concert.productId,
      productQty: concert.productQty,
    });
    await cart.save();
    return res.status(201).json({ message: "Concierto y datos del producto agregados al carrito", created: true });
  } catch (error) {
    return res.status(500).json({ message: "Error al agregar comentario", error: error.message, created: false });
  }
};

const getCartFromUser = async (req, res) => {
  try {
    const { slug } = req.params;
    const cart = await Cart.findOne({
      slug: slug,
    })
      .populate("concerts.concert")
      .populate("concerts.product")
      .exec();
    if (!cart) {
      return res.status(404).json({
        message: "No se ha encontrado el carrito del usuario",
        error: true,
      });
    }
    return res.status(200).json({
      cart: cart.toCartResponse(),
    });
  } catch (error) {
    console.error("Error obteniendo carrito:", error);
    return res.status(500).json({ message: "Error interno en el servidor." });
  }
};

const modifyConcertCartQty = async (req, res) => {
  try {
    const { slug, concertId } = req.params;
    const { symbol } = req.body;
    const cart = await Cart.findOne({ slug }).exec();
    if (!cart) {
      return res.status(404).json({
        message: "No se ha encontrado el carrito del usuario",
        error: true,
      });
    }
    const concierto = cart.concerts.find((c) => c.concert.toString() === concertId);
    if (!concierto) {
      return res.status(404).json({
        message: "Ese concierto no está en el carrito",
        error: true,
      });
    }
    if (symbol === "+") {
      concierto.ticketsQty += 1;
    } else if (symbol === "-") {
      if (concierto.ticketsQty > 1) {
        concierto.ticketsQty -= 1;
      } else {
        return res.status(400).json({
          message: "No se puede redocir a 0 la cantidad de tickets",
          error: true,
        });
      }
    } else {
      return res.status(400).json({
        message: "Operación inválida, usa '+' o '-' ",
        error: true,
      });
    }
    await cart.save();
    return res.status(200).json({
      updated: true,
    });
  } catch (error) {
    console.error("Error modificando cantidad:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: true,
    });
  }
};

const modifyProductCartQty = async (req, res) => {
  try {
    const { slug, productId } = req.params;
    const { symbol } = req.body;
    const cart = await Cart.findOne({ slug }).exec();
    if (!cart) {
      return res.status(404).json({
        message: "No se ha encontrado el carrito del usuario",
        error: true,
      });
    }
    const producto = cart.concerts.find((c) => c.product.toString() === productId);
    if (!producto) {
      return res.status(404).json({
        message: "Ese producto no está en el carrito",
        error: true,
      });
    }
    if (symbol === "+") {
      producto.productQty += 1;
    } else if (symbol === "-") {
      if (producto.productQty > 1) {
        producto.productQty -= 1;
      } else {
        return res.status(400).json({
          message: "No se puede redocir a 0 la cantidad de producto",
          error: true,
        });
      }
    } else {
      return res.status(400).json({
        message: "Operación inválida, usa '+' o '-' ",
        error: true,
      });
    }
    await cart.save();
    return res.status(200).json({
      updated: true,
    });
  } catch (error) {
    console.error("Error modificando cantidad:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: true,
    });
  }
};

const deleteConcertFromCart = async (req, res) => {
  try {
    const { slug, concertId } = req.params;
    const cart = await Cart.findOne({ slug }).exec();
    if (!cart) {
      return res.status(404).json({
        message: "No se ha encontrado el carrito del usuario",
        error: true,
      });
    }
    const newConcerts = cart.concerts.filter((c) => c.concert.toString() !== concertId);
    if (newConcerts.length === cart.concerts.length) {
      return res.status(404).json({
        message: "El concierto no existe dentro del carrito",
        error: true,
      });
    }
    cart.concerts = newConcerts;
    await cart.save();
    return res.status(200).json({
      message: "Concierto eliminado correctamente",
      updated: true,
    });
  } catch (error) {
    console.error("Error eliminando concierto del carrito:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: true,
    });
  }
};

const deleteProductFromCart = async (req, res) => {
  try {
    const { slug, productId } = req.params;
    const cart = await Cart.findOne({ slug }).exec();
    if (!cart) {
      return res.status(404).json({
        message: "No se ha encontrado el carrito del usuario",
        error: true,
      });
    }
    const producto = cart.concerts.find((c) => c.product.toString() === productId);
    if (!producto) {
      return res.status(404).json({
        message: "Ese producto no está en el carrito",
        error: true,
      });
    }
    producto.productQty = 0;
    await cart.save();
    return res.status(200).json({
      updated: true,
    });
  } catch (error) {
    console.error("Error modificando cantidad:", error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: true,
    });
  }
};

module.exports = {
  addConcertToCart,
  getCartFromUser,
  modifyConcertCartQty,
  modifyProductCartQty,
  deleteConcertFromCart,
  deleteProductFromCart,
};
