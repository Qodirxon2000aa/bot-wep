import React, { useState, useEffect } from "react";
import "./UserModal.css";
import { useTelegram } from "../../../../context/TelegramContext";

const UserModal = ({ onClose }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const { user, apiUser, loading: telegramLoading, refreshUser } = useTelegram();

  // Telegram WebApp API
  const tg = window.Telegram?.WebApp;

  // Profile rasmi
  const profilePhotoUrl = user?.photo_url || apiUser?.profile || null;

  // ✅ Balance ni context dan olamiz
  const balance = apiUser?.balance || "0";

  // ✅ Modal ochilganda balance ni yangilash
  useEffect(() => {
    console.log("🔄 UserModal ochildi - balance yangilanmoqda...");
    
    // BackButton ni xavfsiz ishlatish (version check)
    if (tg?.BackButton?.isSupported !== false) {
      try {
        tg.BackButton.show();
        tg.BackButton.onClick(onClose);
      } catch (e) {
        console.warn("BackButton xatolik:", e);
      }
    }

    // Balance ni yangilash
    if (refreshUser) {
      refreshUser();
    }

    // Cleanup
    return () => {
      if (tg?.BackButton?.isSupported !== false) {
        try {
          tg.BackButton.hide();
          tg.BackButton.offClick(onClose);
        } catch (e) {
          console.warn("BackButton cleanup xatolik:", e);
        }
      }
    };
  }, []); // Faqat bir marta

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
    // Haptic Feedback - xavfsiz ishlatish
    if (tg?.HapticFeedback?.impactOccurred) {
      try {
        tg.HapticFeedback.impactOccurred('light');
      } catch (e) {
        // Ignore
      }
    }
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Balance formatlash
  const formatBalance = (bal) => {
    if (!bal || bal === "0") return "0";
    return bal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Close
  const handleClose = () => {
    if (tg?.HapticFeedback?.impactOccurred) {
      try {
        tg.HapticFeedback.impactOccurred('medium');
      } catch (e) {
        // Ignore
      }
    }
    onClose();
  };

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
              
              {/* Balance */}
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
                    : `${formatBalance(balance)} UZS`
                }
              </div>

              {/* CORS xatoligi haqida ogohlantirish */}
              {!telegramLoading && balance === "0" && (
                <small style={{ color: "#ff5722", marginTop: "4px", display: "block" }}>
                  ⚠️ Server bilan bog'lanish xatoligi (CORS)
                </small>
              )}

              {/* DEV MODE */}
              {!user?.isTelegram && (
                <small style={{ color: "#ff9800", marginTop: "4px", display: "block" }}>
                  🔧 DEV MODE
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