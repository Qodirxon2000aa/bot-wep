import React, { useEffect, useRef, useState } from "react";
import "./Reklama.css";

import image from "../../../assets/b1.jpg";
import image2 from "../../../assets/b2.jpg";
import main from "../../../assets/main.jpg";

const TELEGRAM_LINK = "https://t.me/m/5SXmspSYMmQy";

const ads = [
  { id: 1, image: main, type: "none" },              // Hech narsa qilmaydi
  { id: 2, image: image, type: "stars" },            // Stars modal ochiladi
  { id: 3, image: image2, type: "telegram" },        // Telegram link ochiladi
];

// Props: onOpenStarsModal — Dashboarddan keladi
const Reklama = ({ onOpenStarsModal }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);

  // Auto slide — har 6 soniyada
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ads.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Swipe effekti (mobil uchun)
  useEffect(() => {
    const slider = carouselRef.current;
    if (!slider) return;

    let startX = 0;
    let moveX = 0;

    const touchStart = (e) => { startX = e.touches[0].clientX; };
    const touchMove = (e) => { moveX = e.touches[0].clientX; };
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

  // Bosilganda nima bo'lishini boshqaruvchi funksiya
  const handleSlideClick = (ad, e) => {
    e.preventDefault(); // Har doim default <a> harakatini to'xtatamiz

    if (ad.type === "stars" && onOpenStarsModal) {
      // 2-rasm: Stars modal ochiladi
      onOpenStarsModal();
      return;
    }

    if (ad.type === "telegram" && TELEGRAM_LINK) {
      // 3-rasm: Telegram link ochiladi
      if (window.Telegram?.WebApp) {
        window.Telegram.WebApp.openLink(TELEGRAM_LINK);
      } else {
        // Agar oddiy brauzerda bo'lsa — yangi tabda ochamiz
        window.open(TELEGRAM_LINK, "_blank", "noopener,noreferrer");
      }
      return;
    }

    // 1-rasm: hech nima qilmaymiz (type: "none")
  };

  return (
    
    <div className="reklama-carousel" ref={carouselRef}>
      <div
        className="carousel-track"
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {ads.map((ad) => (
          <div
            key={ad.id}
            className="reklama-slide"
            onClick={(e) => handleSlideClick(ad, e)} // Butun div bosilganda ham ishlaydi
            style={{ cursor: ad.type !== "none" ? "pointer" : "default" }}
          >
            <a
              href={ad.type === "telegram" ? TELEGRAM_LINK : "#"}
              className="ad-image-wrapper"
              onClick={(e) => handleSlideClick(ad, e)} // <a> va rasmga bosilganda ham
              target={ad.type === "telegram" ? "_blank" : undefined}
              rel="noopener noreferrer"
            >
              <img src={ad.image} alt={`reklama ${ad.id}`} />
            </a>
          </div>
        ))}
      </div>
         {/* Nuqtalar — pastda */}
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