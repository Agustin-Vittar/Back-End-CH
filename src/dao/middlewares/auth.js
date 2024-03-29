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
