const Schema = require("fluent-json-schema");

const User = Schema.object()
  .prop("id", Schema.string().required())
  .prop("email", Schema.string().required())
  .prop("username", Schema.string().required())
  .prop("bio", Schema.string().required())
  .prop("image", Schema.string().required())
  .prop("isActive", Schema.boolean().required())
  .prop("createdAt", Schema.string().format("date-time").required())
  .prop("updatedAt", Schema.string().format("date-time").required());

const changeIsActive = {
  description: "Cambia el estado isActive de un usuario",
  params: Schema.object()
    .prop("username", Schema.string().required())
    .description("Nombre del usuario cuyo estado cambiar"),
  body: Schema.object()
    .prop("isActive", Schema.boolean().required())
    .description("Nuevo valor para el campo isActive"),
  response: {
    200: Schema.object().prop("success", Schema.boolean()).prop("message", Schema.string()),
    404: Schema.object().prop("message", Schema.string()),
    500: Schema.object().prop("message", Schema.string()),
  },
};

const getUsers = {
  description: "Get users data",
  response: {
    200: Schema.object().prop("user", User),
    500: Schema.object().prop("message", Schema.string()),
  },
};

module.exports = {
  changeIsActive,
  getUsers,
};
