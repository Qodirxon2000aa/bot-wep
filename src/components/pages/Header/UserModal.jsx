import React, { useState, useEffect } from "react";
import "./UserModal.css";
import { useTelegram } from "../../../../context/TelegramContext";

const UserModal = ({ onClose }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [activeHistory, setActiveHistory] = useState("orders");
  
  // ✅ Context dan orders va payments
  const { 
    user, 
    apiUser, 
    orders, 
    payments,
    loading: telegramLoading, 
    refreshUser 
  } = useTelegram();
  
  const tg = window.Telegram?.WebApp;
  const profilePhotoUrl = user?.photo_url || apiUser?.profile || null;
  const balance = apiUser?.balance || "0";

  // ✅ Orders tarixini formatlash
  const ordersHistory = (orders || []).map((o) => ({
    id: o.order_id || o.id,
    type: "🛒 Order",
    amount: `${o.amount || 0} ⭐️`,
    summa: `${(o.summa || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} UZS`,
    date: o.date || o.created_at || "Noma'lum",
    status: o.status || "pending",
    sent: o.sent || o.recipient || "N/A",
    details: `Qabul qiluvchi: ${o.sent || o.recipient || "N/A"} | Status: ${o.status || "pending"}`,
  }));

  // ✅ Payments tarixini formatlash
  const paymentsHistory = (payments || []).map((p) => ({
    id: p.payment_id || p.id,
    type: "💳 Payment",
    amount: `+${(p.amount || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} UZS`,
    date: p.date || p.created_at || "Noma'lum",
    method: p.method || p.payment_method || "Unknown",
    status: p.status || "completed",
    details: `To'lov turi: ${p.method || p.payment_method || "Unknown"} | Status: ${p.status || "completed"}`,
  }));

  const historyData = activeHistory === "orders" ? ordersHistory : paymentsHistory;

  console.log("🔍 UserModal - activeHistory:", activeHistory);
  console.log("🔍 UserModal - orders:", orders);
  console.log("🔍 UserModal - payments:", payments);
  console.log("🔍 UserModal - historyData:", historyData);

  useEffect(() => {
    if (tg?.BackButton?.isSupported !== false) {
      try {
        tg.BackButton.show();
        tg.BackButton.onClick(onClose);
      } catch {}
    }
    refreshUser && refreshUser();
    
    return () => {
      if (tg?.BackButton?.isSupported !== false) {
        try {
          tg.BackButton.hide();
          tg.BackButton.offClick(onClose);
        } catch {}
      }
    };
  }, []);

  const toggleRow = (id) => {
    tg?.HapticFeedback?.impactOccurred?.("light");
    setExpandedRow(expandedRow === id ? null : id);
  };

  const formatBalance = (bal) =>
    bal?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") || "0";

  const handleClose = () => {
    tg?.HapticFeedback?.impactOccurred?.("medium");
    onClose();
  };

  // ✅ Status rangini aniqlash
  const getStatusColor = (status) => {
    const colors = {
      completed: "#4CAF50",
      pending: "#FF9800",
      cancelled: "#F44336",
      failed: "#F44336",
    };
    return colors[status?.toLowerCase()] || "#999";
  };

  return (
    <div className="user-modal-overlay" onClick={handleClose}>
      <div className="user-modal" onClick={(e) => e.stopPropagation()}>
        {/* ================= HEADER ================= */}
        <div className="user-modal-header">
          <div className="user-modal-profile">
            <div className="user-modal-avatar">
              {profilePhotoUrl ? (
                <img src={profilePhotoUrl} alt="Profile" />
              ) : (
                <div className="avatar-placeholder">
                  {user?.first_name?.[0] || "?"}
                </div>
              )}
            </div>
            <div className="user-modal-info">
              <h3>
                {user?.first_name} {user?.last_name}
              </h3>
              <p>{user?.username || "Username yo'q"}</p>
              <small>ID: {user?.id}</small>
              <div className="user-balance">
                💰 Balance:{" "}
                {telegramLoading
                  ? "Yuklanmoqda..."
                  : `${formatBalance(balance)} UZS`}
              </div>
            </div>
          </div>
        </div>

        {/* ================= BODY ================= */}
        <div className="user-modal-body">
          <h2 className="user-modal-title">HISTORY</h2>
          
          {/* FILTER BUTTONS */}
          <div className="history-tabs">
            <button
              className={`history-tab ${
                activeHistory === "orders" ? "active" : ""
              }`}
              onClick={() => {
                setActiveHistory("orders");
                setExpandedRow(null);
              }}
            >
              🛒 Orders ({ordersHistory.length})
            </button>
            <button
              className={`history-tab ${
                activeHistory === "payments" ? "active" : ""
              }`}
              onClick={() => {
                setActiveHistory("payments");
                setExpandedRow(null);
              }}
            >
              💳 Payments ({paymentsHistory.length})
            </button>
          </div>

          {/* ================= TABLE ================= */}
          {telegramLoading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Yuklanmoqda...</p>
            </div>
          ) : historyData.length === 0 ? (
            <p className="empty-history">
              📭 {activeHistory === "orders" ? "Buyurtmalar" : "To'lovlar"} tarixida ma'lumot yo'q
            </p>
          ) : (
            historyData.map((item) => (
              <div key={item.id} className="user-row-wrapper">
                <div
                  className="user-table-row"
                  onClick={() => toggleRow(item.id)}
                >
                  <div className="row-type">{item.type}</div>
                  <div className="row-amount">{item.amount}</div>
                  <div className="row-date">{item.date}</div>
                  <div className="row-toggle">
                    {expandedRow === item.id ? "↑" : "↓"}
                  </div>
                </div>
                <div
                  className={`user-row-details ${
                    expandedRow === item.id ? "expanded" : ""
                  }`}
                >
                  {/* ✅ Status badge */}
                  <div 
                    className="status-badge"
                    style={{ 
                      backgroundColor: getStatusColor(item.status),
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      display: 'inline-block',
                      marginBottom: '8px'
                    }}
                  >
                    {item.status?.toUpperCase()}
                  </div>
                  
                  <div style={{ marginTop: '8px' }}>
                    <strong>📋 Tafsilot:</strong> {item.details}
                  </div>
                  
                  {/* ✅ Orders uchun summa */}
                  {activeHistory === "orders" && item.summa && (
                    <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
                      <strong>💰 To'lov:</strong> {item.summa}
                    </div>
                  )}
                  
                  {/* ✅ Payments uchun method */}
                  {activeHistory === "payments" && item.method && (
                    <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
                      <strong>🏦 To'lov usuli:</strong> {item.method}
                    </div>
                  )}
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