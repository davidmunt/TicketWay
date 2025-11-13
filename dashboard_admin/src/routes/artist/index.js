const fp = require("fastify-plugin");
const schema = require("./shcema");
const createError = require("http-errors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function artist(server, options) {
  server.route({
    method: "GET",
    url: options.prefix + "artist/:slug",
    schema: schema.getArtist,
    onRequest: [server.authenticate],
    handler: onGetArtist,
  });
  async function onGetArtist(req, reply) {
    try {
      const slug = req.params.slug;
      if (!slug) {
        return reply.code(404).send({ message: "El slug es necesario para la funcion" });
      }
      const artist = await server.prisma.artist.findUnique({
        where: { slug: slug },
      });
      if (!artist) {
        return reply.code(404).send({ message: "No se ha encontrado un artista con ese slug" });
      }
      return { artist: artist };
    } catch (error) {
      return reply.code(500).send({ message: "Ha ocurrido un error" });
    }
  }

  server.route({
    method: "GET",
    url: options.prefix + "artists",
    schema: schema.getArtists,
    onRequest: [server.authenticate],
    handler: onGetArtists,
  });
  async function onGetArtists(req, reply) {
    try {
      const limit = Number(req.query.limit) || 4;
      const offset = Number(req.query.offset) || 0;
      const name = req.query.name || "";
      const isActive = req.query.isActive !== undefined ? req.query.isActive === "true" : undefined;
      const where = {};
      if (name) {
        where.name = { contains: name, mode: "insensitive" };
      }
      if (isActive !== undefined) {
        where.isActive = isActive;
      }
      // const artists = await server.prisma.artist.findMany({
      //   where,
      //   take: limit,
      //   skip: offset,
      //   orderBy: { createdAt: "desc" },
      // });
      const artists = await server.prisma.artist.findMany({
        orderBy: { createdAt: "desc" },
      });
      // if (!artists || artists.length === 0) {
      //   return reply.code(404).send({ message: "No se han encontrado artistas" });
      // }
      return reply.send({ artists: artists });
    } catch (error) {
      return reply.code(500).send({ message: "Ha ocurrido un error" });
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
    url: options.prefix + "artist",
    onRequest: [server.authenticate],
    schema: schema.createArtist,
    handler: onCreateArtist,
  });
  async function onCreateArtist(req, reply) {
    try {
      const { name, nationality, description, categories, images } = req.body;
      if (!name || !nationality || !description) {
        return reply.code(400).send({
          message: "Los campos 'name', 'nationality' y 'description' son obligatorios",
          success: false,
        });
      }
      if (images && !Array.isArray(images)) {
        return reply.code(400).send({
          message: "El campo 'images' debe ser un array",
          success: false,
        });
      }
      let slug = generateSlug(name);
      let exists = await server.prisma.artist.findUnique({ where: { slug } });
      while (exists) {
        slug = generateSlug(name);
        exists = await server.prisma.artist.findUnique({ where: { slug } });
      }
      let validCategories = [];
      if (categories && Array.isArray(categories) && categories.length > 0) {
        const cleanCategories = categories.filter((c) => typeof c === "string" && c.trim() !== "");
        if (cleanCategories.length === 0) {
          return reply.code(400).send({
            message: "Las categorías proporcionadas no son válidas",
            success: false,
          });
        }
        validCategories = await server.prisma.category.findMany({
          where: { id: { in: cleanCategories } },
          select: { id: true },
        });
        if (validCategories.length < cleanCategories.length) {
          return reply.code(404).send({
            message: "Una o más categorías seleccionadas no existen",
            success: false,
          });
        }
      }
      const newArtist = await server.prisma.artist.create({
        data: {
          name: name.trim(),
          slug,
          nationality: nationality.trim(),
          description: description.trim(),
          images: images || [],
          categories: validCategories.map((c) => c.id),
          isActive: true,
        },
      });
      return reply.code(201).send({
        message: "Artista creado correctamente",
        artist: newArtist,
        success: true,
      });
    } catch (error) {
      return reply.code(500).send({
        message: `Ha ocurrido un error interno: ${error.message}`,
        success: false,
      });
    }
  }

  server.route({
    method: "PUT",
    url: options.prefix + "artist/:slug",
    onRequest: [server.authenticate],
    schema: schema.updateArtist,
    handler: onUpdateArtist,
  });
  async function onUpdateArtist(req, reply) {
    try {
      const slug = req.params.slug;
      if (!slug) {
        return reply.code(400).send({ message: "El slug es obligatorio", success: false });
      }
      const { name, nationality, description, categories, images, isActive } = req.body;
      const existingArtist = await server.prisma.artist.findUnique({ where: { slug } });
      if (!existingArtist) {
        return reply
          .code(404)
          .send({ message: "No se ha encontrado un artista con ese slug", success: false });
      }
      const updateData = {};
      if (name) updateData.name = name.trim();
      if (nationality) updateData.nationality = nationality.trim();
      if (description) updateData.description = description.trim();
      if (isActive !== undefined) updateData.isActive = isActive;
      if (images) {
        if (!Array.isArray(images)) {
          return reply
            .code(400)
            .send({ message: "El campo 'images' debe ser un array", success: false });
        }
        updateData.images = images;
      }
      if (categories) {
        if (!Array.isArray(categories)) {
          return reply
            .code(400)
            .send({ message: "El campo 'categories' debe ser un array", success: false });
        }
        const validCategories = await server.prisma.category.findMany({
          where: { id: { in: categories } },
          select: { id: true },
        });
        if (validCategories.length < categories.length) {
          return reply
            .code(404)
            .send({ message: "Una o mas categorias proporcionadas no existen", success: false });
        }
        updateData.categories = validCategories.map((c) => c.id);
      }
      const updatedArtist = await server.prisma.artist.update({
        where: { slug },
        data: updateData,
      });
      return reply.code(200).send({
        message: "Artista actualizado correctamente",
        artist: updatedArtist,
        success: true,
      });
    } catch (error) {
      return reply.code(500).send({
        message: `Ha ocurrido un error interno${error}`,
        success: false,
      });
    }
  }

  server.route({
    method: "DELETE",
    url: options.prefix + "artist/:slug",
    onRequest: [server.authenticate],
    schema: schema.deleteArtist,
    handler: onDeleteArtist,
  });
  async function onDeleteArtist(req, reply) {
    try {
      const slug = req.params.slug;
      if (!slug) {
        return reply
          .code(404)
          .send({ message: "El slug es necesario para la funcion", success: false });
      }
      const existingArtist = await server.prisma.artist.findUnique({ where: { slug } });
      if (!existingArtist) {
        return reply
          .code(404)
          .send({ message: "No se ha encontrado un artista con ese slug", success: false });
      }
      await server.prisma.artist.delete({ where: { slug } });
      return reply.send({ success: true, message: "Artista eliminado correctamente" });
    } catch (error) {
      return reply.code(500).send({ message: "Ha ocurrido un error", success: false });
    }
  }
}

module.exports = fp(artist);
