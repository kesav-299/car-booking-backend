import React, { useState, useEffect } from "react";

function App() {

  // 🔐 AUTH STATES
  const [page, setPage] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🚗 BOOKING STATES
  const [car, setCar] = useState("Swift");
  const [days, setDays] = useState(1);
  const [bookings, setBookings] = useState([]);

  // =========================
  // 📡 FETCH BOOKINGS
  // =========================
  const fetchBookings = async () => {
    const res = await fetch("https://car-booking-backend-dhaw.onrender.com/bookings");
    const data = await res.json();
    setBookings(data);
  };

  useEffect(() => {
    if (page === "home") {
      fetchBookings();
    }
  }, [page]);

  // =========================
  // 🔐 LOGIN
  // =========================
  const handleLogin = async () => {
    const res = await fetch("https://car-booking-backend-dhaw.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    alert(data.message);

    if (data.token) {
     localStorage.setItem("user_id", data.userId);  // 👈 ADD
     setPage("home");
    } 
 };

  // =========================
  // 📝 SIGNUP
  // =========================
  const handleSignup = async () => {
    await fetch("https://car-booking-backend-dhaw.onrender.com/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    });

    alert("Signup successful");
    setPage("login");
  };

  // =========================
  // 🚗 BOOKING
  // =========================
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

  // =========================
  // 🔐 LOGIN UI
  // =========================
  if (page === "login") {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Login 🚗</h2>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        /><br /><br />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        /><br /><br />

        <button onClick={handleLogin}>Login</button>

        <p style={{ cursor: "pointer" }} onClick={() => setPage("signup")}>
          Don't have account? Signup
        </p>
      </div>
    );
  }

  // =========================
  // 📝 SIGNUP UI
  // =========================
  if (page === "signup") {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Signup 🚗</h2>

        <input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        /><br /><br />

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        /><br /><br />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        /><br /><br />

        <button onClick={handleSignup}>Signup</button>

        <p style={{ cursor: "pointer" }} onClick={() => setPage("login")}>
          Already have account? Login
        </p>
      </div>
    );
  }

  // =========================
  // 🏠 HOME (BOOKING UI)
  // =========================
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
          <p style={{ margin: 0, color: "#555" }}>
            Move Smarter. Travel Faster ⚡
          </p>
        </div>
      </div>

      {/* LOGOUT */}
      <button onClick={() => setPage("login")} style={{ float: "right" }}>
        Logout
      </button>

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
        />

        <select value={car} onChange={(e) => setCar(e.target.value)}>
          <option>Swift</option>
          <option>Innova</option>
          <option>Creta</option>
        </select>

        <input
          type="number"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        />

        <button onClick={handleBooking}>
          Book Now
        </button>
      </div>

      {/* BOOKINGS */}
      <div style={{ maxWidth: "500px", margin: "20px auto" }}>
        <h3>📋 Bookings</h3>

        {bookings.map((b) => (
          <div key={b.id}>
            <p><b>Name:</b> {b.name}</p>
            <p><b>Car:</b> {b.car}</p>
            <p><b>Days:</b> {b.days}</p>
          </div>
        ))}
      </div>

      <p style={{ textAlign: "center" }}>© 2026 Vargo</p>
    </div>
  );
}

export default App;