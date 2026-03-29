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

// ✅ INSERT BOOKING (WITH USER_ID)
app.post("/book", (req, res) => {
  const { name, car, days, user_id } = req.body;

  const sql = "INSERT INTO booking (name, car, days, user_id) VALUES (?, ?, ?, ?)";
  
  db.query(sql, [name, car, days, user_id], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error inserting");
    }
    res.send("Booking successful");
  });
});


// ✅ GET BOOKINGS FOR SPECIFIC USER
app.get("/bookings/:user_id", (req, res) => {
  const user_id = req.params.user_id;

  const sql = "SELECT * FROM booking WHERE user_id = ?";

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
    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("User already exists");
      }
      res.send("Signup successful");
    });
  } catch (err) {
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

    // ✅ SEND USER ID ALSO
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