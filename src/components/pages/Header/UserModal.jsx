import React, { useState, useEffect } from "react";
import "./UserModal.css";
import { useTelegram } from "../../../../context/TelegramContext";

const UserModal = ({ onClose }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const { user, apiUser, loading: telegramLoading, refreshUser } = useTelegram();

  // Telegram WebApp API
  const tg = window.Telegram?.WebApp;

  // Profile rasmi: Telegram user photo yoki API dan
  const profilePhotoUrl = user?.photo_url || apiUser?.profile || null;

  // ✅ Balance ni context dan olamiz
  const balance = apiUser?.balance || "0";

  // ✅ Modal ochilganda:
  // 1. Telegram BackButton ni yoqamiz
  // 2. Balance ni yangilaymiz
  useEffect(() => {
    // Telegram BackButton ni ko'rsatish
    if (tg) {
      tg.BackButton.show();
      tg.BackButton.onClick(onClose);
    }

    // Balance ni yangilash
    if (refreshUser) {
      console.log("🔄 UserModal ochildi - balance yangilanmoqda...");
      refreshUser();
    }

    // Cleanup: Modal yopilganda BackButton ni o'chirish
    return () => {
      if (tg) {
        tg.BackButton.hide();
        tg.BackButton.offClick(onClose);
      }
    };
  }, [refreshUser, onClose, tg]);

  // 📜 Demo history
  const historyData = [
    { 
      id: 1, 
      type: "Transfer", 
      amount: "+250 000", 
      date: "06.12.2025", 
      details: "Sent to account XYZ" 
    },
    { 
      id: 2, 
      type: "Deposit", 
      amount: "+500 000", 
      date: "05.12.2025", 
      details: "Received from Bank" 
    },
    { 
      id: 3, 
      type: "Purchase", 
      amount: "-120 000", 
      date: "04.12.2025", 
      details: "Bought premium stars" 
    },
  ];

  const toggleRow = (id) => {
    // Telegram Haptic Feedback
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred('light');
    }
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Balance formatlash
  const formatBalance = (bal) => {
    if (!bal || bal === "0") return "0";
    return bal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Close tugmasi bosilganda Haptic Feedback
  const handleClose = () => {
    if (tg?.HapticFeedback) {
      tg.HapticFeedback.impactOccurred('medium');
    }
    onClose();
  };

  // Debug logs
  useEffect(() => {
    console.log("=== UserModal Debug ===");
    console.log("👤 User:", user);
    console.log("💰 API User:", apiUser);
    console.log("💵 Balance:", balance);
    console.log("⏳ Loading:", telegramLoading);
    console.log("📱 Is Telegram:", user?.isTelegram);
    console.log("======================");
  }, [user, apiUser, balance, telegramLoading]);

  return (
    <div className="user-modal-overlay" onClick={handleClose}>
      <div className="user-modal" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="user-modal-header">
          <div className="user-modal-profile">
            <div className="user-modal-avatar">
              {profilePhotoUrl ? (
                <img
                  src={profilePhotoUrl}
                  alt="Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    console.warn("❌ Profile photo yuklanmadi:", profilePhotoUrl);
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="avatar-placeholder">
                  {user?.first_name?.[0]?.toUpperCase() || "?"}
                </div>
              )}
            </div>
            <div className="user-modal-info">
              <h3>
                {user?.first_name || ""} {user?.last_name || ""}
              </h3>
              <p>{user?.username || "Username yo'q"}</p>
              <small>ID: {user?.id || "Noma'lum"}</small>
              
              {/* Balance ko'rsatish */}
              <div 
                style={{ 
                  marginTop: "8px", 
                  fontWeight: "bold", 
                  fontSize: "18px", 
                  color: "#4CAF50" 
                }}
              >
                💰 Balance: {
                  telegramLoading 
                    ? "⏳ Yuklanmoqda..." 
                    : balance === "0" && !apiUser
                      ? "❌ Xatolik"
                      : `${formatBalance(balance)} UZS`
                }
              </div>

              {/* Debug info (faqat dev mode da) */}
              {!user?.isTelegram && (
                <small style={{ color: "#ff9800", marginTop: "4px", display: "block" }}>
                  ⚠️ DEV MODE
                </small>
              )}
            </div>
          </div>
        </div>

        {/* BODY - HISTORY */}
        <div className="user-modal-body">
          <h2 className="user-modal-title">HISTORY</h2>
          {historyData.length === 0 ? (
            <p style={{ textAlign: "center", color: "#999", padding: "20px" }}>
              📭 Hozircha tarix yo'q
            </p>
          ) : (
            historyData.map((item) => (
              <div key={item.id} className="user-row-wrapper">
                <div
                  className="user-table-row"
                  onClick={() => toggleRow(item.id)}
                >
                  <div className="user-action-cell">{item.type}</div>
                  <div className="user-amount-cell">{item.amount}</div>
                  <div className="user-date-cell">{item.date}</div>
                  <div className="user-expand-icon">
                    {expandedRow === item.id ? "↑" : "↓"}
                  </div>
                </div>
                <div 
                  className={`user-row-details ${expandedRow === item.id ? "expanded" : ""}`}
                >
                  <strong>Tafsilot:</strong> {item.details}
                </div>
              </div>
            ))
          )}
        </div>

        <button className="user-modal-close" onClick={handleClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default UserModal;