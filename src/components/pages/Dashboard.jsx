import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import Reklama from "../pages/Reklama/Reklama.jsx";
import Premuim from "../../assets/prem.ico";
import Star from "../../assets/stars.ico";
import Telegram from "../../assets/tg.ico";
import Header from "../pages/Header/Header.jsx";
import Heart from "../../assets/gifts/heart.png";

import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const demoUser = {
    name: "John Doe",
    image: "/default-avatar.png",
  };

  const storedUser = localStorage.getItem("userData");
  const user = storedUser ? JSON.parse(storedUser) : demoUser;

  // ⭐ Telegram User State
  const [tgUser, setTgUser] = useState(null);

  // ⭐ Avtomatik Telegram user olish
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      if (tg.initDataUnsafe?.user) {
        setTgUser(tg.initDataUnsafe.user);
      }
    }
  }, []);

  return (
    <div className="dashboard">
      <Header user={user} />

      <Reklama />

      {/* ⭐ TELEGRAM USER INFO (AUTOMATIC) */}
      {tgUser && (
        <div className="tg-user-box">
          <h4>Telegram Account</h4>
          <p><b>ID:</b> {tgUser.id}</p>
          <p><b>Name:</b> {tgUser.first_name}</p>
          <p><b>Username:</b> @{tgUser.username || "yo‘q"}</p>
        </div>
      )}

      <br />

      <div className="floating-buttons">
        <div className="float-btn left-btn">
          <img src={Premuim} alt="star" />
          <h5>STARS XARIDI</h5>
        </div>
        <div className="float-btn right-btn">
          <img src={Star} alt="star" />
          <h5>PREMIUM XARIDI</h5>
        </div>
      </div>

      <div className="gifts-btn" onClick={() => navigate("/gifts")}>
        <img src={Heart} alt="gift" className="gift-icon" />
        <span>Gifts Page</span>
      </div>
    </div>
  );
};

export default Dashboard;
