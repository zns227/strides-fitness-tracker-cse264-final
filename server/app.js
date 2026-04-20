import express from "express";
import cors from "cors";
import "dotenv/config";
import session from "express-session";

import authRoutes from "./routes/auth.js";
import workoutRoutes from "./routes/workouts.js";
import dashboardRoutes from "./routes/dashboard.js";
import connectDB from "./db/mongo.js";

const app = express();

app.set("port", process.env.PORT || 3000);

// middleware
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(session({
  secret: "strides-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true
  }
}));

// connect MongoDB
connectDB();

// routes
app.use("/api/auth", authRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/dashboard", dashboardRoutes);

// test route
app.get("/", (req, res) => {
  res.send("Strides API is running 🚀");
});

app.listen(app.get("port"), () => {
  console.log(`Server running on http://localhost:${app.get("port")}`);
});