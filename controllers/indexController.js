const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getHomePage = async (req, res) => {
  const currentUser = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    include: {
      folders: true,
    },
  });

  res.render("home", { currentUser });
};

module.exports = {
  getHomePage,
};
