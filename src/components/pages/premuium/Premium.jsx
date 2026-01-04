import React, { useState } from "react";
import { useTelegram } from "../../../../context/TelegramContext";
import "./premium.css";

const PremiumModal = ({ onClose }) => {
  const { createOrder, apiUser, user } = useTelegram();
  const [username, setUsername] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [insufficientFunds, setInsufficientFunds] = useState(false);
  const [validationError, setValidationError] = useState("");

  const plans = [
    { 
      id: 3, 
      label: "3 OYLIK", 
      price: 165000,
      img: "https://media.istockphoto.com/id/2150568832/vector/telegram-premium-messenger-account-icon-flying-star-badge-top-rated-profile.jpg?s=612x612&w=0&k=20&c=kT83Oy1iN23R1T8gyBXS2v2fv-xuvmT5ZhxJg55MzfE=" 
    },
    { 
      id: 6, 
      label: "6 OYLIK", 
      price: 225000,
      img: "https://media.istockphoto.com/id/2150568832/vector/telegram-premium-messenger-account-icon-flying-star-badge-top-rated-profile.jpg?s=612x612&w=0&k=20&c=kT83Oy1iN23R1T8gyBXS2v2fv-xuvmT5ZhxJg55MzfE=" 
    },
    { 
      id: 12, 
      label: "12 OYLIK", 
      price: 295000,
      img: "https://media.istockphoto.com/id/2150568832/vector/telegram-premium-messenger-account-icon-flying-star-badge-top-rated-profile.jpg?s=612x612&w=0&k=20&c=kT83Oy1iN23R1T8gyBXS2v2fv-xuvmT5ZhxJg55MzfE=" 
    },
  ];

  const balance = apiUser?.balance || "0";

  const handleSelfClick = () => {
    if (user?.username) {
      setUsername(user.username);
    }
  };

  const handleBuy = async () => {
    if (!username.trim()) {
      setValidationError("Username kiriting");
      return;
    }
    if (!selectedPlan) {
      setValidationError("Premium paket tanlang");
      return;
    }

    const userBalance = Number(apiUser?.balance || 0);
    const totalPrice = selectedPlan.price;

    if (userBalance < totalPrice) {
      setInsufficientFunds(true);
      return;
    }

    setSending(true);
    setSuccess(false);
    setError(false);

    try {
      const result = await createOrder({
        amount: selectedPlan.id,
        sent: username,
        type: "Premium",
        overall: totalPrice,
      });

      if (result.ok) {
        setTimeout(() => {
          setSending(false);
          setSuccess(true);
        }, 1000);
      } else {
        setTimeout(() => {
          setSending(false);
          setError(true);
        }, 800);
      }
    } catch (err) {
      setTimeout(() => {
        setSending(false);
        setError(true);
      }, 800);
    }
  };

  return (
    <div className="premium-overlay" onClick={onClose}>
      <div
        className="premium-modal animate"
        onClick={(e) => e.stopPropagation()}
      >
        {!sending && !success && !error && !insufficientFunds && !validationError && (
          <button className="premium-close" onClick={onClose}>✕</button>
        )}

        {/* 🔄 LOADING */}
        {sending && (
          <div className="modal-status sending">
            <div className="spinner"></div>
            <p>Yuborilmoqda...</p>
          </div>
        )}

        {/* ✅ SUCCESS */}
        {success && (
          <div className="modal-status success">
            <button className="modal-close-status" onClick={() => setSuccess(false)}>
              ✕
            </button>
            <div className="success-icon">✓</div>
            <h3>Muvaffaqiyatli!</h3>
            <p>Premium muvaffaqiyatli sotib olindi</p>
          </div>
        )}

        {/* ❌ ERROR */}
        {error && (
          <div className="modal-status error">
            <button className="modal-close-status" onClick={() => setError(false)}>
              ✕
            </button>
            <div className="error-icon">✕</div>
            <h3>Muvaffaqiyatsiz</h3>
            <p>Buyurtma saqlanmadi</p>
          </div>
        )}

        {/* 💸 INSUFFICIENT FUNDS */}
        {insufficientFunds && (
          <div className="modal-status insufficient">
            <button className="modal-close-status" onClick={() => setInsufficientFunds(false)}>
              ✕
            </button>
            <div className="insufficient-animation">
              <div className="wallet-empty">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                  <path d="M19 7H5C3.89543 7 3 7.89543 3 9V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V9C21 7.89543 20.1046 7 19 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="16" cy="14" r="1.5" fill="currentColor"/>
                  <line x1="5" y1="4" x2="19" y2="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <div className="coins-falling">
                  <span className="coin">💰</span>
                  <span className="coin">💰</span>
                  <span className="coin">💰</span>
                </div>
              </div>
            </div>
            <h3>Mablag' yetarli emas!</h3>
            <p>Hisobingizda yetarli mablag' mavjud emas</p>
            <div className="insufficient-details">
              <div className="detail-row">
                <span>Kerak:</span>
                <strong>{selectedPlan?.price.toLocaleString()} UZS</strong>
              </div>
              <div className="detail-row">
                <span>Mavjud:</span>
                <strong>{balance} UZS</strong>
              </div>
              <div className="detail-row shortage">
                <span>Yetishmayapti:</span>
                <strong className="shortage-amount">
                  {(selectedPlan?.price - Number(balance)).toLocaleString()} UZS
                </strong>
              </div>
            </div>
          </div>
        )}

        {/* ⚠️ VALIDATION ERROR */}
        {validationError && (
          <div className="modal-status validation-error">
            <button className="modal-close-status" onClick={() => setValidationError("")}>
              ✕
            </button>
            <div className="validation-animation">
              <div className="warning-shake">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="17" r="1" fill="currentColor"/>
                </svg>
              </div>
            </div>
            <h3>Diqqat!</h3>
            <p>{validationError}</p>
          </div>
        )}

        {/* 📝 FORM */}
        {!sending && !success && !error && !insufficientFunds && !validationError && (
          <>
            <h2>💎 Telegram Premium</h2>

            <div className="balance-info">
              Hisobingiz: <strong>{balance} UZS</strong>
            </div>

            <div className="username-input-wrapper">
              <input
                className="premium-input"
                type="text"
                placeholder="Username (@example)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button 
                className="self-button"
                onClick={handleSelfClick}
                type="button"
                title="O'zimga"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                O'zimga
              </button>
            </div>

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
                  <p>{plan.price.toLocaleString()} UZS</p>
                </div>
              ))}
            </div>

            <button className="premium-buy-btn" onClick={handleBuy}>
              Sotib olish
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PremiumModal;