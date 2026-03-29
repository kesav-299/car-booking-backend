const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://vargoo.vercel.app"
  ],
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());

// ✅ Use Railway DB (environment variables)
const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

// Connect DB
db.connect(err => {
  if (err) {
    console.log("DB Error:", err);
  } else {
    console.log("MySQL Connected");
  }
});

// Insert booking
app.post("/book", (req, res) => {
  const { name, car, days } = req.body;

  const sql = "INSERT INTO booking (name, car, days) VALUES (?, ?, ?)";
  db.query(sql, [name, car, days], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error inserting");
    }
    res.send("Booking successful");
  });
});

// Get bookings
app.get("/bookings", (req, res) => {
  db.query("SELECT * FROM booking", (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Error fetching");
    }
    res.json(result);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Server running on port " + PORT));