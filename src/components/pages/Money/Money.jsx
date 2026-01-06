// pages/Money.jsx - TO'LIQ FINAL VERSIYA
import React, { useState, useEffect } from "react";
import "./Money.css";
import { useTelegram } from "../../../../context/TelegramContext";

const Money = ({ onClose }) => {
  const { user, refreshUser } = useTelegram();
  const [amount, setAmount] = useState(""); // foydalanuvchi kiritgan summa (formatlangan)
  const [rawAmount, setRawAmount] = useState(""); // faqat raqamlar (nusxa olish uchun)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [paymentId, setPaymentId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [toast, setToast] = useState("");
  
  const [timeLeft, setTimeLeft] = useState(600);
  const [cardInfo, setCardInfo] = useState(null);

  // Natija animatsiyasi
  const [showResult, setShowResult] = useState(false);
  const [resultType, setResultType] = useState("");
  
  // Pay status tekshiruvi
  const [payStatus, setPayStatus] = useState(null);
  const [showPaymentDisabled, setShowPaymentDisabled] = useState(false);

  // Pay status tekshirish - Har 5 sekundda
  useEffect(() => {
    const checkPayStatus = async () => {
      try {
        const res = await fetch("https://tezpremium.uz/webapp/settings.php");
        const data = await res.json();
        const status = data.settings?.pay_status || "off";
        console.log("Pay status:", status);
        setPayStatus(status);
      } catch (err) {
        console.error("Pay status tekshirishda xatolik:", err);
        setPayStatus("off");
      }
    };
    
    // Darhol tekshirish
    checkPayStatus();
    
    // Har 5 sekundda tekshirish
    const interval = setInterval(checkPayStatus, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Taymer
  useEffect(() => {
    if (waiting && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && waiting) {
      handlePaymentError("Vaqt tugadi");
    }
  }, [waiting, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Muvaffaqiyat
  const handlePaymentSuccess = async () => {
    setResultType("success");
    setShowResult(true);
    await refreshUser();

    setTimeout(() => {
      setShowResult(false);
      setWaiting(false);
      setPaymentId(null);
      setCardInfo(null);
      onClose();
    }, 2500);
  };

  // Xato
  const handlePaymentError = (msg = "To'lov bekor qilindi yoki muvaffaqiyatsiz") => {
    setResultType("error");
    setShowResult(true);

    setTimeout(() => {
      setShowResult(false);
      setWaiting(false);
      setPaymentId(null);
      setCardInfo(null);
      alert(msg + " ❌");
    }, 2500);
  };

  const handleSubmit = async () => {
    setErrorMsg("");
    
    // Pay status tekshiruvi
    if (payStatus === "off") {
      setShowPaymentDisabled(true);
      setTimeout(() => {
        setShowPaymentDisabled(false);
      }, 3000);
      return;
    }
    
    const numAmount = parseInt(rawAmount, 10);
    if (!numAmount || numAmount < 1000 || numAmount > 10000000) {
      setErrorMsg("Summa 1 000 — 10 000 000 UZS oralig'ida bo'lishi kerak");
      return;
    }

    if (!user?.id) {
      setErrorMsg("Foydalanuvchi ID topilmadi");
      return;
    }

    setIsSubmitting(true);
    try {
      const actualUserId = user.isTelegram ? user.id : "7521806735";
      const targetUrl = `https://tezpremium.uz/webapp/payments/review.php?user_id=${actualUserId}&amount=${numAmount}`;

      const res = await fetch(targetUrl, { method: "GET", headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      console.log("Review response:", data);

      if (data.ok && data.payment_id) {
        setPaymentId(data.payment_id);
        setWaiting(true);
        setTimeLeft(600);
        setCardInfo(data.card || { number: "9860 1766 1888 4538", owner: "O/I" });
        checkPaymentStatus(data.payment_id);
      } else {
        setErrorMsg(data.message || "To'lov yaratishda xatolik");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "So'rovda xatolik");
    } finally {
      setIsSubmitting(false);
    }
  };

  const checkPaymentStatus = (pid) => {
    console.log(`[Payment Check] Boshlandi: payment_id = ${pid}`);

    const interval = setInterval(async () => {
      try {
        console.log(`[Payment Check] Tekshirilmoqda... (payment_id: ${pid})`);

        const res = await fetch(
          `https://tezpremium.uz/webapp/payments/status.php?payment_id=${pid}`,
          { method: "GET", headers: { Accept: "application/json" } }
        );

        if (!res.ok) {
          console.warn(`[Payment Check] HTTP xatosi: ${res.status}`);
          return;
        }

        const data = await res.json();
        console.log("[Payment Check] Javob:", data);

        if (data.ok && data.status === "paid") {
          clearInterval(interval);
          handlePaymentSuccess();
        } else if (["failed", "canceled", "expired"].includes(data.status)) {
          clearInterval(interval);
          handlePaymentError("To'lov bekor qilindi yoki muvaffaqiyatsiz");
        }
      } catch (err) {
        console.error("[Payment Check] Xatolik:", err);
      }
    }, 5000);

    setTimeout(() => {
      clearInterval(interval);
      console.log("[Payment Check] 10 daqiqa o'tdi — to'xtatildi");
    }, 600000);
  };

  // Nusxa olish (umumiy funksiya)
  const copyToClipboard = (text, label = "Ma'lumot") => {
    navigator.clipboard.writeText(text);
    setToast(`✅ ${label} nusxalandi`);
    setTimeout(() => setToast(""), 2500);
  };

  return (
    <div className="money-modal-overlay" onClick={onClose}>
      <div className="money-modal" onClick={(e) => e.stopPropagation()}>
        <button className="money-close-btn" onClick={onClose}>×</button>

        <h2 className="money-title">Hisobni to'ldirish</h2>

        {errorMsg && <div className="error-message">{errorMsg}</div>}

        {!waiting ? (
          <>
            <div className="money-method">
              <label>To'lov turi</label>
              <div className="method-selected">Karta orqali</div>
            </div>

            <div className="money-amount">
              <label>To'lov summasi (UZS)</label>
              <input
                type="text"
                placeholder="misol: 50 000"
                value={amount}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setRawAmount(val);
                  setAmount(val ? parseInt(val, 10).toLocaleString("ru-RU") : "");
                }}
              />
              <div className="money-limits">
                Min: 1 000 UZS • Max: 10 000 000 UZS
              </div>
            </div>

            <button
              className="money-submit-btn"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Yuborilmoqda..." : "To'lovga o'tish"}
            </button>
          </>
        ) : (
          <div className="money-waiting">
            <div className="waiting-spinner"></div>
            <h3>To'lovni yakunlang</h3>
            <p>Kartangizdan to'lovni amalga oshiring</p>
              <p>Belgilangan tolovdan 1 so’m ko’p ham kam ham tashlamang!</p>
            <br />

            {/* To'lov summasi ko'rsatish va copy qilish */}
            <div className="payment-amount-display">
              <div className="amount-info">
                <div className="amount-label">To'lov summasi</div>
                <div className="amount-value">{amount} UZS</div>
              </div>
              <button
                className="copy-amount-btn"
                onClick={() => copyToClipboard(rawAmount, "To'lov summasi")}
              >
                Nusxa olish
              </button>
            </div>
            <br />

            {/* Karta ma'lumotlari */}
            {cardInfo && (
              <div className="card-details">
                <div className="card-info">
                  <div>
                    <div className="card-label">Karta raqami</div>
                    <div className="card-number">{cardInfo.number}</div>
                  </div>
                  <button
                    className="copy-card-btn"
                    onClick={() => copyToClipboard(cardInfo.number, "Karta raqami")}
                  >
                    Nusxa olish
                  </button>
                </div>

                <div className="card-owner">
                  <span>Karta egasi</span>
                  <span>{cardInfo.owner}</span>
                </div>
              </div>
            )}

            {/* Taymer */}
            <div className="deadline timer-active">
              <span className="clock-icon">⏰</span>
              <span>Qolgan vaqt: <strong className="timer-countdown">{formatTime(timeLeft)}</strong></span>
            </div>

            <p className="waiting-note">
              To'lov holatini avtomatik tekshirib turibmiz...<br />
              (Har 5 sekundda)
            </p>
          </div>
        )}

        {/* Animatsiyali natija */}
        {showResult && (
          <div className={`payment-result-overlay ${resultType}`}>
            <div className="result-icon">
              {resultType === "success" ? "✓" : "✖"}
            </div>
            <div className="result-text">
              {resultType === "success" ? "To'lov muvaffaqiyatli!" : "To'lov bekor qilindi"}
            </div>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && <div className="toast-notification">{toast}</div>}
      
      {/* To'lov o'chirilgan xabari */}
      {showPaymentDisabled && (
        <div className="payment-disabled-overlay">
          <div className="payment-disabled-modal">
            <div className="disabled-icon">🚫</div>
            <h3>To'lov vaqtincha o'chirilgan</h3>
            <p>Hozirda web appdan to'lov qilish imkoni yo'q.</p>
            <p className="bot-text">📱 Bot orqali to'lov amalga oshiring</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Money;