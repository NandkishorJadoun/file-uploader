const { Router } = require("express");
const accountsController = require("../controllers/accountsController");

const accountsRouter = new Router();

accountsRouter.get("/signup", accountsController.signupGet);
accountsRouter.post("/signup", accountsController.signupPost);
accountsRouter.get("/login", accountsController.loginGet);
accountsRouter.post("/login", accountsController.loginPost);

module.exports = accountsRouter;
