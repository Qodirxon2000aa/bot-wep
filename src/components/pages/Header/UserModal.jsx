import React, { useState, useEffect } from "react";
import "./UserModal.css";
import { useTelegram } from "../../../../context/TelegramContext";

const UserModal = ({ onClose }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [activeHistory, setActiveHistory] = useState("orders");
  
  // ✅ Context faqat bir marta ishlatiladi
  const { user, apiUser, orders, loading: telegramLoading, refreshUser } = useTelegram();
  
  console.log("🔍 UserModal - orders:", orders);
  console.log("🔍 UserModal - orders length:", orders?.length);
  console.log("🔍 UserModal - orders type:", typeof orders, Array.isArray(orders));
  
  const tg = window.Telegram?.WebApp;
  const profilePhotoUrl = user?.photo_url || apiUser?.profile || null;
  const balance = apiUser?.balance || "0";

  // ✅ Orders tarixini to'g'ri formatlash
  const ordersHistory = (orders || []).map((o) => ({
    id: o.order_id,
    type: o.type || "Order",
    amount: `${o.amount} ⭐`, // Stars miqdori
    summa: `${o.summa?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} UZS`, // Summa
    date: o.date || "Noma'lum sana",
    status: o.status || "pending",
    sent: o.sent || "N/A",
    details: `Sent to: ${o.sent} | Status: ${o.status} | Summa: ${o.summa} UZS`,
  }));

  console.log("🔍 ordersHistory mapped:", ordersHistory);
  console.log("🔍 ordersHistory length:", ordersHistory.length);

  // ✅ Fake payments data (real data kelganda API dan olinadi)
  const paymentsHistory = [
    {
      id: 101,
      type: "Payment",
      amount: "+300 000",
      date: "04.01.2026",
      details: "Top up via Payme",
    },
    {
      id: 102,
      type: "Payment",
      amount: "+500 000",
      date: "01.01.2026",
      details: "Bank transfer",
    },
  ];

  const historyData = activeHistory === "orders" ? ordersHistory : paymentsHistory;

  console.log("🔍 activeHistory:", activeHistory);
  console.log("🔍 historyData:", historyData);
  console.log("🔍 historyData length:", historyData.length);

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
              onClick={() => setActiveHistory("orders")}
            >
              🛒 Orders
            </button>
            <button
              className={`history-tab ${
                activeHistory === "payments" ? "active" : ""
              }`}
              onClick={() => setActiveHistory("payments")}
            >
              💳 Payments
            </button>
          </div>

          {/* ================= TABLE ================= */}
          {historyData.length === 0 ? (
            <p className="empty-history">📭 Hozircha tarix yo'q</p>
          ) : (
            historyData.map((item) => (
              <div key={item.id} className="user-row-wrapper">
                <div
                  className="user-table-row"
                  onClick={() => toggleRow(item.id)}
                >
                  <div>{item.type}</div>
                  <div>
                    {activeHistory === "orders" ? item.amount : item.amount}
                  </div>
                  <div>{item.date}</div>
                  <div>{expandedRow === item.id ? "↑" : "↓"}</div>
                </div>
                <div
                  className={`user-row-details ${
                    expandedRow === item.id ? "expanded" : ""
                  }`}
                >
                  {/* ✅ Status badge qo'shildi (faqat orders uchun) */}
                  {activeHistory === "orders" && item.status && (
                    <div className={`order-status ${item.status.toLowerCase()}`}>
                      {item.status}
                    </div>
                  )}
                  <div>
                    <strong>Tafsilot:</strong> {item.details}
                  </div>
                  {/* ✅ Summa ko'rsatish (faqat orders uchun) */}
                  {activeHistory === "orders" && item.summa && (
                    <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
                      <strong>💰 To'lov:</strong> {item.summa}
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