const fp = require("fastify-plugin");
const schema = require("./schema");

async function concert(server, options) {
  server.route({
    method: "GET",
    url: options.prefix + "concert/:slug",
    schema: schema.getConcert,
    onRequest: [server.authenticate],
    handler: onGetConcert,
  });
  async function onGetConcert(req, reply) {
    try {
      const slug = req.params.slug;
      if (!slug) {
        return reply.code(400).send({ message: "El slug es obligatorio" });
      }
      const concert = await server.prisma.concert.findUnique({
        where: { slug },
      });
      if (!concert) {
        return reply.code(404).send({ message: "No se ha encontrado un concierto con ese slug" });
      }
      return reply.send({ concert });
    } catch (error) {
      console.error("Error al obtener concierto:", error);
      return reply.code(500).send({ message: "Ha ocurrido un error interno" });
    }
  }

  server.route({
    method: "GET",
    url: options.prefix + "concerts",
    schema: schema.getConcerts,
    onRequest: [server.authenticate],
    handler: onGetConcerts,
  });
  async function onGetConcerts(req, reply) {
    try {
      const limit = Number(req.query.limit) || 4;
      const offset = Number(req.query.offset) || 0;
      const name = req.query.name || "";
      const venue = req.query.venue || "";
      const category = req.query.category || "";
      const date = req.query.date;
      const isActive = req.query.isActive !== undefined ? req.query.isActive === "true" : undefined;
      const where = {};
      if (name) where.name = { contains: name, mode: "insensitive" };
      if (venue) where.venue = venue;
      if (category) where.category = category;
      if (date) where.date = new Date(date);
      if (isActive !== undefined) where.isActive = isActive;
      const concerts = await server.prisma.concert.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { date: "desc" },
      });
      if (!concerts || concerts.length === 0) {
        return reply.code(404).send({ message: "No se han encontrado conciertos" });
      }
      return reply.send({ concerts });
    } catch (error) {
      console.error("Error al obtener conciertos:", error);
      return reply.code(500).send({ message: "Ha ocurrido un error interno" });
    }
  }

  server.route({
    method: "POST",
    url: options.prefix + "concert",
    onRequest: [server.authenticate],
    schema: schema.createConcert,
    handler: onCreateConcert,
  });
  async function onCreateConcert(req, reply) {
    try {
      const concert = req.body.concert;
      if (!concert) {
        return reply.code(400).send({ message: "Los datos del concierto son obligatorios" });
      }
      const {
        name,
        date,
        price,
        description,
        images,
        venue,
        category,
        artists,
        availableSeats,
        status,
      } = concert;
      if (
        !name?.trim() ||
        !date ||
        price === undefined ||
        !description?.trim() ||
        !venue ||
        !category
      ) {
        return reply.code(400).send({
          message:
            "Los campos 'name', 'date', 'price', 'description', 'venue' y 'category' son obligatorios",
        });
      }
      if (images && !Array.isArray(images)) {
        return reply.code(400).send({ message: "El campo 'images' debe ser un array" });
      }
      if (artists && !Array.isArray(artists)) {
        return reply.code(400).send({ message: "El campo 'artists' debe ser un array" });
      }
      if (typeof price !== "number" || price < 0) {
        return reply.code(400).send({ message: "El campo 'price' debe ser un número positivo" });
      }
      if (
        availableSeats !== undefined &&
        (typeof availableSeats !== "number" || availableSeats < 0)
      ) {
        return reply
          .code(400)
          .send({ message: "El campo 'availableSeats' debe ser un número positivo" });
      }
      const slugify = (text) =>
        text
          .toString()
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .trim()
          .replace(/\s+/g, "-")
          .replace(/&/g, "-and-")
          .replace(/[^\w\-]+/g, "")
          .replace(/\-\-+/g, "-");
      const generateSlug = (name) => {
        const baseSlug = slugify(name);
        const randomPart = Math.random().toString(36).substring(2, 8);
        return `${baseSlug}-${randomPart}`;
      };
      let slug = generateSlug(name);
      let exists = await server.prisma.concert.findUnique({ where: { slug } });
      while (exists) {
        slug = generateSlug(name);
        exists = await server.prisma.concert.findUnique({ where: { slug } });
      }
      const newConcert = await server.prisma.concert.create({
        data: {
          name: name.trim(),
          slug,
          date: new Date(date),
          price,
          description: description.trim(),
          images: images || [],
          venue,
          category,
          artists: artists || [],
          availableSeats: availableSeats || 0,
          status: status || "PENDING",
          isActive: true,
        },
      });
      return reply.code(201).send({ concert: newConcert });
    } catch (error) {
      console.error("Error al crear el concierto:", error);
      return reply.code(500).send({ message: "Ha ocurrido un error interno" });
    }
  }

  server.route({
    method: "PUT",
    url: options.prefix + "concert/:slug",
    onRequest: [server.authenticate],
    schema: schema.updateConcert,
    handler: onUpdateConcert,
  });
  async function onUpdateConcert(req, reply) {
    try {
      const slug = req.params.slug;
      if (!slug) {
        return reply.code(400).send({ message: "El slug es obligatorio" });
      }
      const concertData = req.body.concert;
      if (!concertData) {
        return reply.code(400).send({ message: "Los datos del concierto son necesarios" });
      }
      const existingConcert = await server.prisma.concert.findUnique({ where: { slug } });
      if (!existingConcert) {
        return reply.code(404).send({ message: "No se ha encontrado un concierto con ese slug" });
      }
      const updateData = {};
      if (concertData.name && concertData.name.trim().length > 0)
        updateData.name = concertData.name.trim();
      if (concertData.date) updateData.date = new Date(concertData.date);
      if (concertData.price !== undefined) {
        if (typeof concertData.price !== "number" || concertData.price < 0) {
          return reply.code(400).send({ message: "El campo 'price' debe ser un número positivo" });
        }
        updateData.price = concertData.price;
      }
      if (concertData.description && concertData.description.trim().length > 0)
        updateData.description = concertData.description.trim();
      if (concertData.venue) updateData.venue = concertData.venue;
      if (concertData.category) updateData.category = concertData.category;
      if (concertData.artists) {
        if (!Array.isArray(concertData.artists)) {
          return reply.code(400).send({ message: "El campo 'artists' debe ser un array" });
        }
        updateData.artists = concertData.artists;
      }
      if (concertData.images) {
        if (!Array.isArray(concertData.images)) {
          return reply.code(400).send({ message: "El campo 'images' debe ser un array" });
        }
        updateData.images = concertData.images;
      }
      if (concertData.availableSeats !== undefined) {
        if (typeof concertData.availableSeats !== "number" || concertData.availableSeats < 0) {
          return reply
            .code(400)
            .send({ message: "El campo 'availableSeats' debe ser un número positivo" });
        }
        updateData.availableSeats = concertData.availableSeats;
      }
      if (concertData.status) updateData.status = concertData.status;
      if (concertData.isActive !== undefined) updateData.isActive = Boolean(concertData.isActive);
      const updatedConcert = await server.prisma.concert.update({
        where: { slug },
        data: updateData,
      });
      return reply.code(200).send({
        message: "Concierto actualizado correctamente",
        concert: updatedConcert,
      });
    } catch (error) {
      console.error("Error al actualizar el concierto:", error);
      return reply.code(500).send({ message: "Ha ocurrido un error interno" });
    }
  }

  server.route({
    method: "DELETE",
    url: options.prefix + "concert/:slug",
    onRequest: [server.authenticate],
    schema: schema.deleteConcert,
    handler: onDeleteConcert,
  });
  async function onDeleteConcert(req, reply) {
    try {
      const slug = req.params.slug;
      if (!slug) {
        return reply.code(400).send({ message: "El slug es obligatorio" });
      }
      const existingConcert = await server.prisma.concert.findUnique({ where: { slug } });
      if (!existingConcert) {
        return reply.code(404).send({ message: "No se ha encontrado un concierto con ese slug" });
      }
      await server.prisma.concert.delete({ where: { slug } });
      return reply.code(200).send({ updated: true });
    } catch (error) {
      console.error("Error al eliminar el concierto:", error);
      return reply.code(500).send({ message: "Ha ocurrido un error interno", updated: false });
    }
  }
}

module.exports = fp(concert);
