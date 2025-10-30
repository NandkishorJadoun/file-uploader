const path = require("node:path");
const express = require("express");
const expressSession = require("express-session");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
const accountsRouter = require("./routes/accountsRouter");
const passport = require("passport");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const isAuth = require("./middlewares/isAuth");

const app = express();

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

const prismaSessionStore = new PrismaSessionStore(new PrismaClient(), {
  checkPeriod: 2 * 60 * 1000,
  dbRecordIdIsSessionId: true,
  dbRecordIdFunction: undefined,
});

app.use(
  expressSession({
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000,
    },
    secret: "a santa at nasa",
    resave: true,
    saveUninitialized: true,
    store: prismaSessionStore,
  }),
);

app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use("/accounts", accountsRouter);

app.get("/", isAuth, (req, res) => {
  res.render("home");
});

app.post("/file", upload.single("file"), (req, res) => {
  res.redirect("/");
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.statusCode || 500).send(err.message);
});

app.listen(3000, (err) => {
  if (err) {
    throw err;
  }
  console.log("App listening on port 3000!");
});
