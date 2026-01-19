import jwt from "jsonwebtoken";

const JWT_SEC = "myjsonwebtoken";

export const isAuth = (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "No token, access denied" });
  }
  

  try {
    const decoded = jwt.verify(token, JWT_SEC);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

export const requireSession = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    res.clearCookie("connect.sid");
    res.clearCookie("token");
    return res.status(401).json({ message: "Session expired" });
  }
  next();
};


