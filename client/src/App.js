import React, { useState, useEffect } from "react";

function App() {
  const [name, setName] = useState("");
  const [car, setCar] = useState("Swift");
  const [days, setDays] = useState(1);
  const [bookings, setBookings] = useState([]);

  // Fetch bookings from backend
  const fetchBookings = async () => {
    const res = await fetch("http://localhost:3001/bookings");
    const data = await res.json();
    setBookings(data);
  };

  // Load bookings when page loads
  useEffect(() => {
    fetchBookings();
  }, []);

  // Handle booking
  const handleBooking = async () => {
    await fetch("http://localhost:3001/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, car, days })
    });

    alert("✅ Booking Confirmed!");
    fetchBookings(); // refresh bookings
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
          src="https://cdn-icons-png.flaticon.com/512/743/743922.png" 
          alt="logo" 
          width="50" 
        />
        <h1>QuickRide 🚗</h1>
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
            backgroundColor: "#000",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Book Now
        </button>
      </div>

      {/* BOOKINGS LIST */}
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
        © 2026 QuickRide
      </p>
    </div>
  );
}

export default App;