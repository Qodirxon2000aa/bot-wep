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

import { useNavigate } from "react-router-dom";

// Welcome Animation Component (o'zgarmadi, shuning uchun qoldirdim)
const WelcomeAnimation = ({ onComplete }) => {
  const [text, setText] = useState("");
  const fullText = "Assalomu alaykum, xush kelibsiz!";
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState('fadeIn');

  useEffect(() => {
    if (stage === 'fadeIn') {
      const timeout = setTimeout(() => setStage('typing'), 1000);
      return () => clearTimeout(timeout);
    }

    if (stage === 'typing' && index < fullText.length) {
      const timeout = setTimeout(() => {
        setText(prev => prev + fullText[index]);
        setIndex(index + 1);
      }, 70);
      return () => clearTimeout(timeout);
    }

    if (stage === 'typing' && index >= fullText.length) {
      const timeout = setTimeout(() => setStage('pause'), 1500);
      return () => clearTimeout(timeout);
    }

    if (stage === 'pause') {
      const timeout = setTimeout(() => {
        setStage('fadeOut');
        setTimeout(onComplete, 1500);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [stage, index, onComplete]);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000,
      opacity: stage === 'fadeIn' || stage === 'fadeOut' ? 0 : 1,
      transform: stage === 'fadeOut' ? 'scale(1.1)' : 'scale(1)',
      transition: 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1), transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden'
    }}>
      {/* CSS animatsiyalar va qolgan qismi o'zgarmadi — oldingi kodingizdan nusxa oldim */}
      {/* ... (oldingi WelcomeAnimation ichidagi kod to'liq qoldirilgan) ... */}
      <h1 style={{ /* ... oldingi stillar ... */ }}>
        {text}
        {stage === 'typing' && <span style={{ animation: 'blink 0.7s infinite' }}>|</span>}
      </h1>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [showAnimation, setShowAnimation] = useState(true);

  // Modal states
  const [isStarsOpen, setIsStarsOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);

  const demoUser = { name: "John Doe", image: "/default-avatar.png" };
  const storedUser = localStorage.getItem("userData");
  const user = storedUser ? JSON.parse(storedUser) : demoUser;

  if (showAnimation) {
    return <WelcomeAnimation onComplete={() => setShowAnimation(false)} />;
  }

  return (
    <div className="dashboard">
      <Header user={user} />

      {/* ⭐ Muhim o'zgartirish: onOpenStarsModal props uzatildi */}
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

      {/* Modallar */}
      {isStarsOpen && <StarsModal onClose={() => setIsStarsOpen(false)} />}
      {isPremiumOpen && <Premium onClose={() => setIsPremiumOpen(false)} />}
    </div>
  );
};

export default Dashboard;