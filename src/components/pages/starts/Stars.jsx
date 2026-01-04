import React, { useEffect, useState } from "react";
import { useTelegram } from "../../../../context/TelegramContext";
import "./Stars.css";

const StarsModal = ({ onClose }) => {
  const { createOrder, apiUser, user } = useTelegram();
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [insufficientFunds, setInsufficientFunds] = useState(false);

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
  const balance = loading ? "..." : apiUser?.balance || "0";

  const handleSelfClick = () => {
    if (user?.username) {
      setUsername(user.username);
    }
  };

  const handleSubmit = async () => {
    if (!username.trim()) return alert("Username kiriting");
    if (amount < 50 || amount > 500000) {
      return alert("Stars 50 — 500000 oralig'ida bo'lishi kerak");
    }

    const userBalance = Number(apiUser?.balance || 0);
    if (userBalance < totalPrice) {
      setInsufficientFunds(true);
      setTimeout(() => {
        setInsufficientFunds(false);
      }, 3000);
      return;
    }

    setSending(true);
    setSuccess(false);
    setError(false);

    try {
      const result = await createOrder({
        amount,
        sent: username,
        type: "Stars",
        overall: totalPrice,
      });

      if (result.ok) {
        setTimeout(() => {
          setSending(false);
          setSuccess(true);
          setTimeout(() => {
            onClose();
          }, 1800);
        }, 1000);
      } else {
        setTimeout(() => {
          setSending(false);
          setError(true);
          setTimeout(() => {
            onClose();
          }, 1800);
        }, 800);
      }
    } catch (err) {
      setTimeout(() => {
        setSending(false);
        setError(true);
        setTimeout(() => {
          onClose();
        }, 1800);
      }, 800);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {!sending && !success && (
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        )}

        {sending && (
          <div className="modal-status sending">
            <div className="spinner"></div>
            <p>Yuborilmoqda...</p>
          </div>
        )}

        {success && (
          <div className="modal-status success">
            <div className="success-icon">✓</div>
            <h3>Muvaffaqiyatli!</h3>
            <p>Stars muvaffaqiyatli sotib olindi</p>
          </div>
        )}

        {error && (
          <div className="modal-status error">
            <div className="error-icon">✕</div>
            <h3>Muvaffaqiyatsiz</h3>
            <p>Buyurtma saqlanmadi</p>
          </div>
        )}

        {/* 💸 INSUFFICIENT FUNDS */}
        {insufficientFunds && (
          <div className="modal-status insufficient">
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
                <strong>{totalPrice.toLocaleString()} UZS</strong>
              </div>
              <div className="detail-row">
                <span>Mavjud:</span>
                <strong>{balance} UZS</strong>
              </div>
              <div className="detail-row shortage">
                <span>Yetishmayapti:</span>
                <strong className="shortage-amount">
                  {(totalPrice - Number(balance)).toLocaleString()} UZS
                </strong>
              </div>
            </div>
          </div>
        )}

        {!sending && !success && !error && !insufficientFunds && (
          <>
            <h2 className="modal-title">⭐ Stars Xaridi</h2>
            <div className="balance-info">
              Hisobingiz: <strong>{balance} UZS</strong>
            </div>

            <div className="input-group">
              <label>Telegram Username</label>
              <div className="username-input-wrapper">
                <input
                  type="text"
                  placeholder="@username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="modal-input"
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
            </div>

            <div className="input-group">
              <label>Stars miqdori (50 - 500000)</label>
              <input
                type="number"
                placeholder="Masalan: 100"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="modal-input"
              />
            </div>

            {!loading && amount > 0 && (
              <div className="price-info">
                <span className="price-rate">1 ⭐ = {price.toLocaleString()} UZS</span>
                <span className="price-total">{totalPrice.toLocaleString()} UZS</span>
              </div>
            )}

            <button className="submit-btn" onClick={handleSubmit}>
              Sotib olish
            </button>
          </>
        )}
      </div>


    </div>
  );
};

export default StarsModal;