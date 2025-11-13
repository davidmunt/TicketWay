const S = require("fluent-json-schema").default;

const categoryBody = S.object().prop(
  "category",
  S.object()
    .prop("name", S.string().minLength(1).maxLength(100).required())
    .prop("description", S.string().minLength(1).maxLength(1000).required())
    .prop("image", S.string().default(""))
    .prop("isActive", S.boolean().default(true))
);

const categoryResponse = S.object().prop(
  "category",
  S.object()
    .prop("id", S.string())
    .prop("slug", S.string())
    .prop("name", S.string())
    .prop("description", S.string())
    .prop("image", S.string())
    .prop("concerts", S.array().items(S.string()).default([]))
    .prop("isActive", S.boolean())
    .prop("createdAt", S.string())
    .prop("updatedAt", S.string())
);

const categoriesResponse = S.object().prop(
  "categories",
  S.array().items(
    S.object()
      .prop("id", S.string())
      .prop("slug", S.string())
      .prop("name", S.string())
      .prop("description", S.string())
      .prop("image", S.string())
      .prop("concerts", S.array().items(S.string()).default([]))
      .prop("isActive", S.boolean())
      .prop("createdAt", S.string())
      .prop("updatedAt", S.string())
  )
);

module.exports = {
  createCategory: {
    description: "Crear una nueva categoría",
    tags: ["Category"],
    body: categoryBody,
    response: {
      201: categoryResponse
        .prop("success", S.boolean().default(true))
        .prop("message", S.string().default("Categoría creada correctamente")),
      400: S.object().prop("message", S.string()).prop("success", S.boolean().default(false)),
      404: S.object().prop("message", S.string()).prop("success", S.boolean().default(false)),
      500: S.object().prop("message", S.string()).prop("success", S.boolean().default(false)),
    },
  },

  updateCategory: {
    description: "Actualizar una categoría existente",
    tags: ["Category"],
    params: S.object().prop("slug", S.string().required()),
    body: categoryBody,
    response: {
      200: categoryResponse
        .prop("message", S.string().default("Categoría actualizada correctamente"))
        .prop("success", S.boolean().default(true)),
      400: S.object().prop("message", S.string()).prop("success", S.boolean().default(false)),
      404: S.object().prop("message", S.string()).prop("success", S.boolean().default(false)),
      500: S.object().prop("message", S.string()).prop("success", S.boolean().default(false)),
    },
  },

  getCategory: {
    description: "Obtener una categoría por slug",
    tags: ["Category"],
    params: S.object().prop("slug", S.string().required()),
    response: {
      200: categoryResponse,
      404: S.object().prop("message", S.string()),
      500: S.object().prop("message", S.string()),
    },
  },

  getCategories: {
    description: "Listar categorías con filtros y paginación",
    tags: ["Category"],
    querystring: S.object()
      .prop("limit", S.number().default(4))
      .prop("offset", S.number().default(0))
      .prop("name", S.string())
      .prop("isActive", S.boolean()),
    response: {
      200: categoriesResponse,
      404: S.object().prop("message", S.string()),
      500: S.object().prop("message", S.string()),
    },
  },

  deleteCategory: {
    description: "Eliminar una categoría por slug",
    tags: ["Category"],
    params: S.object().prop("slug", S.string().required()),
    response: {
      200: S.object().prop("success", S.boolean().default(true)),
      404: S.object().prop("message", S.string()).prop("success", S.boolean().default(false)),
      500: S.object().prop("message", S.string()).prop("success", S.boolean().default(false)),
    },
  },
};
