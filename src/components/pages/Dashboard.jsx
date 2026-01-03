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

  // ⭐ Telegram ID state
  const [telegramId, setTelegramId] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  // ⭐ Telegram WebApp ID aniqlash
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      if (tg.initDataUnsafe?.user) {
        setTelegramId(tg.initDataUnsafe.user.id);
      }
    }
  }, []);

  return (
    <div className="dashboard">
      <Header user={user} />

      <Reklama />

      {/* ⭐ Telegram ID ko‘rsatish tugmasi */}
      <div
        className="share-btn"
        onClick={() => telegramId && setShowAlert(true)}
      >
        <img src={Telegram} alt="telegram" className="tg-icon" />
        <span>Show Telegram ID</span>
      </div>

      <br /><br />

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

      {/* ⭐ Gifts Page */}
      <div className="gifts-btn" onClick={() => navigate("/gifts")}>
        <img src={Heart} alt="gift" className="gift-icon" />
        <span>Gifts Page</span>
      </div>

      {/* ⭐ TELEGRAM ID ALERT MODAL */}
      {showAlert && (
        <div className="tg-alert-overlay">
          <div className="tg-alert">
            <h3>Telegram ID</h3>
            <p>{telegramId}</p>
            <button onClick={() => setShowAlert(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
