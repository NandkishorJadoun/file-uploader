const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

passport.use(
  new LocalStrategy(async (email, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return done(null, false, { message: "Incorrect Email." });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return done(null, false, { message: "Incorrect Password." });
      }

      return done(null, user);
    } catch (err) {
      console.log(err);
      return done(err);
    }
  }),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
