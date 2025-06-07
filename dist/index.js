// server/index.ts
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import MemoryStore from "memorystore";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
var port = process.env.PORT || 3e3;
app.use(express.json());
var MemoryStoreSession = MemoryStore(session);
app.use(session({
  secret: process.env.SESSION_SECRET || "your-secret-key",
  resave: false,
  saveUninitialized: false,
  store: new MemoryStoreSession({
    checkPeriod: 864e5
    // prune expired entries every 24h
  }),
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1e3
    // 24 hours
  }
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      console.log("Login attempt:", { username, password });
      if (username === "admin" && password === "admin123") {
        return done(null, { id: 1, username: "admin" });
      }
      return done(null, false, { message: "Invalid credentials" });
    } catch (error) {
      console.error("Login error:", error);
      return done(error);
    }
  }
));
passport.serializeUser((user, done) => {
  console.log("Serializing user:", user);
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    console.log("Deserializing user:", id);
    if (id === 1) {
      return done(null, { id: 1, username: "admin" });
    }
    return done(null, false);
  } catch (error) {
    console.error("Deserialize error:", error);
    return done(error);
  }
});
var isAuthenticated = (req, res, next) => {
  console.log("Auth check:", { isAuthenticated: req.isAuthenticated(), session: req.session });
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
var upload = multer({ storage });
app.use(express.static(path.join(__dirname, "../client/dist")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.post("/api/admin/login", (req, res, next) => {
  console.log("Login request body:", req.body);
  passport.authenticate("local", (err, user, info) => {
    console.log("Auth callback:", { err, user, info });
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info.message || "Invalid credentials" });
    }
    req.logIn(user, (err2) => {
      if (err2) {
        return next(err2);
      }
      console.log("Login successful, session:", req.session);
      return res.json({ message: "Login successful" });
    });
  })(req, res, next);
});
app.post("/api/admin/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy error:", err);
        return res.status(500).json({ message: "Error during logout" });
      }
      res.clearCookie("connect.sid");
      res.json({ message: "Logout successful" });
    });
  });
});
app.get("/api/admin/stats", isAuthenticated, async (req, res) => {
  try {
    res.json({
      totalBooks: 0,
      totalCategories: 0,
      featuredBooks: 0
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});
app.get("*", (req, res) => {
  if (req.path.startsWith("/admin") && !req.isAuthenticated()) {
    return res.redirect("/admin/login");
  }
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
