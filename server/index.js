process.env.TZ = "Asia/Kolkata";

import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import EmailRouter from "./router/email.js";
import UserRouter from "./router/user.router.js";
import http from "http";
// import admin from "firebase-admin";
import fs from "fs";

dotenv.config();

// const serviceAccount = JSON.parse(
//   fs.readFileSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
// );
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

const app = express();
const server = http.createServer(app);
// const io = initializeSocket(server);

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

const PORT = process.env.PORT || 5000;

// app.use((req, res, next) => {
//   req.io = io;
//   next();
// });

app.get("/", (req, res) => {
  res.send("Welcome to the Crop recommedaton project");
});

app.use("/api", EmailRouter);
app.use("/api/user", UserRouter);

mongoose
  .connect(process.env.MONGODB_URI, { dbName: "clone1" })
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.error("MongoDB connection error:", error));



