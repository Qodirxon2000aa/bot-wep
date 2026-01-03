import React, { useState } from "react";
import "./Dashboard.css";
import Reklama from "../pages/Reklama/Reklama.jsx";
import Premuim from "../../assets/prem.ico";
import Star from "../../assets/stars.ico";
import Telegram from "../../assets/tg.ico";
import Header from "../pages/Header/Header.jsx";
import Heart from "../../assets/gifts/heart.png";

import Premium from "../pages/premuium/Premium.jsx";
import StarsModal from "../pages/starts/Stars.jsx";

import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  // ⭐ MODAL STATES
  const [isStarsOpen, setIsStarsOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);

  const demoUser = {
    name: "John Doe",
    image: "/default-avatar.png",
  };

  const storedUser = localStorage.getItem("userData");
  const user = storedUser ? JSON.parse(storedUser) : demoUser;

  return (
    <div className="dashboard">
      <Header user={user} />

      <Reklama />

      <div className="share-btn">
        <img src={Telegram} alt="telegram" className="tg-icon" />
        <span>Share link to friends</span>
      </div>

      <br /><br />

      <div className="floating-buttons">
        {/* ⭐ STARS */}
        <div
          className="float-btn left-btn"
          onClick={() => setIsStarsOpen(true)}
        >
          <img src={Star} alt="stars" />
          <h5>STARS XARIDI</h5>
        </div>

        {/* 💎 PREMIUM */}
        <div
          className="float-btn right-btn"
          onClick={() => setIsPremiumOpen(true)}
        >
          <img src={Premuim} alt="premium" />
          <h5>PREMIUM XARIDI</h5>
        </div>
      </div>

      {/* 🎁 GIFTS */}
      <div className="gifts-btn" onClick={() => navigate("/gifts")}>
        <img src={Heart} alt="gift" className="gift-icon" />
        <span>Gifts Page</span>
      </div>

      {/* ⭐ STARS MODAL */}
      {isStarsOpen && (
        <StarsModal onClose={() => setIsStarsOpen(false)} />
      )}

      {/* 💎 PREMIUM MODAL 🔥 */}
      {isPremiumOpen && (
        <Premium onClose={() => setIsPremiumOpen(false)} />
      )}
    </div>
  );
};

export default Dashboard;
