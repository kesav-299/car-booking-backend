const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "car_booking"
});

db.connect(err => {
  if (err) console.log(err);
  else console.log("MySQL Connected");
});

app.post("/book", (req, res) => {
  const { name, car, days } = req.body;

  const sql = "INSERT INTO booking (name, car, days) VALUES (?, ?, ?)";
  db.query(sql, [name, car, days], (err, result) => {
    if (err) throw err;
    res.send("Booking successful");
  });
});

app.listen(3001, () => console.log("Server running on port 3001"));

app.get("/bookings", (req, res) => {
  db.query("SELECT * FROM booking", (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log("Server running on port " + PORT));