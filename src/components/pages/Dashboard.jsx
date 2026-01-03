import React, { useEffect } from "react";
import "./Dashboard.css";
import Reklama from "../pages/Reklama/Reklama.jsx";
import Premuim from "../../assets/prem.ico";
import Star from "../../assets/stars.ico";
import Header from "../pages/Header/Header.jsx";
import Heart from "../../assets/gifts/heart.png";

import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // ⭐ Telegram WebApp tekshirish
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();

      const user = tg.initDataUnsafe?.user;

      if (user) {
        alert(
          `Telegram ma'lumotlari:\n\n` +
          `ID: ${user.id}\n` +
          `Ism: ${user.first_name}\n` +
          `Username: @${user.username || "yo‘q"}`
        );
      } else {
        alert("Telegram user topilmadi!");
      }
    } else {
      alert("Telegram WebApp aniqlanmadi!");
    }
  }, []);

  return (
    <div className="dashboard">
      <Header />

      <Reklama />

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
