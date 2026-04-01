import React, { useState, useEffect } from "react";
import logo from "./logo.png";

function App() {
  
  const [bookingLoading, setBookingLoading] = useState(false);
  const [editBooking, setEditBooking] = useState(null);
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
  const [loginSuccess, setLoginSuccess] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [car, setCar] = useState("Dzire");
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
    { name: "Nexon", img: "https://i.cdn.newsbytesapp.com/images/l62520240220190448.jpeg" },
    { name: "Creta", img: "https://cdn-s3.autocarindia.com/hyundai/Creta-Electric/500_5172.jpg?w=640&q=75" },
    { name: "XUV 700", img: "https://stimg.cardekho.com/images/carexteriorimages/930x620/Mahindra/XUV-7XO/12666/1768814047191/exterior-image-172.jpg" },
    { name: "Harrier", img: "https://content.carlelo.com/media/news/tata-harrier-petrol-diesel-and-ev.webp" },
    { name: "Safari", img: "https://cdn.optcms.com/www.indianewsnetwork.com/assets/2026/202601/20260108-img-20260108-aa63710ac8a67a88.webp" },
    { name: "X3", img: "https://di-uploads-pod23.dealerinspire.com/bmwofowingsmills/uploads/2023/02/IMG_05281.jpg" },
    { name: "Mercedes E-Class",  img:"https://cdn-s3.autocarindia.com/legacy/cdni/ExtraImages/20241017101242_Mercedes_E_Class_review_front_tracing.jpg" },
    { name: "Range Rover", img: "https://www.focus2move.com/wp-content/uploads/2019/11/Land_Rover-Range_Rover_Velar_R-Dynamic_Black-2020.jpg" },
    { name: "Bentley Flying Spur", img: "https://media.evo.co.uk/image/private/s--A4qBh8OK--/f_auto,t_content-image-full-desktop@1/v1740133659/evo/2025/02%20Feb/Bentley%20Flying%20Spur%20review%202025.jpg" }


  ];

const PopupComponent = () => (
  popup.show && (
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
        minWidth:"320px"
      }}>
        <h2 style={{
          color: popup.type==="success" ? "#22c55e" : "#ef4444"
        }}>
          {popup.type==="success" ? "Success" : "Failed"}
        </h2>

        <p style={{color:"#d1d5db"}}>
          {popup.message}
        </p>

        <button
          onClick={()=>setPopup({...popup, show:false})}
          style={{
            marginTop:"15px",
            padding:"10px 20px",
            borderRadius:"10px",
            background: popup.type==="success" ? "#22c55e" : "#ef4444",
            border:"none",
            color:"white"
          }}
        >
          OK
        </button>
      </div>
    </div>
  )
);

  // ✅ FULL DISTANCE MATRIX
  const distances = {
  Visakhapatnam: {
    Vizianagaram: 60, Srikakulam: 120, Araku: 110,
    Rajahmundry: 190, Kakinada: 160, Vijayawada: 350,
    Hyderabad: 620, Tirupati: 780
  },

  Vizianagaram: {
    Visakhapatnam: 60, Srikakulam: 80, Araku: 130,
    Rajahmundry: 210, Kakinada: 180, Vijayawada: 400,
    Hyderabad: 680, Tirupati: 820
  },

  Srikakulam: {
    Visakhapatnam: 120, Vizianagaram: 80, Araku: 150,
    Rajahmundry: 270, Kakinada: 240, Vijayawada: 470,
    Hyderabad: 720, Tirupati: 860
  },

  Araku: {
    Visakhapatnam: 110, Vizianagaram: 130, Srikakulam: 150,
    Rajahmundry: 250, Kakinada: 220, Vijayawada: 440,
    Hyderabad: 700, Tirupati: 850
  },

  Rajahmundry: {
    Visakhapatnam: 190, Vizianagaram: 210, Srikakulam: 270,
    Araku: 250, Kakinada: 60, Vijayawada: 160,
    Hyderabad: 450, Tirupati: 600
  },

  Kakinada: {
    Visakhapatnam: 160, Vizianagaram: 180, Srikakulam: 240,
    Araku: 220, Rajahmundry: 60, Vijayawada: 180,
    Hyderabad: 420, Tirupati: 580
  },

  Vijayawada: {
    Visakhapatnam: 350, Vizianagaram: 400, Srikakulam: 470,
    Araku: 440, Rajahmundry: 160, Kakinada: 180,
    Hyderabad: 280, Tirupati: 430
  },

  Hyderabad: {
    Visakhapatnam: 620, Vizianagaram: 680, Srikakulam: 720,
    Araku: 700, Rajahmundry: 450, Kakinada: 420,
    Vijayawada: 280, Tirupati: 560
  },

  Tirupati: {
    Visakhapatnam: 780, Vizianagaram: 820, Srikakulam: 860,
    Araku: 850, Rajahmundry: 600, Kakinada: 580,
    Vijayawada: 430, Hyderabad: 560
  }
};

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toISOString().split("T")[0];
  };

  const getFare = (selectedCar) => {

  if (!from || !to || from === to) return 0;

  const distance =
  distances[from]?.[to] ||
  distances[to]?.[from];

if (!distance) return 0;

  const priceMap = {
  Dzire: 10,
  Nexon: 12,
  Creta: 13,
  "XUV 700": 15,
  Harrier: 16,
  Safari: 17,
  X3: 20,
  "Mercedes E-Class": 25,
  "Range Rover": 30,
  "Bentley Flying Spur": 50
};

  return distance * (priceMap[selectedCar] || 10);
};

  const fetchProfile = async () => {

  const user_id =
  localStorage.getItem("user_id") ||
  sessionStorage.getItem("user_id");

  if (!user_id || user_id === "undefined") return;

  try {
    const res = await fetch(
      `https://car-booking-backend-dhaw.onrender.com/profile/${user_id}`
    );

    const data = await res.json();

    if (!data) return;

    setName(data.name || "");
    setEmail(data.email || "");
    setAge(data.age || "");
    setGender(data.gender || "");
    setPhone(data.phone || "");

  } catch (err) {
    console.log("Profile error:", err);
  }
};
  // ❌ AUTO LOGIN REMOVED

  const fetchBookings = async () => {
    const user_id =
  localStorage.getItem("user_id") ||
  sessionStorage.getItem("user_id");
    if (!user_id) return;

    const res = await fetch(`https://car-booking-backend-dhaw.onrender.com/bookings/${user_id}`);
    const data = await res.json();
    setBookings(data);
  };

  useEffect(() => {
  const user_id = localStorage.getItem("user_id"); // ✅ ONLY localStorage

  if (user_id) {
    setPage("home");
  } else {
    setPage("landing"); // optional safety
  }
}, []);
  
  useEffect(() => {
  if (!popup.show) return;
  
  

  const timer = setTimeout(() => {
    setPopup({ show:false, type:"", message:"" });
  }, 2000);

  return () => clearTimeout(timer);
}, [popup]);

  const handleLogin = async () => {

  if (!email || !password) {
  return setPopup({
    show: true,
    type: "error",
    message: "Please enter email and password"
  });
}

  setLoading(true);

  try {
    const res = await fetch("https://car-booking-backend-dhaw.onrender.com/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email, password })
    });

    const text = await res.text();

    // ❌ ERROR CASE
    if (!res.ok) {
      setLoading(false);

      return setPopup({
        show:true,
        type:"error",
        message: text
      });
    }

    // ✅ SUCCESS CASE (handle safely)
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      // fallback if backend sends plain text
      setLoading(false);

      return setPopup({
        show:true,
        type:"error",
        message:"Invalid server response"
      });
    }

    // ✅ SAVE DATA
   if (rememberMe) {
  localStorage.setItem("user_id", data.userId);
  localStorage.setItem("name", data.name);
} else {
  sessionStorage.setItem("user_id", data.userId);
  sessionStorage.setItem("name", data.name);
}

// ✅ success message
setLoginSuccess("Login Successful ✅");

setTimeout(() => {
  setLoginSuccess("");
  setPage("home");
}, 1500);

setLoading(false);

  } catch (err) {
    console.log(err);

    setPopup({
      show:true,
      type:"error",
      message:"Server connection failed"
    });

    setLoading(false);
  }
};

  const handleLogout = () => {
  localStorage.removeItem("user_id");
  sessionStorage.removeItem("user_id");

  // 🔥 CLEAR FIELDS
  setEmail("");
  setPassword("");

  setPage("landing");
};

  const handleSignup = async () => {

    if (!name || !email || !password || !age || !gender || !phone) {
    return setPopup({
  show:true,
  type:"error",
  message:"Please fill all fields"
});
  }

  if (age < 18) {
  return setPopup({
    show:true,
    type:"error",
    message:"You must be 18+ to register"
  });
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

  const user_id =
  localStorage.getItem("user_id") ||
  sessionStorage.getItem("user_id");

  if (!name || !email || !age || !gender || !phone) {
    return setPopup({
  show:true,
  type:"error",
  message:"Please fill all fields"
});
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

  const user_id =
  localStorage.getItem("user_id") ||
  sessionStorage.getItem("user_id");

  if (!window.confirm("Are you sure?")) return;

  await fetch("https://car-booking-backend-dhaw.onrender.com/delete-account", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ user_id })
  });

  alert("Account deleted");

  localStorage.clear();
  sessionStorage.clear();
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

  const handleEditBooking = (booking) => {
  setEditBooking(booking);

  setFrom(booking.from_city);
  setTo(booking.to_city);
  setStartDate(booking.startDate);
  setEndDate(booking.endDate);
  setCar(booking.car);

  setPage("home");
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

  const isEdit = editBooking !== null;

  try {
    setBookingLoading(true); // 🔥 START LOADING

    const user_id =
  localStorage.getItem("user_id") ||
  sessionStorage.getItem("user_id");
    
    const url = isEdit
     ? "https://car-booking-backend-dhaw.onrender.com/update-booking"
     : "https://car-booking-backend-dhaw.onrender.com/book";

    const res = await fetch(url, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        booking_id: editBooking?.id,
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
      message: isEdit ? "Booking Updated 🚗" : "Booking Confirmed 🚗"
    });

    setPopupShown(true);

    setTimeout(() => {
      setPopupShown(false); // reset for next booking
    }, 2000);
  }

  fetchBookings();
  setEditBooking(null);  
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

 // LANDING UI

 if (page === "landing") {
  return (
    <div style={{
      minHeight:"50vh",
      background:"linear-gradient(120deg,#020617,#0f172a,#1e40af)",
      color:"white",
      padding:"25px",
      overflow:"hidden"
    }}>

     <img 
  src={logo} 
  alt="Vargoo" 
  style={{width:"350px", margin:"0px auto", display:"block"}}
/>

      {/* NAVBAR */}
      <div style={{
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center"
      }}>
       

              </div>

      {/* HERO */}
      <div style={{
        textAlign:"center",
        marginTop:"40px",
        animation:"fadeUp 1s ease"
      }}>
        <h1 style={{
          fontSize:"56px",
          fontWeight:"bold",
          background:"linear-gradient(90deg,#38bdf8,#6366f1)",
          WebkitBackgroundClip:"text",
          color:"transparent"
        }}>
          Smart Travel Starts Here
        </h1>

        <p style={{
          marginTop:"10px",
          color:"#cbd5e1",
          maxWidth:"600px",
          marginInline:"auto"
        }}>
          Experience seamless ride booking with Vargoo.
          Fast, affordable and reliable journeys across cities.
        </p>

               
      </div>

      {/* FEATURES */}
      <div style={{
        display:"grid",
        gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",
        gap:"20px",
        marginTop:"80px"
      }}>
        {[
          {title:"⚡ Instant Booking",desc:"Book rides in seconds"},
          {title:"💰 Best Pricing",desc:"Affordable fares always"},
          {title:"🚗 Multiple Cars",desc:"Choose your ride"},
          {title:"📍 Smart Routes",desc:"Optimized travel paths"}
        ].map((f,i)=>(
          <div key={i} style={{
            background:"rgba(255,255,255,0.05)",
            backdropFilter:"blur(10px)",
            borderRadius:"20px",
            padding:"20px",
            textAlign:"center",
            transition:"0.3s",
            animation:`fadeUp ${0.6 + i*0.2}s`
          }}>
            <h3>{f.title}</h3>
            <p style={{fontSize:"13px",color:"#cbd5e1"}}>{f.desc}</p>
          </div>
        ))}
      </div>

      {/* CAR SHOWCASE */}
      <div style={{
        marginTop:"80px",
        display:"flex",
        gap:"20px",
        overflowX:"auto"
      }}>
        {cars.map((c,i)=>(
          <div key={i} style={{
            minWidth:"220px",
            borderRadius:"15px",
            overflow:"hidden",
            background:"#1f2937",
            animation:`slideIn ${0.5 + i*0.1}s`
          }}>
            <img src={c.img} alt={c.name}
              style={{width:"100%",height:"140px",objectFit:"cover"}}
            />
            <h4 style={{textAlign:"center",padding:"10px"}}>{c.name}</h4>
          </div>
        ))}
      </div>

      {/* FOOTER CTA */}
      <div style={{textAlign:"center",marginTop:"80px"}}>
        <h2>Ready to ride?</h2>

        <button
          onClick={()=>setPage("login")}
          style={{
            marginTop:"15px",
            padding:"15px 30px",
            borderRadius:"12px",
            background:"#22c55e",
            border:"none"
          }}
        >
          Book Now 🚗
        </button>
      </div>

    <PopupComponent />
    </div>
  );
}

  // LOGIN UI

 if (page === "login") {
  return (
    <>
      <div style={{
        minHeight:"100vh",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        background:"linear-gradient(120deg,#020617,#0f172a,#1e40af)"
      }}>

        <div style={{
          background:"rgba(255,255,255,0.05)",
          backdropFilter:"blur(15px)",
          padding:"40px",
          borderRadius:"20px",
          width:"450px",
          textAlign:"center",
          boxShadow:"0 20px 50px rgba(0,0,0,0.5)"
        }}>

          <img src={logo} alt="Vargoo Logo" style={{width:"250px"}} />

          <h2 style={{marginBottom:"5px"}}>Login</h2>

          <form
  onSubmit={(e) => {
    e.preventDefault();
    handleLogin();
  }}
>
       
          <input 
  value={email}
  placeholder="Email"
  style={{width:"100%",padding:"22px",marginBottom:"10px"}}
  onChange={e=>setEmail(e.target.value)}
/>

<input 
  value={password}
  type="password"
  placeholder="Password"
  style={{width:"100%",padding:"22px",marginBottom:"15px"}}
  onChange={e=>setPassword(e.target.value)}
/>

 <div style={{
  display: "flex",
  alignItems: "center",
  gap: "8px",
  marginBottom: "15px"
}}>
  <input 
    type="checkbox"
    checked={rememberMe}
    onChange={()=>setRememberMe(!rememberMe)}
    style={{
      width: "16px",
      height: "16px",
      cursor: "pointer"
    }}
  />

  <label style={{
    color: "white",
    cursor: "pointer",
    fontSize: "14px"
  }}>
    Remember Me
  </label>
</div>

          {/* 🔥 UPDATED BUTTON HERE */}
          <button
  type="submit"
  disabled={loading}
  style={{
    width:"100%",
    padding:"14px",
    borderRadius:"10px",
    background: loading ? "#1e40af" : "#2563eb",
    color:"white",
    fontSize:"16px",
    border:"none",
    cursor: loading ? "not-allowed" : "pointer",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    gap:"8px"
  }}
>
  {loading ? (
    <>
      <div className="spinner"></div>
      Logging in...
    </>
  ) : "Login"}
</button>

{/* ✅ success message */}
{loginSuccess && (
  <p style={{color:"#22c55e",marginTop:"10px"}}>
    {loginSuccess}
  </p>
)}


<div style={{marginTop:"15px"}}>

  <p 
    onClick={()=>setPage("signup")}
    style={{
      color:"#38bdf8",
      cursor:"pointer",
      marginBottom:"8px"
    }}
  >
    New user? Signup
  </p>

  <p 
    onClick={()=>setPage("landing")}
    style={{
      color:"#cbd5e1",
      cursor:"pointer",
      fontSize:"14px"
    }}
  >
    ⬅ Back to Home


  </p>
</div>  
 </form>
        </div>
   
      </div>
      <PopupComponent />
    </>
  );
}

  // SIGNUP UI
  if (page === "signup") {
  return (
    <>
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

      <PopupComponent />
    </>
  );
}

  // PROFILE UI
  if (page === "profile") {

  return (
    <div style={{padding:"20px",color:"white"}}>
    <img 
  src={logo} 
  alt="logo" 
  style={{width:"120px", marginBottom:"10px"}} 
/>

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
  
     <PopupComponent />

    </div>
  );
}

// BOOKINGS TAB UI
if (page === "bookings") {

  return (
    <div style={{padding:"20px",color:"white"}}>
   
   <img 
  src={logo} 
  alt="logo" 
  style={{
    width:"180px",
    objectFit:"contain"
  }} 
/>

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

          <button onClick={()=>handleEditBooking(b)} style={{marginLeft:"10px"}}>
          Edit
          </button>

        </div>
      ))}
     <PopupComponent />
    </div>
  );
}

  // HOME UI
  return (
    <div style={{background:"linear-gradient(120deg,#0b3c5d,#0f172a,#1e3a8a)"}}>

      <div style={{
  display:"flex",
  justifyContent:"space-between",
  alignItems:"center",
  marginBottom:"20px"
}}>

  {/* LEFT: LOGO */}
  <img 
    src={logo} 
    alt="logo" 
    style={{width:"219px"}} 
  />

  {/* RIGHT: MENU */}
  <div style={{
    display:"flex",
    gap:"12px"
  }}>
    <button onClick={()=>setPage("landing")}>Home</button>
    <button onClick={()=>setPage("profile")}>Profile</button>
    <button onClick={()=>setPage("bookings")}>Bookings</button>
    <button onClick={handleLogout} style={{background:"#dc2626"}}>
      Logout
    </button>
  </div>

</div>

     {editBooking && (
  <div style={{
    background:"#f59e0b",
    padding:"10px",
    borderRadius:"10px",
    marginBottom:"10px",
    textAlign:"center",
    fontWeight:"bold"
  }}>
    ✏️ Editing Booking Mode
  </div>
)}

     <h2>
  {editBooking ? "✏️ Edit Booking" : "Select Ride"}
</h2>

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
            <img src={c.img} alt={c.name} style={{width:"100%",height:"180px",objectFit:"cover"}} />
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
  ) : editBooking ? "Update Booking 🚗" : "Book Ride 🚀"}
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
    <PopupComponent />       
    </div>
  );
}

export default App;