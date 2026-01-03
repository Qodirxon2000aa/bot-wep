import React, { useEffect, useState } from "react";
import "./Stars.css";
import { useTelegram } from "../../../../context/TelegramContext";

const StarsModal = ({ onClose }) => {
  const { createOrder } = useTelegram();

  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // 🔥 PRICE faqat settings dan
  useEffect(() => {
    fetch("https://m4746.myxvest.ru/webapp/settings.php")
      .then((r) => r.json())
      .then((d) => {
        if (d.ok && d.settings?.price) {
          setPrice(Number(d.settings.price));
        }
        setLoading(false);
      });
  }, []);

  const totalPrice = amount && price ? amount * price : 0;

  const handleSubmit = async () => {
    if (!username.trim()) {
      alert("Username kiriting");
      return;
    }

    if (amount < 50 || amount > 500000) {
      alert("Stars 50 -- 500000 oralig‘ida bo‘lishi kerak");
      return;
    }

    setSending(true);

    const result = await createOrder({
      amount,
      sent: username,
      type: "Stars",
      overall: totalPrice,
    });

    setSending(false);

    if (result.ok) {
      alert("✅ Buyurtma qabul qilindi");
      onClose();
    } else {
      alert("❌ Xatolik: " + result.message);
    }
  };

  return (
    <div className="stars-modal-overlay" onClick={onClose}>
      <div className="stars-modal" onClick={(e) => e.stopPropagation()}>
        <button className="stars-close-btn" onClick={onClose}>✕</button>

        <h3>⭐ Stars Xaridi</h3>

        <input
          type="text"
          placeholder="Username (ahdsiz)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="number"
          min={50}
          max={500000}
          placeholder="Stars soni"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />

        {!loading && amount > 0 && (
          <div className="stars-price-box">
            <span>1 ⭐ = {price.toLocaleString()} UZS</span>
            <strong>{totalPrice.toLocaleString()} UZS</strong>
          </div>
        )}

        <button onClick={handleSubmit} disabled={sending}>
          {sending ? "Yuborilmoqda..." : "Sotib olish"}
        </button>
      </div>
    </div>
  );
};

export default StarsModal;
