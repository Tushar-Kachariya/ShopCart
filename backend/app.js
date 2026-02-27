import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/conn.js";
import userRoutes from "./Routes/user.js";
import cors from "cors";
import MongoStore from "connect-mongo";
import adminRotes from "./Routes/admin.js";
import { isAdmin, isAuth, requireSession } from "./middleware/auth.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import path from "path";
import RegularUser from "./Routes/RegularUser.js";

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());

app.use(
  session({
    secret: "tusharkachariya2006",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 10,
      secure: false,
      httpOnly: true,
    },
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/test",
      collectionName: "sessions",
      ttl: 60 * 10,
    }),
  })
);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/", (req, res) => {
  res.send("Server is running...");
});
app.use("/api/user", userRoutes);

app.use("/api/RegularUser", RegularUser);

app.use("/api/admin", isAuth, isAdmin, requireSession, adminRotes);

app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
