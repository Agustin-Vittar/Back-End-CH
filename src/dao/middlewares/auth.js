<<<<<<< HEAD
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
  return res.status(403).render("error-page");
}
=======
export function checkUserRole(role) {
  return (req, res, next) => {
    if (req.session && req.session.user && req.session.user.role === role) {
      return next();
    } else {
      return res.status(403).json({ status: "Error", message: "Unauthorized" });
    }
  };
}

export const authorizeAdmin = checkUserRole("admin");
export const authorizeUser = checkUserRole("user");
>>>>>>> 9460772 (Preentrega Nº 3)
