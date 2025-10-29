const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/accounts/login");
  }
};

module.exports = isAuth;
