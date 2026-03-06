import jwt from "jsonwebtoken";
import User from "../Models/User.js";


export const isAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    
    next();
  } catch (error) {
    console.log("AUTH ERROR:", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authenticated" });
  }

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

