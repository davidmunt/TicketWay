const S = require("fluent-json-schema").default;

// Request body para crear/actualizar artista
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

// Response de un artista
const artistResponse = S.object()
  .prop("id", S.string())
  .prop("slug", S.string())
  .prop("name", S.string())
  .prop("nationality", S.string())
  .prop("description", S.string())
  .prop("images", S.array().items(S.string()))
  .prop("categories", S.array().items(S.string()))
  .prop("isActive", S.boolean())
  .prop("createdAt", S.string())
  .prop("updatedAt", S.string());

// Response lista de artistas
const artistsResponse = S.object().prop("artists", S.array().items(artistResponse));

module.exports = {
  createArtist: {
    description: "Crear un nuevo artista",
    tags: ["Artist"],
    body: artistBody,
    response: {
      201: S.object()
        .prop("artist", artistResponse)
        .prop("message", S.string().default("Artista creado correctamente"))
        .prop("success", S.boolean().default(true)),
      400: S.object().prop("message", S.string()).prop("success", S.boolean().default(false)),
      500: S.object().prop("message", S.string()).prop("success", S.boolean().default(false)),
    },
  },

  updateArtist: {
    description: "Actualizar un artista existente",
    tags: ["Artist"],
    params: S.object().prop("slug", S.string().required()),
    body: artistBody,
    response: {
      200: S.object()
        .prop("artist", artistResponse)
        .prop("message", S.string().default("Artista actualizado correctamente"))
        .prop("success", S.boolean().default(true)),
      400: S.object().prop("message", S.string()).prop("success", S.boolean().default(false)),
      404: S.object().prop("message", S.string()).prop("success", S.boolean().default(false)),
      500: S.object().prop("message", S.string()).prop("success", S.boolean().default(false)),
    },
  },

  deleteArtist: {
    description: "Eliminar un artista por slug",
    tags: ["Artist"],
    params: S.object().prop("slug", S.string().required()),
    response: {
      200: S.object()
        .prop("message", S.string().default("Artista eliminado correctamente"))
        .prop("success", S.boolean().default(true)),
      404: S.object().prop("message", S.string()).prop("success", S.boolean().default(false)),
      500: S.object().prop("message", S.string()).prop("success", S.boolean().default(false)),
    },
  },

  getArtists: {
    description: "Listar artistas con filtros y paginación",
    tags: ["Artist"],
    querystring: S.object()
      .prop("limit", S.number().default(10))
      .prop("offset", S.number().default(0))
      .prop("name", S.string())
      .prop("isActive", S.boolean()),
    response: {
      200: artistsResponse,
      404: S.object().prop("message", S.string()),
      500: S.object().prop("message", S.string()),
    },
  },
};
