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
        return reply.code(400).send({ message: "El slug es obligatorio" });
      }
      const venue = await server.prisma.venue.findUnique({
        where: { slug },
      });
      if (!venue) {
        return reply.code(404).send({ message: "No se ha encontrado un venue con ese slug" });
      }
      return reply.send({ venue });
    } catch (error) {
      console.error("Error al obtener venue:", error);
      return reply.code(500).send({ message: "Ha ocurrido un error interno" });
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
      const limit = Number(req.query.limit) || 4;
      const offset = Number(req.query.offset) || 0;
      const name = req.query.name || "";
      const city = req.query.city || "";
      const country = req.query.country || "";
      const isActive = req.query.isActive !== undefined ? req.query.isActive === "true" : undefined;
      const where = {};
      if (name) {
        where.name = { contains: name, mode: "insensitive" };
      }
      if (city) {
        where.city = { contains: city, mode: "insensitive" };
      }
      if (country) {
        where.country = { contains: country, mode: "insensitive" };
      }
      if (isActive !== undefined) {
        where.isActive = isActive;
      }
      const venues = await server.prisma.venue.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: "desc" },
      });
      if (!venues || venues.length === 0) {
        return reply.code(404).send({ message: "No se han encontrado venues" });
      }
      return reply.send({ venues });
    } catch (error) {
      console.error("Error al obtener venues:", error);
      return reply.code(500).send({ message: "Ha ocurrido un error interno" });
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
      const venue = req.body.venue;
      if (!venue) {
        return reply.code(400).send({ message: "Los datos del venue son obligatorios" });
      }
      const { name, country, city, direction, description, images, capacity, status } = venue;
      if (!name?.trim() || !country?.trim() || !city?.trim() || !direction?.trim()) {
        return reply.code(400).send({
          message: "Los campos 'name', 'country', 'city' y 'direction' son obligatorios",
        });
      }
      if (!description?.trim()) {
        return reply.code(400).send({
          message: "El campo 'description' es obligatorio",
        });
      }
      if (typeof capacity !== "number" || capacity <= 0) {
        return reply.code(400).send({
          message: "El campo 'capacity' debe ser un número positivo",
        });
      }
      if (images && !Array.isArray(images)) {
        return reply.code(400).send({ message: "El campo 'images' debe ser un array" });
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
      return reply.code(201).send({ venue: newVenue });
    } catch (error) {
      console.error("Error al crear el venue:", error);
      return reply.code(500).send({ message: "Ha ocurrido un error interno" });
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
        return reply.code(400).send({ message: "El slug es obligatorio" });
      }
      const venueData = req.body.venue;
      if (!venueData) {
        return reply.code(400).send({ message: "Los datos del venue son necesarios" });
      }
      const existingVenue = await server.prisma.venue.findUnique({ where: { slug } });
      if (!existingVenue) {
        return reply.code(404).send({ message: "No se ha encontrado un venue con ese slug" });
      }
      const updateData = {};
      if (venueData.name && venueData.name.trim().length > 0)
        updateData.name = venueData.name.trim();
      if (venueData.country && venueData.country.trim().length > 0)
        updateData.country = venueData.country.trim();
      if (venueData.city && venueData.city.trim().length > 0)
        updateData.city = venueData.city.trim();
      if (venueData.direction && venueData.direction.trim().length > 0)
        updateData.direction = venueData.direction.trim();
      if (venueData.description && venueData.description.trim().length > 0)
        updateData.description = venueData.description.trim();
      if (venueData.capacity !== undefined) {
        if (typeof venueData.capacity !== "number" || venueData.capacity <= 0) {
          return reply.code(400).send({
            message: "El campo 'capacity' debe ser un número positivo",
          });
        }
        updateData.capacity = venueData.capacity;
      }
      if (venueData.status) updateData.status = venueData.status;
      if (venueData.isActive !== undefined) updateData.isActive = Boolean(venueData.isActive);
      if (venueData.images) {
        if (!Array.isArray(venueData.images)) {
          return reply.code(400).send({ message: "El campo 'images' debe ser un array" });
        }
        updateData.images = venueData.images;
      }
      const updatedVenue = await server.prisma.venue.update({
        where: { slug },
        data: updateData,
      });
      return reply.code(200).send({
        message: "Venue actualizado correctamente",
        venue: updatedVenue,
      });
    } catch (error) {
      console.error("Error al actualizar venue:", error);
      return reply.code(500).send({
        message: "Ha ocurrido un error interno",
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
        return reply.code(400).send({ message: "El slug es obligatorio" });
      }
      const existingVenue = await server.prisma.venue.findUnique({ where: { slug } });
      if (!existingVenue) {
        return reply.code(404).send({ message: "No se ha encontrado un venue con ese slug" });
      }
      await server.prisma.venue.delete({ where: { slug } });
      return reply.code(200).send({ updated: true });
    } catch (error) {
      console.error("Error al eliminar venue:", error);
      return reply.code(500).send({ message: "Ha ocurrido un error interno", updated: false });
    }
  }
}

module.exports = fp(venue);
