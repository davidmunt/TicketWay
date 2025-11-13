const fp = require("fastify-plugin");
const schema = require("./schema");

async function venue(server, options) {
  server.route({
    method: "GET",
    url: options.prefix + "venue/:slug",
    schema: schema.getVenue,
    onRequest: [server.authenticate],
    handler: onGetVenue,
  });
  async function onGetVenue(req, reply) {
    try {
      const slug = req.params.slug;
      if (!slug) {
        return reply.code(400).send({ message: "El slug es obligatorio", success: false });
      }
      const venue = await server.prisma.venue.findUnique({
        where: { slug },
      });
      if (!venue) {
        return reply
          .code(404)
          .send({ message: "No se ha encontrado un venue con ese slug", success: false });
      }
      return reply.send({ venue: venue, success: true });
    } catch (error) {
      return reply.code(500).send({ message: "Ha ocurrido un error interno", success: false });
    }
  }

  server.route({
    method: "GET",
    url: options.prefix + "venues",
    schema: schema.getVenues,
    onRequest: [server.authenticate],
    handler: onGetVenues,
  });
  async function onGetVenues(req, reply) {
    try {
      const venues = await server.prisma.venue.findMany({
        orderBy: { createdAt: "desc" },
      });
      if (!venues || venues.length === 0) {
        return reply.code(404).send({ message: "No se han encontrado venues", success: false });
      }
      return reply.send({ venues: venues, success: true });
    } catch (error) {
      return reply.code(500).send({ message: "Ha ocurrido un error interno", success: false });
    }
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

  server.route({
    method: "POST",
    url: options.prefix + "venue",
    onRequest: [server.authenticate],
    schema: schema.createVenue,
    handler: onCreateVenue,
  });
  async function onCreateVenue(req, reply) {
    try {
      const { name, country, city, direction, description, images, capacity, status } = req.body;
      if (
        !name ||
        !country ||
        !city ||
        !direction ||
        !description ||
        !images ||
        !capacity ||
        !status
      ) {
        return reply
          .code(400)
          .send({ message: "Los datos del venue son obligatorios", success: false });
      }
      if (!name?.trim() || !country?.trim() || !city?.trim() || !direction?.trim()) {
        return reply.code(400).send({
          message: "Los campos 'name', 'country', 'city' y 'direction' son obligatorios",
          success: false,
        });
      }
      if (!description?.trim()) {
        return reply.code(400).send({
          message: "El campo 'description' es obligatorio",
          success: false,
        });
      }
      if (typeof capacity !== "number" || capacity <= 0) {
        return reply.code(400).send({
          message: "El campo 'capacity' debe ser un número positivo",
          success: false,
        });
      }
      if (images && !Array.isArray(images)) {
        return reply
          .code(400)
          .send({ message: "El campo 'images' debe ser un array", success: false });
      }
      let slug = generateSlug(name);
      let exists = await server.prisma.venue.findUnique({ where: { slug } });
      while (exists) {
        slug = generateSlug(name);
        exists = await server.prisma.venue.findUnique({ where: { slug } });
      }
      const newVenue = await server.prisma.venue.create({
        data: {
          name: name.trim(),
          slug,
          country: country.trim(),
          city: city.trim(),
          direction: direction.trim(),
          description: description.trim(),
          images: images || [],
          capacity,
          status: status || "PENDING",
          isActive: true,
        },
      });
      return reply.code(201).send({ venue: newVenue, success: true });
    } catch (error) {
      return reply.code(500).send({ message: "Ha ocurrido un error interno", success: false });
    }
  }

  server.route({
    method: "PUT",
    url: options.prefix + "venue/:slug",
    onRequest: [server.authenticate],
    schema: schema.updateVenue,
    handler: onUpdateVenue,
  });
  async function onUpdateVenue(req, reply) {
    try {
      const slug = req.params.slug;
      if (!slug) {
        return reply.code(400).send({ message: "El slug es obligatorio", success: false });
      }
      const { name, country, city, direction, description, images, capacity, status, isActive } =
        req.body;
      if (
        !name ||
        !country ||
        !city ||
        !direction ||
        !description ||
        !images ||
        !capacity ||
        !status ||
        !isActive
      ) {
        return reply
          .code(400)
          .send({ message: "Los datos del venue son obligatorios", success: false });
      }
      const existingVenue = await server.prisma.venue.findUnique({ where: { slug } });
      if (!existingVenue) {
        return reply
          .code(404)
          .send({ message: "No se ha encontrado un venue con ese slug", success: false });
      }
      const updateData = {};
      if (name && name.trim().length > 0) updateData.name = name.trim();
      if (country && country.trim().length > 0) updateData.country = country.trim();
      if (city && city.trim().length > 0) updateData.city = city.trim();
      if (direction && direction.trim().length > 0) updateData.direction = direction.trim();
      if (description && description.trim().length > 0) updateData.description = description.trim();
      if (capacity !== undefined) {
        if (typeof capacity !== "number" || capacity <= 0) {
          return reply.code(400).send({
            message: "El campo 'capacity' debe ser un número positivo",
            success: false,
          });
        }
        updateData.capacity = capacity;
      }
      if (status) updateData.status = status;
      if (isActive !== undefined) updateData.isActive = Boolean(isActive);
      if (images) {
        if (!Array.isArray(images)) {
          return reply
            .code(400)
            .send({ message: "El campo 'images' debe ser un array", success: false });
        }
        updateData.images = images;
      }
      const updatedVenue = await server.prisma.venue.update({
        where: { slug },
        data: updateData,
      });
      return reply.code(200).send({
        message: "Venue actualizado correctamente",
        venue: updatedVenue,
        success: true,
      });
    } catch (error) {
      return reply.code(500).send({
        message: `Ha ocurrido un error interno ${error}`,
        success: false,
      });
    }
  }

  server.route({
    method: "DELETE",
    url: options.prefix + "venue/:slug",
    onRequest: [server.authenticate],
    schema: schema.deleteVenue,
    handler: onDeleteVenue,
  });
  async function onDeleteVenue(req, reply) {
    try {
      const slug = req.params.slug;
      if (!slug) {
        return reply.code(400).send({ message: "El slug es obligatorio", success: false });
      }
      const existingVenue = await server.prisma.venue.findUnique({ where: { slug } });
      if (!existingVenue) {
        return reply
          .code(404)
          .send({ message: "No se ha encontrado un venue con ese slug", success: false });
      }
      await server.prisma.venue.delete({ where: { slug } });
      return reply.code(200).send({ success: true });
    } catch (error) {
      return reply.code(500).send({ message: "Ha ocurrido un error interno", success: false });
    }
  }
}

module.exports = fp(venue);
