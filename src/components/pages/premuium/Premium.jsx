import React, { useState } from "react";
import "./premium.css";

const PremiumModal = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    { id: 3, label: "3 OYLIK", price: "165 000 ", img: "https://media.istockphoto.com/id/2150568832/vector/telegram-premium-messenger-account-icon-flying-star-badge-top-rated-profile.jpg?s=612x612&w=0&k=20&c=kT83Oy1iN23R1T8gyBXS2v2fv-xuvmT5ZhxJg55MzfE=" },
    { id: 6, label: "6 OYLIK", price: "225 000 ", img: "https://media.istockphoto.com/id/2150568832/vector/telegram-premium-messenger-account-icon-flying-star-badge-top-rated-profile.jpg?s=612x612&w=0&k=20&c=kT83Oy1iN23R1T8gyBXS2v2fv-xuvmT5ZhxJg55MzfE=" },
    { id: 12, label: "12 OYLIK", price: "295 000 ", img: "https://media.istockphoto.com/id/2150568832/vector/telegram-premium-messenger-account-icon-flying-star-badge-top-rated-profile.jpg?s=612x612&w=0&k=20&c=kT83Oy1iN23R1T8gyBXS2v2fv-xuvmT5ZhxJg55MzfE=" },
  ];

  const handleBuy = () => {
    if (!username.trim()) {
      alert("Username kiriting");
      return;
    }
    if (!selectedPlan) {
      alert("Premium paket tanlang");
      return;
    }

    alert(
      `💎 Premium Xarid\n` +
      `👤 ${username}\n` +
      `📦 ${selectedPlan.label}\n` +
      `💰 ${selectedPlan.price}`
    );

    onClose();
  };

  return (
    <div className="premium-overlay" onClick={onClose}>
      <div
        className="premium-modal animate"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="premium-close" onClick={onClose}>✕</button>

        <h2>💎 Telegram Premium</h2>

        <input
          className="premium-input"
          type="text"
          placeholder="Username (@example)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <div className="premium-plans">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`premium-card ${
                selectedPlan?.id === plan.id ? "active" : ""
              }`}
              onClick={() => setSelectedPlan(plan)}
            >
              <img src={plan.img} alt={plan.label} />
              <h4>{plan.label}</h4>
              <p>{plan.price}</p>
            </div>
          ))}
        </div>

        <button className="premium-buy-btn" onClick={handleBuy}>
          Sotib olish
        </button>
      </div>
    </div>
  );
};

export default PremiumModal;
