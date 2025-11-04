const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports = function () {
  return {
    getUserAdminByEmail: async function (userId) {
      return await prisma.userAdmin.findUnique({
        where: { id: userId },
      });
    },

    getUserAdminByEmail: async function (email) {
      return await prisma.userAdmin.findUnique({
        where: { email },
      });
    },

    getUserAdminByUsername: async function (username) {
      return await prisma.userAdmin.findUnique({
        where: { username },
      });
    },

    registerUserAdmin: async function (user) {
      const newUser = await prisma.userAdmin.create({
        data: {
          email: user.email,
          username: user.username,
          image: user.image || "https://static.productionready.io/images/smiley-cyrus.jpg",
          password: user.password,
        },
      });
      return newUser;
    },
  };
};
