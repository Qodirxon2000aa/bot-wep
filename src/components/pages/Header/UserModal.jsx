import React, { useState } from "react";
import "./UserModal.css";
import { useTelegram } from "../../../../context/TelegramContext";

const UserModal = ({ onClose }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const { user, apiUser, loading, refreshUser } = useTelegram();

  // Profile rasmi
  const profilePhotoUrl = user?.photo_url || apiUser?.profile || null;

  // Balance ni formatlash
  const formatBalance = (bal) => {
    if (!bal || bal === "0") return "0";
    const balStr = bal.toString();
    return balStr.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Demo history
  const historyData = [
    { id: 1, type: "Transfer", amount: "+250 000", date: "06.12.2025", details: "Sent to account XYZ" },
    { id: 2, type: "Deposit", amount: "+500 000", date: "05.12.2025", details: "Received from Bank" },
    { id: 3, type: "Purchase", amount: "-120 000", date: "04.12.2025", details: "Bought premium stars" },
  ];

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Balance qiymati
  const balance = apiUser?.balance || "0";
  const hasError = !apiUser || balance === "0";

  console.log("🎨 UserModal render:");
  console.log("  - loading:", loading);
  console.log("  - apiUser:", apiUser);
  console.log("  - balance:", balance);

  return (
    <div className="user-modal-overlay" onClick={onClose}>
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
                <div className="avatar-placeholder"></div>
              )}
            </div>
            <div className="user-modal-info">
              <h3>{user?.first_name || ""} {user?.last_name || ""}</h3>
              <p>{user?.username || "Username yo'q"}</p>
              <small>ID: {user?.id || "Noma'lum"}</small>
              
              {/* DEBUG INFO */}
              <div style={{ 
                marginTop: "8px", 
                padding: "8px", 
                backgroundColor: hasError ? "#ffebee" : "#fff3cd",
                border: `1px solid ${hasError ? "#f44336" : "#ffc107"}`,
                borderRadius: "4px",
                fontSize: "11px",
                fontFamily: "monospace"
              }}>
                <div><strong>🔍 DEBUG INFO:</strong></div>
                <div>• Loading: {loading ? "⏳ true" : "✅ false"}</div>
                <div>• Balance: "{balance}"</div>
                <div>• Type: {typeof balance}</div>
                <div>• User ID: {user?.id}</div>
                <div>• Is Telegram: {user?.isTelegram ? "Yes ✅" : "No (DEV) 🔧"}</div>
                <div>• Profile: {apiUser?.profile ? "✅ Yes" : "❌ No"}</div>
                {hasError && (
                  <div style={{color: "#d32f2f", fontWeight: "bold", marginTop: "4px"}}>
                    ⚠️ Balance 0 yoki xato
                  </div>
                )}
              </div>

              {/* BALANCE DISPLAY */}
              <div style={{ 
                marginTop: "12px", 
                fontWeight: "bold", 
                fontSize: "20px", 
                color: hasError ? "#f44336" : "#4CAF50",
                padding: "12px",
                backgroundColor: hasError ? "#ffebee" : "#e8f5e9",
                borderRadius: "8px",
                textAlign: "center",
                border: hasError ? "2px solid #f44336" : "none"
              }}>
                💰 Balance: {
                  loading 
                    ? "⏳ Yuklanmoqda..." 
                    : `${formatBalance(balance)} UZS`
                }
              </div>

              {/* REFRESH BUTTON */}
              {hasError && !loading && (
                <button 
                  onClick={refreshUser}
                  style={{
                    marginTop: "8px",
                    width: "100%",
                    padding: "8px",
                    backgroundColor: "#2196F3",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "14px"
                  }}
                >
                  🔄 Qayta yuklash
                </button>
              )}
            </div>
          </div>
        </div>

        {/* BODY - HISTORY */}
        <div className="user-modal-body">
          <h2 className="user-modal-title">HISTORY</h2>
          {historyData.map((item) => (
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
              <div className={`user-row-details ${expandedRow === item.id ? "expanded" : ""}`}>
                <strong>Tafsilot:</strong> {item.details}
              </div>
            </div>
          ))}
        </div>

        <button className="user-modal-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default UserModal;