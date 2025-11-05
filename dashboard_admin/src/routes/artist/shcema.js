const S = require("fluent-json-schema").default;

const artistBody = S.object().prop(
  "artist",
  S.object()
    .prop("name", S.string().minLength(1).maxLength(100).required())
    .prop("nationality", S.string().minLength(1).maxLength(100).required())
    .prop("description", S.string().minLength(1).maxLength(1000).required())
    .prop("images", S.array().items(S.string()).default([]))
    .prop("categories", S.array().items(S.string()).default([]))
    .prop("isActive", S.boolean().default(true))
);

const artistResponse = S.object().prop(
  "artist",
  S.object()
    .prop("id", S.string())
    .prop("slug", S.string())
    .prop("name", S.string())
    .prop("nationality", S.string())
    .prop("description", S.string())
    .prop("images", S.array().items(S.string()))
    .prop("categories", S.array().items(S.string()))
    .prop("isActive", S.boolean())
    .prop("createdAt", S.string())
    .prop("updatedAt", S.string())
);

const artistsResponse = S.object().prop("artists", S.array().items(artistResponse.prop("artist")));

module.exports = {
  createArtist: {
    description: "Crear un nuevo artista",
    tags: ["Artist"],
    body: artistBody,
    response: {
      201: artistResponse,
      400: S.object().prop("message", S.string()),
      404: S.object().prop("message", S.string()),
      500: S.object().prop("message", S.string()),
    },
  },

  updateArtist: {
    description: "Actualizar un artista existente",
    tags: ["Artist"],
    params: S.object().prop("slug", S.string().required()),
    body: artistBody,
    response: {
      200: artistResponse.prop("message", S.string().default("Artista actualizado correctamente")),
      400: S.object().prop("message", S.string()),
      404: S.object().prop("message", S.string()),
      500: S.object().prop("message", S.string()),
    },
  },

  getArtist: {
    description: "Obtener un artista por slug",
    tags: ["Artist"],
    params: S.object().prop("slug", S.string().required()),
    response: {
      200: artistResponse,
      404: S.object().prop("message", S.string()),
      500: S.object().prop("message", S.string()),
    },
  },

  getArtists: {
    description: "Listar artistas con filtros y paginación",
    tags: ["Artist"],
    querystring: S.object()
      .prop("limit", S.number().default(4))
      .prop("offset", S.number().default(0))
      .prop("name", S.string())
      .prop("isActive", S.boolean()),
    response: {
      200: artistsResponse,
      404: S.object().prop("message", S.string()),
      500: S.object().prop("message", S.string()),
    },
  },

  deleteArtist: {
    description: "Eliminar un artista por slug",
    tags: ["Artist"],
    params: S.object().prop("slug", S.string().required()),
    response: {
      200: S.object().prop("updated", S.boolean()),
      404: S.object().prop("message", S.string()),
      500: S.object().prop("message", S.string()),
    },
  },
};
