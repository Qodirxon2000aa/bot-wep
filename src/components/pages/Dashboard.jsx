import React, { useState } from "react";
import "./Dashboard.css";
import Reklama from "../pages/Reklama/Reklama.jsx";
import Premuim from "../../assets/prem.ico";
import Star from "../../assets/stars.ico";
import Telegram from "../../assets/tg.ico";
import Header from "../pages/Header/Header.jsx";
import Heart from "../../assets/gifts/heart.png";

import StarsModal from "../pages/starts/Stars.jsx";

// ⭐ navigate ishlashi uchun shart
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  // ✅ HOOK FAQAT SHU YERDA
  const [isStarsOpen, setIsStarsOpen] = useState(false);

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
        {/* ⭐ STARS MODAL OPEN */}
        <div
          className="float-btn left-btn"
          onClick={() => setIsStarsOpen(true)}
        >
          <img src={Premuim} alt="star" />
          <h5>STARS XARIDI</h5>
        </div>

        <div className="float-btn right-btn">
          <img src={Star} alt="star" />
          <h5>PREMIUM XARIDI</h5>
        </div>
      </div>

      {/* ⭐ Gifts Page Button */}
      <div className="gifts-btn" onClick={() => navigate("/gifts")}>
        <img src={Heart} alt="gift" className="gift-icon" />
        <span>Gifts Page</span>
      </div>

      {/* ✅ STARS MODAL */}
      {isStarsOpen && (
        <StarsModal onClose={() => setIsStarsOpen(false)} />
      )}
    </div>
  );
  
};



export default Dashboard;
