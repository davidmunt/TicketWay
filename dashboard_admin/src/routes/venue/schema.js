const S = require("fluent-json-schema").default;

// Body para crear o actualizar venue
const venueBody = S.object().prop(
  "venue",
  S.object()
    .prop("name", S.string().minLength(1).maxLength(150).required())
    .prop("country", S.string().minLength(1).maxLength(100).required())
    .prop("city", S.string().minLength(1).maxLength(100).required())
    .prop("direction", S.string().minLength(1).maxLength(200).required())
    .prop("description", S.string().minLength(1).maxLength(1000).required())
    .prop("images", S.array().items(S.string()).default([]))
    .prop("capacity", S.number().minimum(1).required())
    .prop(
      "status",
      S.string().enum(["PENDING", "OPEN", "CLOSED", "MAINTAINMENT"]).default("PENDING")
    )
    .prop("isActive", S.boolean().default(true))
);

// Response de un venue individual
const venueResponse = S.object()
  .prop("id", S.string())
  .prop("slug", S.string())
  .prop("name", S.string())
  .prop("country", S.string())
  .prop("city", S.string())
  .prop("direction", S.string())
  .prop("description", S.string())
  .prop("images", S.array().items(S.string()))
  .prop("capacity", S.number())
  .prop("status", S.string())
  .prop("isActive", S.boolean())
  .prop("createdAt", S.string())
  .prop("updatedAt", S.string());

// Response de múltiples venues
const venuesResponse = S.object()
  .prop("venues", S.array().items(venueResponse))
  .prop("success", S.boolean().default(true));

// Export de los schemas para cada endpoint
module.exports = {
  createVenue: {
    description: "Crear un nuevo venue",
    tags: ["Venue"],
    body: venueBody,
    response: {
      201: S.object()
        .prop("message", S.string().default("Venue creado correctamente"))
        .prop("venue", venueResponse)
        .prop("success", S.boolean().default(true)),
      400: S.object().prop("message", S.string()).prop("success", S.boolean().default(false)),
      500: S.object().prop("message", S.string()).prop("success", S.boolean().default(false)),
    },
  },

  updateVenue: {
    description: "Actualizar un venue existente",
    tags: ["Venue"],
    params: S.object().prop("slug", S.string().required()),
    body: venueBody,
    response: {
      200: S.object()
        .prop("message", S.string().default("Venue actualizado correctamente"))
        .prop("venue", venueResponse)
        .prop("success", S.boolean().default(true)),
      400: S.object().prop("message", S.string()).prop("success", S.boolean().default(false)),
      404: S.object().prop("message", S.string()).prop("success", S.boolean().default(false)),
      500: S.object().prop("message", S.string()).prop("success", S.boolean().default(false)),
    },
  },

  getVenue: {
    description: "Obtener un venue por slug",
    tags: ["Venue"],
    params: S.object().prop("slug", S.string().required()),
    response: {
      200: S.object().prop("venue", venueResponse).prop("success", S.boolean().default(true)),
      404: S.object().prop("message", S.string()).prop("success", S.boolean().default(false)),
      500: S.object().prop("message", S.string()).prop("success", S.boolean().default(false)),
    },
  },

  getVenues: {
    description: "Listar venues con filtros y paginación",
    tags: ["Venue"],
    querystring: S.object()
      .prop("limit", S.number().default(10))
      .prop("offset", S.number().default(0))
      .prop("name", S.string())
      .prop("city", S.string())
      .prop("country", S.string())
      .prop("isActive", S.boolean()),
    response: {
      200: venuesResponse,
      404: S.object().prop("message", S.string()).prop("success", S.boolean().default(false)),
      500: S.object().prop("message", S.string()).prop("success", S.boolean().default(false)),
    },
  },

  deleteVenue: {
    description: "Eliminar un venue por slug",
    tags: ["Venue"],
    params: S.object().prop("slug", S.string().required()),
    response: {
      200: S.object()
        .prop("message", S.string().default("Venue eliminado correctamente"))
        .prop("success", S.boolean().default(true)),
      404: S.object().prop("message", S.string()).prop("success", S.boolean().default(false)),
      500: S.object().prop("message", S.string()).prop("success", S.boolean().default(false)),
    },
  },
};
