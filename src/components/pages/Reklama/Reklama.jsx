import React, { useEffect, useRef, useState } from "react";
import "./Reklama.css";

const ads = [
  {
    id: 1,
    title: "Boost your earnings!",
    subtitle: "Invite friends & get +5000 coins",
    gradient: "linear-gradient(135deg, #FFD700, #FF8C00)",
    emoji: "🚀",
  },
  {
    id: 2,
    title: "Daily Combo Active!",
    subtitle: "Unlock secret cards today",
    gradient: "linear-gradient(135deg, #FF6B6B, #FF8E53)",
    emoji: "💎",
  },
  {
    id: 3,
    title: "New Event Started!",
    subtitle: "Play now → Win 1,000,000 coins",
    gradient: "linear-gradient(135deg, #9C27B0, #E91E63)",
    emoji: "🏆",
  },
];

const Reklama = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ads.length);
    }, 6000); // sekinroq

    return () => clearInterval(interval);
  }, []);

  // Swipe tashlash
  useEffect(() => {
    const slider = carouselRef.current;
    let startX = 0;
    let moveX = 0;

    const touchStart = (e) => {
      startX = e.touches[0].clientX;
    };

    const touchMove = (e) => {
      moveX = e.touches[0].clientX;
    };

    const touchEnd = () => {
      if (startX - moveX > 50) {
        setActiveIndex((prev) => (prev + 1) % ads.length);
      } else if (moveX - startX > 50) {
        setActiveIndex((prev) => (prev - 1 + ads.length) % ads.length);
      }
    };

    slider.addEventListener("touchstart", touchStart);
    slider.addEventListener("touchmove", touchMove);
    slider.addEventListener("touchend", touchEnd);

    return () => {
      slider.removeEventListener("touchstart", touchStart);
      slider.removeEventListener("touchmove", touchMove);
      slider.removeEventListener("touchend", touchEnd);
    };
  }, []);

  return (
    <div className="reklama-carousel" ref={carouselRef}>
      <div
        className="carousel-track"
        style={{
          transform: `translateX(-${activeIndex * 100}%)`,
        }}
      >
        {ads.map((ad) => (
          <div key={ad.id} className="reklama-slide">
            <div className="ad-card" style={{ background: ad.gradient }}>
              <div className="ad-emoji">{ad.emoji}</div>
              <h3>{ad.title}</h3>
              <p>{ad.subtitle}</p>
              <button className="ad-btn">Claim Now</button>
            </div>
          </div>
        ))}
      </div>

      <div className="carousel-dots">
        {ads.map((_, i) => (
          <span
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`dot ${activeIndex === i ? "active" : ""}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Reklama;
