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

  // 🚗 CAR DATA WITH IMAGES
  const cars = [
    { name: "Dzire", img: "https://imgd.aeplcdn.com/600x337/n/cw/ec/159099/dzire.jpeg" },
    { name: "Swift", img: "https://imgd.aeplcdn.com/600x337/n/cw/ec/54399/swift.jpeg" },
    { name: "Nexon", img: "https://imgd.aeplcdn.com/600x337/n/cw/ec/141867/nexon.jpeg" },
    { name: "Creta", img: "https://imgd.aeplcdn.com/600x337/n/cw/ec/106815/creta.jpeg" },
    { name: "XUV 700", img: "https://imgd.aeplcdn.com/600x337/n/cw/ec/42355/xuv700.jpeg" },
    { name: "Harrier", img: "https://imgd.aeplcdn.com/600x337/n/cw/ec/139139/harrier.jpeg" },
    { name: "Safari", img: "https://imgd.aeplcdn.com/600x337/n/cw/ec/139145/safari.jpeg" },
    { name: "X3", img: "https://imgd.aeplcdn.com/600x337/n/cw/ec/157953/x3.jpeg" }
  ];

  const distances = {
    "Visakhapatnam-Vijayawada": 350,
    "Visakhapatnam-Srikakulam": 120,
    "Visakhapatnam-Araku": 110,
    "Vijayawada-Tirupati": 430,
    "Visakhapatnam-Hyderabad": 620
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toISOString().split("T")[0];
  };

  const getFare = (selectedCar) => {
    const key = `${from}-${to}`;
    const reverseKey = `${to}-${from}`;
    const distance = distances[key] || distances[reverseKey];

    if (!distance) return 0;

    const priceMap = {
      "Dzire": 10, "Swift": 10, "Nexon": 12,
      "Creta": 13, "XUV 700": 15, "Harrier": 16,
      "Safari": 17, "X3": 20
    };

    return distance * (priceMap[selectedCar] || 10);
  };

  const fetchBookings = async () => {
    const user_id = localStorage.getItem("user_id");
    const res = await fetch(`https://car-booking-backend-dhaw.onrender.com/bookings/${user_id}`);
    const data = await res.json();
    setBookings(data);
  };

  useEffect(() => {
    if (page === "home") fetchBookings();
  }, [page]);

  // ⚡ FAST LOGIN
  const handleLogin = async () => {
    setLoading(true);

    try {
      const res = await fetch("https://car-booking-backend-dhaw.onrender.com/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data);
        setLoading(false);
        return;
      }

      localStorage.setItem("user_id", data.userId);
      setPage("home");

    } catch {
      alert("Server slow, try again");
    }

    setLoading(false);
  };

  const handleSignup = async () => {
    await fetch("https://car-booking-backend-dhaw.onrender.com/signup", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ name, email, password })
    });

    alert("Signup successful");
    setPage("login");
  };

  const handleBooking = async () => {
    const user_id = localStorage.getItem("user_id");

    if (!startDate || !endDate) return alert("Select dates");

    const diff = (new Date(endDate) - new Date(startDate)) / (1000*60*60*24);
    const days = Math.ceil(diff);

    const res = await fetch("https://car-booking-backend-dhaw.onrender.com/book", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        name,
        car,
        days,
        user_id,
        from,
        to,
        startDate,
        endDate
      })
    });

    if (!res.ok) return alert("Booking failed");

    alert("✅ Booking Confirmed!");
    fetchBookings();
  };

  // LOGIN UI
  if (page === "login") {
    return (
      <div style={{ textAlign:"center", marginTop:"120px" }}>
        <h2>Login 🚗</h2>

        <input placeholder="Email" onChange={e=>setEmail(e.target.value)} /><br/><br/>
        <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} /><br/><br/>

        <button onClick={handleLogin}>
          {loading ? "Loading..." : "Login"}
        </button>

        <p onClick={()=>setPage("signup")}>Signup</p>
      </div>
    );
  }

  // SIGNUP UI
  if (page === "signup") {
    return (
      <div style={{ textAlign:"center", marginTop:"120px" }}>
        <h2>Signup 🚗</h2>

        <input placeholder="Name" onChange={e=>setName(e.target.value)} /><br/><br/>
        <input placeholder="Email" onChange={e=>setEmail(e.target.value)} /><br/><br/>
        <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} /><br/><br/>

        <button onClick={handleSignup}>Signup</button>
        <p onClick={()=>setPage("login")}>Login</p>
      </div>
    );
  }

  // HOME UI
  return (
    <div style={{
      background: "linear-gradient(to right,#0f172a,#1e293b)",
      color: "white",
      minHeight: "100vh",
      padding: "20px"
    }}>

      <h1>Vargo 🚗</h1>

      <div style={{ maxWidth:"600px", margin:"auto" }}>
        <h2>Select Your Ride</h2>

        <div style={{
          display:"grid",
          gridTemplateColumns:"1fr 1fr",
          gap:"15px"
        }}>
          {cars.map(c => (
            <div
              key={c.name}
              onClick={()=>setCar(c.name)}
              style={{
                borderRadius:"15px",
                overflow:"hidden",
                cursor:"pointer",
                background: car===c.name ? "#2563eb" : "#1f2937",
                transform: car===c.name ? "scale(1.05)" : "scale(1)",
                transition:"0.3s"
              }}
            >
              <img src={c.img} style={{width:"100%",height:"120px",objectFit:"cover"}} />
              <div style={{padding:"10px"}}>
                <h4>{c.name}</h4>
                <p>₹{getFare(c.name)}</p>
              </div>
            </div>
          ))}
        </div>

        <h3>Selected: {car}</h3>
        <h3>Total: ₹{getFare(car)}</h3>

        <select onChange={e=>setFrom(e.target.value)}>
          {cities.map(c=><option key={c}>{c}</option>)}
        </select>

        <select onChange={e=>setTo(e.target.value)}>
          {cities.map(c=><option key={c}>{c}</option>)}
        </select>

        <input type="date" onChange={e=>setStartDate(e.target.value)} />
        <input type="date" onChange={e=>setEndDate(e.target.value)} />

        <button onClick={handleBooking}>Book Ride 🚀</button>
      </div>

      <div style={{ maxWidth:"600px", margin:"30px auto" }}>
        <h3>Your Bookings</h3>

        {bookings.map(b => (
          <div key={b.id} style={{background:"#1f2937",padding:"15px",margin:"10px 0",borderRadius:"10px"}}>
            <p>📍 {b.from_city} → {b.to_city}</p>
            <p>📅 {formatDate(b.startDate)} → {formatDate(b.endDate)}</p>
            <p>🚗 {b.car}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;