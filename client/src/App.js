import React, { useState, useEffect } from "react";

function App() {

  const [page, setPage] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [car, setCar] = useState("Swift");
  const [bookings, setBookings] = useState([]);

  const [from, setFrom] = useState("Visakhapatnam");
  const [to, setTo] = useState("Vijayawada");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const cities = ["Visakhapatnam","Vijayawada","Srikakulam","Araku","Tirupati","Hyderabad"];

  const cars = ["Dzire","Swift","Nexon","Creta","XUV 700","Harrier","Safari","X3","Innova","Baleno"];

  const distances = {
    "Visakhapatnam-Vijayawada": 350,
    "Visakhapatnam-Srikakulam": 120,
    "Visakhapatnam-Araku": 110,
    "Vijayawada-Tirupati": 430,
    "Visakhapatnam-Hyderabad": 620
  };

  // =========================
  // FETCH BOOKINGS
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
    if (page === "home") fetchBookings();
  }, [page]);

  // =========================
  // LOGIN
  // =========================
  const handleLogin = async () => {
    setLoading(true);

    try {
      const res = await fetch("https://car-booking-backend-dhaw.onrender.com/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
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

    } catch {
      alert("Network error");
    }

    setLoading(false);
  };

  // =========================
  // SIGNUP
  // =========================
  const handleSignup = async () => {
    await fetch("https://car-booking-backend-dhaw.onrender.com/signup", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ name, email, password })
    });

    alert("Signup successful");
    setPage("login");
  };

  // =========================
  // FARE
  // =========================
  const calculateFare = () => {
    const key = `${from}-${to}`;
    const reverseKey = `${to}-${from}`;
    const distance = distances[key] || distances[reverseKey];

    if (!distance) return 0;

    const priceMap = {
      "Dzire": 10, "Swift": 10, "Baleno": 11,
      "Nexon": 12, "Creta": 13, "XUV 700": 15,
      "Harrier": 16, "Safari": 17, "X3": 20, "Innova": 14
    };

    return distance * priceMap[car];
  };

  // =========================
  // BOOKING (FINAL FIX)
  // =========================
  const handleBooking = async () => {
    const user_id = localStorage.getItem("user_id");

    // 🔥 FORCE VALID VALUES
    if (!from || !to) {
      alert("Select cities properly");
      return;
    }

    if (!startDate || !endDate) {
      alert("Select dates");
      return;
    }

    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start < new Date(today.setHours(0,0,0,0))) {
      return alert("Cannot book past dates");
    }

    if (end < start) return alert("End date must be after start date");

    const diff = (end - start) / (1000*60*60*24);

    if (diff > 14) return alert("Max 14 days allowed");

    const calculatedDays = Math.ceil(diff);

    // 🔥 DEBUG
    console.log("SENDING DATA:", {
      from,
      to,
      startDate,
      endDate
    });

    const res = await fetch("https://car-booking-backend-dhaw.onrender.com/book", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        name,
        car,
        days: calculatedDays,
        user_id,
        from: from.trim(),
        to: to.trim(),
        startDate,
        endDate
      })
    });

    const text = await res.text();

    if (!res.ok) {
      alert(text);
      return;
    }

    alert("✅ Booking Confirmed!");
    fetchBookings();
  };

  // =========================
  // LOGIN UI
  // =========================
  if (page === "login") {
    return (
      <div style={{ textAlign:"center", marginTop:"100px" }}>
        <h2>Login 🚗</h2>
        <input placeholder="Email" onChange={e=>setEmail(e.target.value)} /><br/><br/>
        <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} /><br/><br/>

        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p onClick={()=>setPage("signup")}>Signup</p>
      </div>
    );
  }

  // =========================
  // SIGNUP UI
  // =========================
  if (page === "signup") {
    return (
      <div style={{ textAlign:"center", marginTop:"100px" }}>
        <h2>Signup 🚗</h2>
        <input placeholder="Name" onChange={e=>setName(e.target.value)} /><br/><br/>
        <input placeholder="Email" onChange={e=>setEmail(e.target.value)} /><br/><br/>
        <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} /><br/><br/>

        <button onClick={handleSignup}>Signup</button>
        <p onClick={()=>setPage("login")}>Login</p>
      </div>
    );
  }

  // =========================
  // HOME UI
  // =========================
  return (
    <div style={{ background:"#111827", color:"white", minHeight:"100vh", padding:"20px" }}>

      <div style={{ display:"flex", justifyContent:"space-between" }}>
        <h1>Vargo 🚗</h1>
        <button onClick={()=>{
          localStorage.removeItem("user_id");
          setPage("login");
        }}>Logout</button>
      </div>

      <div style={{ background:"#1f2937", padding:"25px", borderRadius:"12px", maxWidth:"500px", margin:"40px auto" }}>
        <h2>Plan Your Ride</h2>

        <select value={from} onChange={e=>setFrom(e.target.value)}>
          {cities.map(c=><option key={c}>{c}</option>)}
        </select><br/><br/>

        <select value={to} onChange={e=>setTo(e.target.value)}>
          {cities.map(c=><option key={c}>{c}</option>)}
        </select><br/><br/>

        <input type="date" onChange={e=>setStartDate(e.target.value)} /><br/><br/>
        <input type="date" onChange={e=>setEndDate(e.target.value)} /><br/><br/>

        <select value={car} onChange={e=>setCar(e.target.value)}>
          {cars.map(c=><option key={c}>{c}</option>)}
        </select><br/><br/>

        <h3>Fare: ₹{calculateFare()}</h3>

        <button onClick={handleBooking}>Book Ride 🚀</button>
      </div>

      <div style={{ maxWidth:"500px", margin:"20px auto" }}>
        <h3>Your Bookings</h3>

        {bookings.map((b) => (
          <div key={b.id} style={{
            background: "#1f2937",
            padding: "15px",
            margin: "12px 0",
            borderRadius: "10px"
          }}>
            <h3>📍 {b.from_city || "N/A"} → {b.to_city || "N/A"}</h3>
            <p>📅 {b.startDate || "-"} → {b.endDate || "-"}</p>
            <p>🚗 {b.car} | ⏳ {b.days} days</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;