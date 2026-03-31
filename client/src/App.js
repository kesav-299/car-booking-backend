import React, { useState, useEffect } from "react";

function App() {
  
  const [bookingLoading, setBookingLoading] = useState(false);
  
  const [popupShown, setPopupShown] = useState(false);
  const [popup, setPopup] = useState({ show:false, type:"", message:"" });
  const [page, setPage] = useState("landing");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [loading, setLoading] = useState(false);

  const [car, setCar] = useState("Swift");
  const [bookings, setBookings] = useState([]);

  // ❌ NO DEFAULT VALUES
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const cities = [
    "Visakhapatnam",
    "Vizianagaram",
    "Srikakulam",
    "Araku",
    "Vijayawada",
    "Rajahmundry",
    "Kakinada",
    "Tirupati",
    "Hyderabad"
  ];

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

  // ✅ FULL DISTANCE MATRIX
  const distances = {
    Visakhapatnam: {
      Vizianagaram: 60,
      Srikakulam: 120,
      Araku: 110,
      Vijayawada: 350,
      Rajahmundry: 190,
      Kakinada: 160,
      Tirupati: 780,
      Hyderabad: 620
    },
    Vizianagaram: { Visakhapatnam: 60, Srikakulam: 80, Araku: 130 },
    Srikakulam: { Visakhapatnam: 120, Vizianagaram: 80 },
    Araku: { Visakhapatnam: 110, Vizianagaram: 130 },
    Vijayawada: { Visakhapatnam: 350, Rajahmundry: 160, Tirupati: 430, Hyderabad: 280 },
    Rajahmundry: { Visakhapatnam: 190, Vijayawada: 160, Kakinada: 60 },
    Kakinada: { Visakhapatnam: 160, Rajahmundry: 60, Hyderabad: 420 },
    Tirupati: { Vijayawada: 430, Hyderabad: 560, Visakhapatnam: 780 },
    Hyderabad: { Visakhapatnam: 620, Vijayawada: 280, Tirupati: 560 }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toISOString().split("T")[0];
  };

  const getFare = (selectedCar) => {

  if (!from || !to || from === to) return 0;

  const distance =
    distances[from]?.[to] ||
    distances[to]?.[from] ||
    100;

  const priceMap = {
    Dzire: 10, Swift: 10, Nexon: 12,
    Creta: 13, "XUV 700": 15,
    Harrier: 16, Safari: 17, X3: 20
  };

  return distance * (priceMap[selectedCar] || 10);
};

  const fetchProfile = async () => {

  const user_id = localStorage.getItem("user_id");

  const res = await fetch(
    `https://car-booking-backend-dhaw.onrender.com/profile/${user_id}`
  );

  const data = await res.json();

  setName(data.name);
  setEmail(data.email);
  setAge(data.age);
  setGender(data.gender);
  setPhone(data.phone);
};
  // ❌ AUTO LOGIN REMOVED

  const fetchBookings = async () => {
    const user_id = localStorage.getItem("user_id");
    if (!user_id) return;

    const res = await fetch(`https://car-booking-backend-dhaw.onrender.com/bookings/${user_id}`);
    const data = await res.json();
    setBookings(data);
  };

  useEffect(() => {
    if (page === "home") fetchBookings();
    if (page === "profile") fetchProfile();
  }, [page]);

  const handleLogin = async () => {
    setLoading(true);

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
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user_id");
    setPage("login");
  };

  const handleSignup = async () => {

    if (!name || !email || !password || !age || !gender || !phone) {
    return alert("Please fill all fields");
  }

  if (age < 18) {
    return alert("You must be 18+ to register");
  }

    await fetch("https://car-booking-backend-dhaw.onrender.com/signup", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ name, email, password, age, gender, phone })
    });

    alert("Signup successful");
    setPage("login");
  };
  
  const handleUpdateProfile = async () => {

  const user_id = localStorage.getItem("user_id");

  if (!name || !email || !age || !gender || !phone) {
    return alert("Please fill all fields");
  }

  const res = await fetch("https://car-booking-backend-dhaw.onrender.com/update-profile", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      user_id,
      name,
      email,
      age,
      gender,
      phone
    })
  });

  const text = await res.text();

  alert(text);
};
 
  const handleDeleteAccount = async () => {

  const user_id = localStorage.getItem("user_id");

  if (!window.confirm("Are you sure?")) return;

  await fetch("https://car-booking-backend-dhaw.onrender.com/delete-account", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ user_id })
  });

  alert("Account deleted");

  localStorage.clear();
  setPage("landing");
};
 
 const handleCancelBooking = async (id) => {

  await fetch("https://car-booking-backend-dhaw.onrender.com/cancel-booking", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ booking_id: id })
  });

  alert("Booking cancelled");

  fetchBookings();
};

  const handleBooking = async () => {

  if (bookingLoading) return;

  if (!from || !to) {
    return setPopup({
      show:true,
      type:"error",
      message:"Please select both From and To cities"
    });
  }

  if (from === to) {
    return setPopup({
      show:true,
      type:"error",
      message:"Pickup and destination cannot be same"
    });
  }

  if (!startDate || !endDate) {
    return setPopup({
      show:true,
      type:"error",
      message:"Please select booking dates"
    });
  }

  const diff = (new Date(endDate) - new Date(startDate)) / (1000*60*60*24);
  const days = Math.ceil(diff);

  if (days <= 0) {
    return setPopup({
      show:true,
      type:"error",
      message:"End date must be after start date"
    });
  }

  try {
    setBookingLoading(true); // 🔥 START LOADING

    const user_id = localStorage.getItem("user_id");

    const res = await fetch("https://car-booking-backend-dhaw.onrender.com/book", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        name: localStorage.getItem("name"),
        car,
        days,
        user_id,
        from,
        to,
        startDate,
        endDate
      })
    });

    const text = await res.text();

    if (!res.ok) {
  setPopup({
    show:true,
    type:"error",
    message:text
  });
} else {

  if (!popupShown) {   // 🔥 prevent duplicate
    setPopup({
      show:true,
      type:"success",
      message:"Booking Confirmed 🚗"
    });

    setPopupShown(true);

    setTimeout(() => {
      setPopupShown(false); // reset for next booking
    }, 2000);
  }

  fetchBookings();
}

  } catch {
    setPopup({
      show:true,
      type:"error",
      message:"Server is slow. Try again."
    });
  }

  setBookingLoading(false); // 🔥 STOP LOADING
};

  if (page === "landing") {
  return (
    <div style={{
      height:"100vh",
      background:"linear-gradient(135deg,#0f172a,#1e293b)",
      color:"white",
      display:"flex",
      flexDirection:"column",
      justifyContent:"center",
      alignItems:"center",
      textAlign:"center",
      animation:"popIn 0.5s ease"
    }}>
      <h1 style={{fontSize:"42px"}}>🚗 Vargo</h1>

      <p style={{maxWidth:"400px"}}>
        Book rides instantly like Uber & Ola.
      </p>

      <div style={{marginTop:"20px"}}>
        <button onClick={()=>setPage("login")}>Login</button>
        <button onClick={()=>setPage("signup")} style={{marginLeft:"10px"}}>
          Signup
        </button>
      </div>
    </div>
  );
}

  // LOGIN UI
  if (page === "login") {
    return (
      <div style={{ textAlign:"center", marginTop:"120px" }}>
        <h2>Login 🚗</h2>

        <input 
         placeholder="Email / UserID" 
         onChange={e=>setEmail(e.target.value)}
         onKeyDown={(e)=> e.key==="Enter" && handleLogin()}
     /><br/><br/>
        
        <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} onKeyDown = {(e)=> e.key === "Enter" && handleLogin()}/><br/><br/>

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
        <input placeholder="Email / UserID" onChange={e=>setEmail(e.target.value)} /><br/><br/>
<input placeholder="Phone" onChange={e=>setPhone(e.target.value)} /><br/><br/>
<input type="number" placeholder="Age" onChange={e=>setAge(e.target.value)} /><br/><br/>

<select value={gender} onChange={e=>setGender(e.target.value)}>
  <option value="">Select Gender</option>
  <option value="Male">Male</option>
  <option value="Female">Female</option>
  <option value="Others">Others</option>
</select>

        <input type="password" placeholder="Password" onChange={e=>setPassword(e.target.value)} /><br/><br/>

        <button onClick={handleSignup}>Signup</button>
        <p onClick={()=>setPage("login")}>Login</p>
      </div>
    );
  }

  // PROFILE UI
  if (page === "profile") {

  return (
    <div style={{padding:"20px",color:"white"}}>

      <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
      <button onClick={()=>setPage("home")}>⬅ Back</button>
      <h2>👤 Profile</h2>
      </div>

      <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Phone" value={phone} onChange={e=>setPhone(e.target.value)} />
      <input type="number" placeholder="Age" value={age} onChange={e=>setAge(e.target.value)} />

      <select value={gender} onChange={e=>setGender(e.target.value)}>
        <option value="">Select Gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Others</option>
      </select>

      <br/><br/>

      <button onClick={handleUpdateProfile}>Update Profile</button>

      <button
        onClick={handleDeleteAccount}
        style={{background:"red",marginTop:"10px"}}
      >
        Delete Account
      </button>

    </div>
  );
}

// BOOKINGS TAB UI
if (page === "bookings") {

  return (
    <div style={{padding:"20px",color:"white"}}>

      <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
      <button onClick={()=>setPage("home")}>⬅ Back</button>
      <h2>📋 Your Bookings</h2>
      </div>

      {bookings.map((b,i)=>(
        <div key={i} style={{background:"#1f2937",padding:"15px",margin:"10px 0"}}>

          <p>📍 {b.from_city} → {b.to_city}</p>
          <p>🚗 {b.car}</p>

          <button onClick={()=>handleCancelBooking(b.id)}>
            Cancel
          </button>

        </div>
      ))}

    </div>
  );
}

  // HOME UI
  return (
    <div style={{background:"#0f172a",color:"white",minHeight:"100vh",padding:"20px"}}>

      <div style={{display:"flex",justifyContent:"space-between"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
  <h1>Vargoo 🚗</h1>

  <div>
    <button onClick={()=>setPage("home")} style={{marginRight:"10px"}}>Home</button>
    <button onClick={()=>setPage("profile")} style={{marginRight:"10px"}}>Profile</button>
    <button onClick={()=>setPage("bookings")} style={{marginRight:"10px"}}>Bookings</button>
    <button onClick={handleLogout} style={{padding:"5px 10px"}}>Logout</button>
  </div>
</div>
        <button
  onClick={handleLogout}
  style={{
    width:"auto",
    padding:"6px 12px",
    fontSize:"13px",
    background:"#dc2626"
  }}
>
  Logout
</button>
      </div>

      <h2>Select Ride</h2>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:"20px"}}>
        {cars.map((c,i)=>(
          <div
  onClick={()=>setCar(c.name)}
  style={{
    background: car === c.name ? "#2563eb" : "#1f2937",
    borderRadius:"15px",
    overflow:"hidden",
    cursor:"pointer",
    transform: car === c.name ? "scale(1.05)" : "scale(1)",
    boxShadow: car === c.name ? "0 0 20px #2563eb" : "none",
    transition:"0.3s"
  }}
>
            <img src={c.img} alt={c.name} style={{width:"100%",height:"140px",objectFit:"cover"}} />
            <div style={{padding:"10px"}}>
              <h3>{c.name}</h3>
              <p>₹{getFare(c.name)}</p>
            </div>
          </div>
        ))}
      </div>

      <h3>Total: ₹{getFare(car)}</h3>

      {/* SELECT WITH PLACEHOLDER */}
      <select value={from} onChange={e=>setFrom(e.target.value)}>
        <option value="">Select From</option>
        {cities.map(c=><option key={c}>{c}</option>)}
      </select>

      <select value={to} onChange={e=>setTo(e.target.value)}>
        <option value="">Select To</option>
        {cities.map(c=><option key={c}>{c}</option>)}
      </select>

      <input type="date" onChange={e=>setStartDate(e.target.value)} />
      <input type="date" onChange={e=>setEndDate(e.target.value)} />

      <button
  onClick={handleBooking}
  disabled={bookingLoading}
  style={{
    opacity: bookingLoading ? 0.6 : 1,
    cursor: bookingLoading ? "not-allowed" : "pointer",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    gap:"8px"
  }}
>
  {bookingLoading ? (
    <>
      <div className="spinner"></div>
      Booking...
    </>
  ) : "Book Ride 🚀"}
</button>

      {/* BOOKINGS */}
      <h3>Your Bookings</h3>
      {bookings.map((b,i)=>(
        <div key={i} style={{background:"#1f2937",margin:"10px",padding:"10px"}}>
          <p>{b.from_city} → {b.to_city}</p>
          <p>{formatDate(b.startDate)} → {formatDate(b.endDate)}</p>
          <p>{b.car}</p>

          
        </div>
      ))}
      {popup.show && (
  <div style={{
    position:"fixed",
    top:0,
    left:0,
    width:"100%",
    height:"100%",
    background:"rgba(0,0,0,0.7)",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    zIndex:999
  }}>

    <div style={{
      background:"#111827",
      padding:"30px",
      borderRadius:"20px",
      textAlign:"center",
      minWidth:"320px",
      animation:"popIn 0.35s ease",
      boxShadow:"0 20px 50px rgba(0,0,0,0.7)"
    }}>

      {/* ICON */}
      <div style={{
        fontSize:"50px",
        marginBottom:"10px",
        animation:"bounce 0.6s"
      }}>
        {popup.type === "success" ? "✅" : "❌"}
      </div>

      {/* TITLE */}
      <h2 style={{
        color: popup.type==="success" ? "#22c55e" : "#ef4444",
        marginBottom:"10px"
      }}>
        {popup.type==="success" ? "Success" : "Failed"}
      </h2>

      {/* MESSAGE */}
      <p style={{color:"#d1d5db", marginBottom:"20px"}}>
        {popup.message}
      </p>

      {/* BUTTON */}
      <button
        onClick={()=>setPopup({...popup, show:false})}
        style={{
          background: popup.type==="success" ? "#22c55e" : "#ef4444",
          border:"none",
          padding:"10px 20px",
          borderRadius:"10px",
          cursor:"pointer",
          fontWeight:"bold"
        }}
      >
        OK
      </button>

    </div>
  </div>
)}
     
    </div>
  );
}

export default App;