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

// ✅ DB CONNECTION
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

db.connect(err => {
  if (err) {
    console.log("DB Error:", err);
  } else {
    console.log("MySQL Connected");
  }
});


// ==============================
// 🚗 BOOKING APIs
// ==============================

// ✅ INSERT BOOKING WITH DUPLICATE CHECK
app.post("/book", (req, res) => {

  console.log("REQ BODY:", req.body); // 🔥 DEBUG (very important)

  const { name, car, days, user_id, from, to, startDate, endDate } = req.body;

  // 🔴 VALIDATION
  if (!startDate || !endDate || !from || !to) {
    return res.status(400).send("Missing booking details");
  }

  // 🔥 CHECK OVERLAPPING BOOKINGS
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

      // ❌ DUPLICATE FOUND
      if (result.length > 0) {
        return res.status(400).send("You already have a booking in this date range");
      }

      // ✅ INSERT BOOKING (FIXED)
      const insertSql = `
        INSERT INTO booking 
        (name, car, days, user_id, from_city, to_city, startDate, endDate)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        insertSql,
        [
          name,
          car,
          days,
          user_id,
          from || "UNKNOWN",
          to || "UNKNOWN",
          startDate || null,
          endDate || null
        ],
        (err) => {
          if (err) {
            console.log("INSERT ERROR:", err);
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

  const sql = `
    SELECT * FROM booking 
    WHERE user_id = ?
    ORDER BY startDate DESC
  `;

  db.query(sql, [user_id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error fetching");
    }
    res.json(result);
  });
});


// ==============================
// 🔐 AUTH APIs
// ==============================

// ✅ SIGNUP
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(sql, [name, email, hashedPassword], (err) => {
      if (err) {
        console.log(err);
        return res.status(500).send("User already exists");
      }
      res.send("Signup successful");
    });

  } catch {
    res.status(500).send("Error");
  }
});


// ✅ LOGIN
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) return res.status(500).send("Error");

    if (result.length === 0) {
      return res.status(400).send("User not found");
    }

    const user = result[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).send("Wrong password");
    }

    const token = jwt.sign({ id: user.id }, "secretkey", {
      expiresIn: "1h"
    });

    res.json({
      message: "Login successful",
      token,
      userId: user.id
    });
  });
});


// ==============================
// 🌍 ROOT ROUTE
// ==============================

app.get("/", (req, res) => {
  res.send("Vargo API Running 🚗");
});


// ==============================
// 🚀 SERVER START
// ==============================

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Server running on port " + PORT));