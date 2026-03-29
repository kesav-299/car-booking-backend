import React, { useState, useEffect } from "react";

function App() {
  const [name, setName] = useState("");
  const [car, setCar] = useState("Swift");
  const [days, setDays] = useState(1);
  const [bookings, setBookings] = useState([]);

  // Fetch bookings
  const fetchBookings = async () => {
  const res = await fetch("https://car-booking-backend-dhaw.onrender.com/bookings");
    const data = await res.json();
    setBookings(data);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Handle booking
  const handleBooking = async () => {
    await fetch("https://car-booking-backend-dhaw.onrender.com/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, car, days })
    });

    alert("✅ Booking Confirmed!");
    fetchBookings();
  };

  return (
    <div style={{
      fontFamily: "Arial",
      backgroundColor: "#f4f6f8",
      minHeight: "100vh",
      padding: "20px"
    }}>

      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img 
          src="https://cdn-icons-png.flaticon.com/512/854/854894.png" 
          alt="logo" 
          width="50" 
        />
        <div>
          <h1 style={{ margin: 0 }}>Vargo 🚗</h1>
          <p style={{ margin: 0, color: "#555", fontSize: "14px" }}>
            Move Smarter. Travel Faster ⚡
          </p>
        </div>
      </div>

      {/* BOOKING FORM */}
      <div style={{
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        maxWidth: "400px",
        margin: "40px auto",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)"
      }}>
        <h2 style={{ textAlign: "center" }}>Book Your Ride</h2>

        <input
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
        />

        <select
          value={car}
          onChange={(e) => setCar(e.target.value)}
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
        >
          <option>Swift</option>
          <option>Innova</option>
          <option>Creta</option>
        </select>

        <input
          type="number"
          value={days}
          onChange={(e) => setDays(e.target.value)}
          style={{ width: "100%", padding: "10px", margin: "10px 0" }}
        />

        <button
          onClick={handleBooking}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#111827",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Book Now
        </button>
      </div>

      {/* BOOKINGS */}
      <div style={{ maxWidth: "500px", margin: "20px auto" }}>
        <h3>📋 Bookings</h3>

        {bookings.map((b) => (
          <div key={b.id} style={{
            background: "#fff",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
          }}>
            <p><b>Name:</b> {b.name}</p>
            <p><b>Car:</b> {b.car}</p>
            <p><b>Days:</b> {b.days}</p>
          </div>
        ))}
      </div>

      <p style={{ textAlign: "center", color: "#777" }}>
        © 2026 Vargo
      </p>
    </div>
  );
}

export default App;