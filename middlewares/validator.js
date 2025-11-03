const { body } = require("express-validator");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const signup = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name field shouldn't be empty.")
    .isAlpha("en-US", { ignore: " " })
    .withMessage("Name field must only contain letters.")
    .isLength({ min: 4, max: 20 })
    .withMessage("Name must be between 4 and 20 characters."),

  body("email")
    .isEmail()
    .withMessage("Email must be valid")
    .custom(async (email) => {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (user) {
        throw new Error("Email is already in use.");
      }
      return true;
    }),

  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Minimum Length of Password should be 6 Characters."),

  body("confirmPassword").custom((password, { req }) => {
    if (password !== req.body.password) {
      throw new Error("Both Passwords are not matching.");
    }
    return true;
  }),
];

module.exports = {
  signup,
};
