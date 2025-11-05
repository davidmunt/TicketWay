const S = require("fluent-json-schema").default;

const concertBody = S.object().prop(
  "concert",
  S.object()
    .prop("name", S.string().minLength(1).maxLength(200).required())
    .prop("date", S.string().format("date-time").required())
    .prop("price", S.number().minimum(0).required())
    .prop("description", S.string().minLength(1).maxLength(2000).required())
    .prop("images", S.array().items(S.string()).default([]))
    .prop("venue", S.string().required())
    .prop("category", S.string().required())
    .prop("artists", S.array().items(S.string()).default([]))
    .prop("availableSeats", S.number().default(0))
    .prop("status", S.string().default("PENDING"))
    .prop("isActive", S.boolean().default(true))
);

const concertResponse = S.object().prop(
  "concert",
  S.object()
    .prop("id", S.string())
    .prop("slug", S.string())
    .prop("name", S.string())
    .prop("date", S.string())
    .prop("price", S.number())
    .prop("description", S.string())
    .prop("images", S.array().items(S.string()))
    .prop("venue", S.string())
    .prop("category", S.string())
    .prop("artists", S.array().items(S.string()))
    .prop("availableSeats", S.number())
    .prop("status", S.string())
    .prop("isActive", S.boolean())
    .prop("favoritesCount", S.number())
    .prop("createdAt", S.string())
    .prop("updatedAt", S.string())
);

const concertsResponse = S.object().prop(
  "concerts",
  S.array().items(concertResponse.prop("concert"))
);

module.exports = {
  createConcert: {
    description: "Crear un nuevo concierto",
    tags: ["Concert"],
    body: concertBody,
    response: {
      201: concertResponse,
      400: S.object().prop("message", S.string()),
      404: S.object().prop("message", S.string()),
      500: S.object().prop("message", S.string()),
    },
  },

  updateConcert: {
    description: "Actualizar un concierto existente",
    tags: ["Concert"],
    params: S.object().prop("slug", S.string().required()),
    body: concertBody,
    response: {
      200: concertResponse.prop(
        "message",
        S.string().default("Concierto actualizado correctamente")
      ),
      400: S.object().prop("message", S.string()),
      404: S.object().prop("message", S.string()),
      500: S.object().prop("message", S.string()),
    },
  },

  getConcert: {
    description: "Obtener un concierto por slug",
    tags: ["Concert"],
    params: S.object().prop("slug", S.string().required()),
    response: {
      200: concertResponse,
      404: S.object().prop("message", S.string()),
      500: S.object().prop("message", S.string()),
    },
  },

  getConcerts: {
    description: "Listar conciertos con filtros y paginación",
    tags: ["Concert"],
    querystring: S.object()
      .prop("limit", S.number().default(4))
      .prop("offset", S.number().default(0))
      .prop("name", S.string())
      .prop("venue", S.string())
      .prop("category", S.string())
      .prop("date", S.string())
      .prop("isActive", S.boolean()),
    response: {
      200: concertsResponse,
      404: S.object().prop("message", S.string()),
      500: S.object().prop("message", S.string()),
    },
  },

  deleteConcert: {
    description: "Eliminar un concierto por slug",
    tags: ["Concert"],
    params: S.object().prop("slug", S.string().required()),
    response: {
      200: S.object().prop("updated", S.boolean()),
      404: S.object().prop("message", S.string()),
      500: S.object().prop("message", S.string()),
    },
  },
};
