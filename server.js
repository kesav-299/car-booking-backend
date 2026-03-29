const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

// ✅ CORS
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://vargoo.vercel.app"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

// ✅ DB POOL (BETTER PERFORMANCE)
const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
  connectionLimit: 10
});

// ==============================
// 🚗 BOOKING APIs
// ==============================

app.post("/book", (req, res) => {

  const { name, car, days, user_id, from, to, startDate, endDate } = req.body;

  // 🔴 VALIDATION
  if (!user_id || !car || !from || !to || !startDate || !endDate) {
    return res.status(400).send("Missing booking details");
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end < start) {
    return res.status(400).send("Invalid date range");
  }

  // 🔥 CHECK DUPLICATE / OVERLAP
  const checkSql = `
    SELECT * FROM booking 
    WHERE user_id = ?
    AND (
      (startDate <= ? AND endDate >= ?) OR
      (startDate <= ? AND endDate >= ?)
    )
  `;

  db.query(
    checkSql,
    [user_id, startDate, startDate, endDate, endDate],
    (err, result) => {

      if (err) {
        console.log(err);
        return res.status(500).send("Error checking booking");
      }

      if (result.length > 0) {
        return res.status(400).send("Booking already exists in this date range");
      }

      // ✅ INSERT
      const insertSql = `
        INSERT INTO booking 
        (name, car, days, user_id, from_city, to_city, startDate, endDate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        insertSql,
        [name, car, days, user_id, from, to, startDate, endDate],
        (err) => {
          if (err) {
            console.log(err);
            return res.status(500).send("Error inserting booking");
          }

          res.send("Booking successful");
        }
      );
    }
  );
});

// ✅ GET USER BOOKINGS
app.get("/bookings/:user_id", (req, res) => {
  const user_id = req.params.user_id;

  db.query(
    "SELECT * FROM booking WHERE user_id = ? ORDER BY startDate DESC",
    [user_id],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Error fetching");
      }
      res.json(result);
    }
  );
});

// ==============================
// 🔐 AUTH APIs
// ==============================

// ✅ SIGNUP
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Missing fields");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword],
      (err) => {
        if (err) {
          return res.status(400).send("User already exists");
        }
        res.send("Signup successful");
      }
    );

  } catch {
    res.status(500).send("Server error");
  }
});

// ✅ LOGIN (FASTER + CLEAN)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {

      if (err) return res.status(500).send("Server error");

      if (result.length === 0) {
        return res.status(400).json("User not found");
      }

      const user = result[0];

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(400).json("Wrong password");
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET || "secretkey",
        { expiresIn: "1h" }
      );

      res.json({
        message: "Login successful",
        token,
        userId: user.id
      });
    }
  );
});

// ==============================
// 🌍 ROOT ROUTE
// ==============================

app.get("/", (req, res) => {
  res.send("🚗 Vargo API Running");
});

// ==============================
// 🚀 SERVER START
// ==============================

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Server running on port " + PORT));