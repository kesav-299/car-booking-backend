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

  const cars = [
    { name: "Dzire", img: "https://i0.wp.com/bestsellingcarsblog.com/wp-content/uploads/2025/06/Maruti-Suzuki-DZire-India-May-2025.jpg?resize=600%2C398" },
    { name: "Swift", img: "https://www.autovista.in/assets/img/new_cars_colour_variants/swift-colour-solid-fire-red.jpg" },
    { name: "Nexon", img: "https://images.autox.com/uploads/cars/2024/02/tata-nexon-500x261.jpg" },
    { name: "Creta", img: "https://cdn-s3.autocarindia.com/hyundai/Creta-Electric/500_5172.jpg?w=640&q=75" },
    { name: "XUV 700", img: "https://asset.autocarindia.com/static/image-galleries/images/20260106_062810_99ca7cda.jpg?w=728&q=75" },
    { name: "Harrier", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXOe3j2LEqZtPVlxBtvO0fAVNrTQUwMFfFoQ&s" },
    { name: "Safari", img: "https://spn-sta.spinny.com/blog/20231103174155/new-Tata-Safari-1160x653.webp?compress=true&quality=80&w=1200&dpr=2.6" },
    { name: "X3", img: "https://di-uploads-pod23.dealerinspire.com/bmwofowingsmills/uploads/2023/02/IMG_05281.jpg" }
  ];

  const distances = {
  "Visakhapatnam-Vijayawada": 350,
  "Visakhapatnam-Srikakulam": 120,
  "Visakhapatnam-Araku": 110,
  "Visakhapatnam-Tirupati": 780,
  "Visakhapatnam-Hyderabad": 620,

  "Vijayawada-Tirupati": 430,
  "Vijayawada-Hyderabad": 280,

  "Tirupati-Hyderabad": 560,
  "Tirupati-Srikakulam": 900,

  "Srikakulam-Hyderabad": 700,
  "Araku-Hyderabad": 650
};

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toISOString().split("T")[0];
  };

  const getFare = (selectedCar) => {
  const key = `${from}-${to}`;
  const reverseKey = `${to}-${from}`;

  let distance = distances[key] || distances[reverseKey];

  if (!distance) {
    console.log("No route found:", key);
    return 1000; // fallback minimum price
  }

  const priceMap = {
    "Dzire": 10, "Swift": 10, "Nexon": 12,
    "Creta": 13, "XUV 700": 15, "Harrier": 16,
    "Safari": 17, "X3": 20
  };

  return distance * (priceMap[selectedCar] || 10);
};

  const fetchBookings = async () => {
    const user_id = localStorage.getItem("user_id");
    if (!user_id) return;

    const res = await fetch(`https://car-booking-backend-dhaw.onrender.com/bookings/${user_id}`);
    const data = await res.json();
    setBookings(data);
  };

  useEffect(() => {
    if (page === "home") fetchBookings();
  }, [page]);

  // LOGIN
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
      alert("Server slow");
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
          {cars.map((c, index) => (
            <div
              key={index}
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
              <img 
                src={c.img} 
                alt={c.name} 
                style={{width:"100%",height:"120px",objectFit:"cover"}} 
              />
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

        {bookings.map((b, i) => (
          <div key={i} style={{background:"#1f2937",padding:"15px",margin:"10px 0",borderRadius:"10px"}}>
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