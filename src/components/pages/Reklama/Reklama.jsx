import React, { useEffect, useRef, useState } from "react";
import "./Reklama.css";
import image from "../../../assets/b1.jpg"
import image2 from "../../../assets/b2.jpg"
const ads = [
  {
    id: 1,
    image: image, // 🔗 o'zing rasm qo'yasan
    link: "#", // 🔗 o'zing link qo'yasan
  },
  {
    id: 2,
    image: image2,
    link: "#",
  },
  {
    id: 3,
    image: image,
    link: "#",
  },
];

const Reklama = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef(null);

  // 🔁 Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ads.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // 👉 Swipe
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
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {ads.map((ad) => (
          <div key={ad.id} className="reklama-slide">
            <a href={ad.link} className="ad-image-wrapper">
              <img src={ad.image} alt="reklama" />
            </a>
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
