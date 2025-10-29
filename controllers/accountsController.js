const bcrypt = require("bcryptjs");
const passport = require("../middlewares/passport");
const { PrismaClient } = require("@prisma/client");
const CustomNotFoundError = require("../errors/CustomNotFoundError");

const prisma = new PrismaClient();

const signupGet = (req, res) => {
  res.render("signup");
};

const signupPost = async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  if(!hashedPassword){
    throw new CustomNotFoundError("Hashed Password Not Found")
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  res.redirect("/accounts/login");
};

const loginGet = (req, res) => {
  res.render("login");
};

const loginPost = (req, res, next) => {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render("login", { info });
    }

    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);
};

const logoutGet = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

module.exports = {
  signupGet,
  signupPost,
  loginGet,
  loginPost,
  logoutGet,
};
