import React, { useState, useEffect } from "react";

function App() {

  // 🔐 AUTH STATES
  const [page, setPage] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🚗 BOOKING STATES
  const [car, setCar] = useState("Swift");
  const [days, setDays] = useState(1);
  const [bookings, setBookings] = useState([]);

  // =========================
  // 📡 FETCH BOOKINGS (USER BASED)
  // =========================
  const fetchBookings = async () => {
    const user_id = localStorage.getItem("user_id");

    const res = await fetch(
      `https://car-booking-backend-dhaw.onrender.com/bookings/${user_id}`
    );

    const data = await res.json();
    setBookings(data);
  };

  useEffect(() => {
    if (page === "home") {
      fetchBookings();
    }
  }, [page]);

  // =========================
  // 🔐 LOGIN (FIXED + LOADING)
  // =========================
  const handleLogin = async () => {
    setLoading(true);

    try {
      const res = await fetch("https://car-booking-backend-dhaw.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const text = await res.text();

      if (!res.ok) {
        alert(text);
        setLoading(false);
        return;
      }

      const data = JSON.parse(text);

      localStorage.setItem("user_id", data.userId);

      alert("Login successful");
      setPage("home");

    } catch (err) {
      alert("Network error");
    }

    setLoading(false);
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
    const user_id = localStorage.getItem("user_id");

    await fetch("https://car-booking-backend-dhaw.onrender.com/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, car, days, user_id })
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

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

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
  // 🏠 HOME UI
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
      <button onClick={() => {
        localStorage.removeItem("user_id");
        setPage("login");
      }} style={{ float: "right" }}>
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
        /><br /><br />

        <select value={car} onChange={(e) => setCar(e.target.value)}>
          <option>Swift</option>
          <option>Innova</option>
          <option>Creta</option>
        </select><br /><br />

        <input
          type="number"
          value={days}
          onChange={(e) => setDays(e.target.value)}
        /><br /><br />

        <button onClick={handleBooking}>
          Book Now
        </button>
      </div>

      {/* BOOKINGS */}
      <div style={{ maxWidth: "500px", margin: "20px auto" }}>
        <h3>📋 Your Bookings</h3>

        {bookings.length === 0 && <p>No bookings yet</p>}

        {bookings.map((b) => (
          <div key={b.id} style={{
            background: "#fff",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "8px"
          }}>
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