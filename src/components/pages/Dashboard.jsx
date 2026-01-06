import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import Reklama from "../pages/Reklama/Reklama.jsx";
import Premuim from "../../assets/prem.ico";
import Star from "../../assets/stars.ico";
import Telegram from "../../assets/tg.ico";
import Header from "../pages/Header/Header.jsx";
import Heart from "../../assets/gifts/heart.png";

import Premium from "../pages/premuium/Premium.jsx";
import StarsModal from "../pages/starts/Stars.jsx";
import Off from "../pages/Off/Off.jsx"; // ✅ NEW

import { useNavigate } from "react-router-dom";

// ✅ Welcome Animation Component
const WelcomeAnimation = ({ onComplete }) => {
  const [text, setText] = React.useState("");
  const fullText = "Assalomu alaykum, xush kelibsiz!";
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (index < fullText.length) {
      const t = setTimeout(() => {
        setText(prev => prev + fullText[index]);
        setIndex(index + 1);
      }, 70);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(onComplete, 1200);
      return () => clearTimeout(t);
    }
  }, [index, fullText, onComplete]);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "linear-gradient(135deg,#667eea,#764ba2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10000,
      color: "#fff",
      fontSize: "26px",
      fontWeight: "600"
    }}>
      {text}
      <span style={{ marginLeft: 4, animation: "blink 1s infinite" }}>|</span>
    </div>
  );
};


const Dashboard = () => {
  const navigate = useNavigate();

  const [showAnimation, setShowAnimation] = useState(true);
  const [isStarsOpen, setIsStarsOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);

  const [botStatus, setBotStatus] = useState(null); // ✅ NEW
  const [loadingStatus, setLoadingStatus] = useState(true); // ✅ NEW

  // 🔥 BOT STATUS TEKSHIRISH
  useEffect(() => {
    fetch("https://tezpremium.uz/webapp/settings.php")
      .then(r => r.json())
      .then(d => {
        if (d.ok && d.settings?.bot_status) {
          setBotStatus(d.settings.bot_status);
        } else {
          setBotStatus("off");
        }
      })
      .catch(() => setBotStatus("off"))
      .finally(() => setLoadingStatus(false));
  }, []);

  // ⏳ Status yuklanayotgan payt
  if (loadingStatus) {
    return null; // yoki loader qo‘ysangiz bo‘ladi
  }

  // 🚧 AGAR BOT OFF BO‘LSA
  if (botStatus === "off") {
    return <Off />;
  }

  // 🎬 Welcome animatsiya
  if (showAnimation) {
    return <WelcomeAnimation onComplete={() => setShowAnimation(false)} />;
  }

  const demoUser = { name: "John Doe", image: "/default-avatar.png" };
  const storedUser = localStorage.getItem("userData");
  const user = storedUser ? JSON.parse(storedUser) : demoUser;

  return (
    <div className="dashboard">
      <Header user={user} />

      <Reklama onOpenStarsModal={() => setIsStarsOpen(true)} />

      <div className="share-btn">
        <img src={Telegram} alt="telegram" className="tg-icon" />
        <span>Share link to friends</span>
      </div>

      <br /><br />

      <div className="floating-buttons">
        <div className="float-btn left-btn" onClick={() => setIsStarsOpen(true)}>
          <img src={Star} alt="stars" />
          <h5>STARS XARIDI</h5>
        </div>

        <div className="float-btn right-btn" onClick={() => setIsPremiumOpen(true)}>
          <img src={Premuim} alt="premium" />
          <h5>PREMIUM XARIDI</h5>
        </div>
      </div>

      <div className="gifts-btn" onClick={() => navigate("/gifts")}>
        <img src={Heart} alt="gift" className="gift-icon" />
        <span>Gifts Page</span>
      </div>

      {isStarsOpen && <StarsModal onClose={() => setIsStarsOpen(false)} />}
      {isPremiumOpen && <Premium onClose={() => setIsPremiumOpen(false)} />}
    </div>
  );
};

export default Dashboard;
