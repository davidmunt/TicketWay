const fp = require("fastify-plugin");
const schema = require("./schema");
const createError = require("http-errors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function category(server, options) {
  server.route({
    method: "GET",
    url: options.prefix + "category/:slug",
    schema: schema.getCategory,
    onRequest: [server.authenticate],
    handler: onGetCategory,
  });
  async function onGetCategory(req, reply) {
    try {
      const slug = req.params.slug;
      if (!slug) {
        return reply.code(404).send({ message: "El slug es necesario para la funcion" });
      }
      const category = await server.prisma.category.findUnique({
        where: { slug: slug },
      });
      if (!category) {
        return reply.code(404).send({ message: "No se ha encontrado una categoria con ese slug" });
      }
      return { category: category };
    } catch (error) {
      return reply.code(500).send({ message: "Ha ocurrido un error" });
    }
  }

  server.route({
    method: "GET",
    url: options.prefix + "categories",
    schema: schema.getCategories,
    onRequest: [server.authenticate],
    handler: onGetCategories,
  });
  async function onGetCategories(req, reply) {
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
      const categories = await server.prisma.category.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { createdAt: "desc" },
      });
      if (!categories || categories.length === 0) {
        return reply.code(404).send({ message: "No se han encontrado categorias" });
      }
      return reply.send({ categories });
    } catch (error) {
      console.error("Error al obtener categorias:", error);
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
    url: options.prefix + "category",
    onRequest: [server.authenticate],
    schema: schema.createCategory,
    handler: onCreateCategory,
  });
  async function onCreateCategory(req, reply) {
    try {
      const category = req.body.category;
      if (!category) {
        return reply.code(400).send({ message: "Los datos de la categoria son obligatorios" });
      }
      const { name, description, image } = category;
      if (!name?.trim() || !description?.trim()) {
        return reply.code(400).send({
          message: "Los campos 'name' y 'description' son obligatorios",
        });
      }
      let slug = generateSlug(name);
      let exists = await server.prisma.category.findUnique({ where: { slug } });
      while (exists) {
        slug = generateSlug(name);
        exists = await server.prisma.category.findUnique({ where: { slug } });
      }
      const newCategory = await server.prisma.category.create({
        data: {
          name: name.trim(),
          slug,
          description: description.trim(),
          image: image || "",
          isActive: true,
        },
      });
      return reply.code(201).send({ category: newCategory });
    } catch (error) {
      console.error("Error al crear la categoria:", error);
      return reply.code(500).send({ message: "Ha ocurrido un error interno" });
    }
  }

  server.route({
    method: "PUT",
    url: options.prefix + "category/:slug",
    onRequest: [server.authenticate],
    schema: schema.updateCategory,
    handler: onUpdateCategory,
  });

  async function onUpdateCategory(req, reply) {
    try {
      const slug = req.params.slug;
      if (!slug) {
        return reply.code(400).send({ message: "El slug es obligatorio" });
      }
      const categoryData = req.body.category;
      if (!categoryData) {
        return reply.code(400).send({ message: "Los datos de la categoria son necesarios" });
      }
      const existingCategory = await server.prisma.category.findUnique({ where: { slug } });
      if (!existingCategory) {
        return reply.code(404).send({ message: "No se ha encontrado una categoria con ese slug" });
      }
      const updateData = {};
      if (categoryData.name && categoryData.name.trim().length > 0)
        updateData.name = categoryData.name.trim();
      if (categoryData.description) updateData.description = categoryData.description.trim();
      if (categoryData.isActive !== undefined) updateData.isActive = categoryData.isActive;
      if (categoryData.image) updateData.image = categoryData.image;
      const updatedCategory = await server.prisma.category.update({
        where: { slug },
        data: updateData,
      });
      return reply.code(200).send({
        message: "Categoria actualizado correctamente",
        category: updatedCategory,
      });
    } catch (error) {
      console.error("Error al actualizar categoria:", error);
      return reply.code(500).send({
        message: "Ha ocurrido un error interno",
      });
    }
  }

  server.route({
    method: "DELETE",
    url: options.prefix + "category/:slug",
    onRequest: [server.authenticate],
    schema: schema.deleteCategory,
    handler: onDeleteCategory,
  });
  async function onDeleteCategory(req, reply) {
    try {
      const slug = req.params.slug;
      if (!slug) {
        return reply.code(404).send({ message: "El slug es necesario para la funcion" });
      }
      const existingCategory = await server.prisma.category.findUnique({ where: { slug } });
      if (!existingCategory) {
        return reply.code(404).send({ message: "No se ha encontrado una categoria con ese slug" });
      }
      await server.prisma.category.delete({ where: { slug } });
      return reply.send({ updated: true });
    } catch (error) {
      console.error("Error al eliminar la categoria:", error);
      return reply.code(500).send({ message: "Ha ocurrido un error", updated: false });
    }
  }
}

module.exports = fp(category);
