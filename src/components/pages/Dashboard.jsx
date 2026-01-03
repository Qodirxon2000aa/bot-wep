import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import Reklama from "../pages/Reklama/Reklama.jsx";
import Premuim from "../../assets/prem.ico";
import Star from "../../assets/stars.ico";
import Telegram from "../../assets/tg.ico";
import Header from "../pages/Header/Header.jsx";
import Heart from "../../assets/gifts/heart.png";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const [tgUserId, setTgUserId] = useState(null);
  const [balance, setBalance] = useState(0);

  const demoUser = {
    name: "John Doe",
    image: "/default-avatar.png",
  };

  const storedUser = localStorage.getItem("userData");
  const user = storedUser ? JSON.parse(storedUser) : demoUser;

  // 🔥 TELEGRAM WEBAPP INIT
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand();

      const userId = tg.initDataUnsafe?.user?.id;

      if (userId) {
        alert(`ID olindi ✅\nUser ID: ${userId}`);
        setTgUserId(userId);
        getBalance(userId);
      } else {
        alert("ID aniqlanmadi ❌");
      }
    } else {
      alert("Telegram WebApp emas ❌");
    }
  }, []);

  // 🔹 BALANCE OLISH
  const getBalance = (userId) => {
    fetch(`get_user.php?user_id=${userId}`)
      .then((r) => r.json())
      .then((d) => {
        setBalance(d.balance || 0);
      })
      .catch(() => {
        console.error("Balance olishda xatolik");
      });
  };

  // 🔹 BUY FUNCTION
  const buyStars = (amount) => {
    if (!tgUserId || !amount) {
      alert("User ID yoki amount mavjud emas ❌");
      return;
    }

    const confirmed = window.confirm(
      `Siz ${amount} ⭐ sotib olmoqchimisiz?`
    );
    if (!confirmed) return;

    fetch("buy.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `user_id=${tgUserId}&amount=${amount}`,
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.status) {
          setBalance(d.new_balance);
          alert("Sotib olindi ✅");
        } else {
          alert(d.msg);
        }
      });
  };

  return (
    <div className="dashboard">
      <Header user={user} />

      <Reklama />

      {/* ⭐ BALANCE */}
      <div style={{ textAlign: "center", margin: "10px 0" }}>
        <b>Balans:</b> {balance} ⭐
      </div>

      <div className="share-btn">
        <img src={Telegram} alt="telegram" className="tg-icon" />
        <span>Share link to friends</span>
      </div>

      <br /><br />

      <div className="floating-buttons">
        <div
          className="float-btn left-btn"
          onClick={() => buyStars(10)}
        >
          <img src={Premuim} alt="star" />
          <h5>10 ⭐ SOTIB OLISH</h5>
        </div>

        <div
          className="float-btn right-btn"
          onClick={() => buyStars(50)}
        >
          <img src={Star} alt="star" />
          <h5>50 ⭐ SOTIB OLISH</h5>
        </div>
      </div>

      {/* 🎁 GIFTS */}
      <div className="gifts-btn" onClick={() => navigate("/gifts")}>
        <img src={Heart} alt="gift" className="gift-icon" />
        <span>Gifts Page</span>
      </div>
    </div>
  );
};

export default Dashboard;
