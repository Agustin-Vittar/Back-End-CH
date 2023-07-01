export function checkUser(req, res, next) {
  if (req.session.role === "user") {
    return next();
  }
  return res.status(401).render("error-page");
}

export function checkAdmin(req, res, next) {
  if (req.session.role === "admin") {
    return next();
  }
  return res.status(401).render("error-page");
}
