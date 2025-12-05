const Schema = require("fluent-json-schema");

const User = Schema.object()
  .prop("id", Schema.string())
  .prop("email", Schema.string())
  .prop("username", Schema.string())
  .prop("bio", Schema.string().raw({ type: ["string", "null"] })) // permite null
  .prop("image", Schema.string().raw({ type: ["string", "null"] })) // permite null
  .prop("isActive", Schema.boolean())
  .prop("createdAt", Schema.string().format("date-time"))
  .prop("updatedAt", Schema.string().format("date-time"))
  .prop("following", Schema.array().items(Schema.string()).default([]))
  .prop("followers", Schema.array().items(Schema.string()).default([]))
  .prop("favoriteConcert", Schema.array().items(Schema.string()).default([]));

const getUsers = {
  description: "Get users data",
  response: {
    200: Schema.object().prop("users", Schema.array().items(User)),
    500: Schema.object().prop("message", Schema.string()),
  },
};

const changeIsActive = {
  description: "Cambia el estado isActive de un usuario",
  params: Schema.object().prop("username", Schema.string().required()).description("Nombre del usuario cuyo estado cambiar"),
  body: Schema.object().prop("isActive", Schema.boolean().required()).description("Nuevo valor para el campo isActive"),
  response: {
    200: Schema.object().prop("success", Schema.boolean()).prop("message", Schema.string()),
    404: Schema.object().prop("message", Schema.string()),
    500: Schema.object().prop("message", Schema.string()),
  },
};

module.exports = {
  changeIsActive,
  getUsers,
};
