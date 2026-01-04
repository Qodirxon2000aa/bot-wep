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

// Welcome Animation Component
const WelcomeAnimation = ({ onComplete }) => {
  const [text, setText] = useState("");
  const fullText = "Assalomu alaykum, xush kelibsiz!";
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState('fadeIn'); // fadeIn -> typing -> pause -> fadeOut

  useEffect(() => {
    // Stage 1: Fade In (1s)
    if (stage === 'fadeIn') {
      const timeout = setTimeout(() => setStage('typing'), 1000);
      return () => clearTimeout(timeout);
    }

    // Stage 2: Typing Effect
    if (stage === 'typing' && index < fullText.length) {
      const timeout = setTimeout(() => {
        setText(prev => prev + fullText[index]);
        setIndex(index + 1);
      }, 70);
      return () => clearTimeout(timeout);
    }

    // Stage 3: Pause after typing (1.5s)
    if (stage === 'typing' && index >= fullText.length) {
      const timeout = setTimeout(() => setStage('pause'), 1500);
      return () => clearTimeout(timeout);
    }

    // Stage 4: Fade Out (1.5s)
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
      opacity: stage === 'fadeIn' ? 0 : stage === 'fadeOut' ? 0 : 1,
      transform: stage === 'fadeOut' ? 'scale(1.1)' : 'scale(1)',
      transition: 'opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1), transform 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden'
    }}>
      <style>{`
        @keyframes particles {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes textReveal {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.9);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>

      {/* Animated Particles Background */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            background: 'rgba(255, 255, 255, 0.6)',
            borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `particles ${Math.random() * 10 + 15}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
            filter: 'blur(1px)'
          }}
        />
      ))}

      <div style={{
        position: 'relative',
        zIndex: 1,
        opacity: stage === 'typing' || stage === 'pause' ? 1 : 0,
        transform: stage === 'typing' || stage === 'pause' ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        <h1 style={{
          color: 'white',
          fontSize: 'clamp(28px, 6vw, 56px)',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          fontWeight: '900',
          textAlign: 'center',
          padding: '0 20px',
          letterSpacing: '3px',
          textShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 60px rgba(255,255,255,0.3)',
          background: 'linear-gradient(90deg, #fff 0%, #fff 50%, rgba(255,255,255,0.7) 100%)',
          backgroundSize: '200% auto',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: stage === 'pause' ? 'shimmer 3s linear infinite, pulse 2s ease-in-out infinite' : 'shimmer 3s linear infinite',
          lineHeight: 1.4
        }}>
          {text}
          {stage === 'typing' && (
            <span style={{
              animation: 'blink 0.7s infinite',
              marginLeft: '4px',
              WebkitTextFillColor: 'white'
            }}>|</span>
          )}
        </h1>

        {/* Decorative elements */}
        <div style={{
          width: '100px',
          height: '4px',
          background: 'linear-gradient(90deg, transparent, white, transparent)',
          margin: '30px auto 0',
          borderRadius: '2px',
          opacity: stage === 'pause' ? 1 : 0,
          transition: 'opacity 0.8s ease',
          boxShadow: '0 0 20px rgba(255,255,255,0.8)'
        }} />
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [showAnimation, setShowAnimation] = useState(true);

  // ⭐ MODAL STATES
  const [isStarsOpen, setIsStarsOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);

  const demoUser = {
    name: "John Doe",
    image: "/default-avatar.png",
  };

  const storedUser = localStorage.getItem("userData");
  const user = storedUser ? JSON.parse(storedUser) : demoUser;

  // Agar animatsiya ko'rsatilayotgan bo'lsa
  if (showAnimation) {
    return <WelcomeAnimation onComplete={() => setShowAnimation(false)} />;
  }

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