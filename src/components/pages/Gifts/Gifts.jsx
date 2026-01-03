// Gifts.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, EffectCoverflow } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";
import "./Gifts.css";

import Dashboard from "../Dashboard.jsx";

import Header from "../../pages/Header/Header.jsx";

// Rasmlar
import gift1 from "../../../assets/gifts/rocket.png";
import gift2 from "../../../assets/gifts/rocket.png";
import gift3 from "../../../assets/gifts/rocket.png";
import gift4 from "../../../assets/gifts/rocket.png";
import gift5 from "../../../assets/gifts/rocket.png";
import gift6 from "../../../assets/gifts/rocket.png";
import gift7 from "../../../assets/gifts/rocket.png";
import gift8 from "../../../assets/gifts/rocket.png";
import gift9 from "../../../assets/gifts/rocket.png";

import BackIcon from "../../../assets/back.png"; // orqaga tugma rasmi

const gifts = [
  { img: gift1, stars: "15",     price: "3.500 uzs" },
  { img: gift2, stars: "50",     price: "10.000 uzs" },
  { img: gift3, stars: "100",    price: "18.000 uzs" },
  { img: gift4, stars: "300",    price: "49.000 uzs" },
  { img: gift5, stars: "500",    price: "85.000 uzs" },
  { img: gift6, stars: "1.000",  price: "165.000 uzs" },
  { img: gift7, stars: "2.500",  price: "399.000 uzs" },
  { img: gift8, stars: "5.000",  price: "799.000 uzs" },
  { img: gift9, stars: "10.000", price: "1.599.000 uzs" },
];

const Gifts = () => {
  const navigate = useNavigate();

  const demoUser = {
    name: "John Doe",
    image: "/default-avatar.png",
  };

  const storedUser = localStorage.getItem("userData");
  const user = storedUser ? JSON.parse(storedUser) : demoUser;

  return (
    <div className="gifts-page">

      {/* Header sahifa tepasida chiqishi */}
      <Header user={user} />

      {/* Back Button */}
     <div className="back-btn" onClick={() => navigate("/dashboard")}>
  <img src={BackIcon} alt="back"/>
  <span>Orqaga</span>
</div>


      <div className="gifts-slider-container">
        <h2 className="slider-title">Sovg‘alar</h2>

        <Swiper
          modules={[Navigation, Autoplay, EffectCoverflow]}
          spaceBetween={20}
          slidesPerView={1.3}
          breakpoints={{
            480: { slidesPerView: 2.2 },
            768: { slidesPerView: 3.3 },
            1024: { slidesPerView: 4.3 },
            1280: { slidesPerView: 5.3 },
          }}
          centeredSlides={true}
          loop={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          navigation={true}
          effect={"coverflow"}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 200,
            modifier: 1.5,
            slideShadows: true,
          }}
          grabCursor={true}
        >
          {gifts.map((gift, index) => (
            <SwiperSlide key={index}>
              <div className="gift-card">
                <img src={gift.img} alt={`Gift ${index + 1}`} />
                <h4 className="stars">{gift.stars} stars</h4>
                <h4 className="price">{gift.price}</h4>
                <button className="buy-btn">Sotib olish</button>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Gifts;
