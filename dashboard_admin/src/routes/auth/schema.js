const Schema = require("fluent-json-schema");

const UserAdmin = Schema.object()
  .prop("id", Schema.string().required())
  .prop("email", Schema.string().required())
  .prop("username", Schema.string().required())
  .prop("image", Schema.string().required())
  .prop("isActive", Schema.boolean().required())
  .prop("createdAt", Schema.string().format("date-time").required())
  .prop("updatedAt", Schema.string().format("date-time").required());

const register = {
  body: Schema.object()
    .id("http://localhost:3003/api/auth/register")
    .title("UserAdmin Register")
    .description("Register a new user admin")
    .prop(
      "user",
      Schema.object()
        .prop("username", Schema.string().required())
        .prop("email", Schema.string().required())
        .prop("password", Schema.string().required())
    )
    .required(),
  response: {
    200: Schema.object().prop("user", UserAdmin).prop("accessToken", Schema.string()),
    409: Schema.object().prop("message", Schema.string()),
  },
};

const login = {
  body: Schema.object()
    .id("http://localhost:3003/api/auth/login")
    .title("UserAdmin Login")
    .description("Login user admin")
    .prop(
      "user",
      Schema.object()
        .prop("email", Schema.string().required())
        .prop("password", Schema.string().required())
    )
    .required(),
  response: {
    200: Schema.object().prop("user", UserAdmin).prop("accessToken", Schema.string()),
    401: Schema.object().prop("message", Schema.string()),
  },
};

const userAdminData = {
  description: "Get useradmin data",
  response: {
    200: Schema.object().prop("user", UserAdmin),
    401: Schema.object().prop("message", Schema.string()),
  },
};

const refreshToken = {
  description: "Refres access token",
  response: {
    200: Schema.object().prop("token", Schema.string()),
    401: Schema.object().prop("message", Schema.string()),
  },
};

module.exports = {
  register,
  login,
  userAdminData,
  refreshToken,
};
