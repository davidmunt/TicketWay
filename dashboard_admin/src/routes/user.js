const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function usuariosRoutes(fastify) {
  // Obtener todos
  fastify.get("/usuarios", async (req, reply) => {
    try {
      const usuarios = await prisma.usuario.findMany();
      if (usuarios.length === 0) {
        return reply.status(404).send({ message: "No se encontraron usuarios" });
      }
      return usuarios;
    } catch (err) {
      reply.status(500).send({ error: "Error al obtener usuarios", details: err.message });
    }
  });

  // Obtener por ID
  fastify.get("/usuarios/:id", async (req, reply) => {
    const { id } = req.params;
    try {
      const usuario = await prisma.usuario.findUnique({ where: { id } });
      if (!usuario) {
        return reply.status(404).send({ message: "Usuario no encontrado" });
      }
      return usuario;
    } catch (err) {
      reply.status(500).send({ error: "Error al obtener usuario", details: err.message });
    }
  });

  // Crear usuario
  fastify.post("/usuarios", async (req, reply) => {
    const { name, email } = req.body;
    try {
      const usuario = await prisma.usuario.create({
        data: { name, email },
      });
      reply.status(201).send({ message: "Usuario creado", usuario });
    } catch (err) {
      if (err.code === "P2002") {
        // Prisma error de duplicado
        reply.status(400).send({ error: "El email ya existe" });
      } else {
        reply.status(500).send({ error: "Error al crear usuario", details: err.message });
      }
    }
  });

  // Actualizar usuario
  fastify.put("/usuarios/:id", async (req, reply) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
      const usuario = await prisma.usuario.update({
        where: { id },
        data: { name, email },
      });
      reply.send({ message: "Usuario actualizado", usuario });
    } catch (err) {
      if (err.code === "P2025") {
        reply.status(404).send({ error: "Usuario no encontrado" });
      } else if (err.code === "P2002") {
        reply.status(400).send({ error: "El email ya existe" });
      } else {
        reply.status(500).send({ error: "Error al actualizar usuario", details: err.message });
      }
    }
  });

  // Eliminar usuario
  fastify.delete("/usuarios/:id", async (req, reply) => {
    const { id } = req.params;
    try {
      await prisma.usuario.delete({ where: { id } });
      reply.send({ message: "Usuario eliminado" });
    } catch (err) {
      if (err.code === "P2025") {
        reply.status(404).send({ error: "Usuario no encontrado" });
      } else {
        reply.status(500).send({ error: "Error al eliminar usuario", details: err.message });
      }
    }
  });
}

module.exports = userRoutes;
