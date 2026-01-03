import React, { useState, useEffect } from "react";
import "./UserModal.css";
import { useTelegram } from "../../../../context/TelegramContext";

const UserModal = ({ onClose }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [activeHistory, setActiveHistory] = useState("orders"); // 🔥 NEW
  const { user, apiUser, loading: telegramLoading, refreshUser } = useTelegram();

  const tg = window.Telegram?.WebApp;

  const profilePhotoUrl = user?.photo_url || apiUser?.profile || null;
  const balance = apiUser?.balance || "0";

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

  /* =======================
     🔥 FAKE DATA
  ======================= */

  const ordersHistory = [
    {
      id: 1,
      type: "Order",
      amount: "-150 000",
      date: "05.01.2026",
      details: "Premium subscription order",
    },
    {
      id: 2,
      type: "Order",
      amount: "-80 000",
      date: "02.01.2026",
      details: "Stars package order",
    },
  ];

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

  const historyData =
    activeHistory === "orders" ? ordersHistory : paymentsHistory;

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
              <p>{user?.username || "Username yo‘q"}</p>
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

          {/* 🔥 FILTER BUTTONS */}
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
            <p className="empty-history">📭 Hozircha tarix yo‘q</p>
          ) : (
            historyData.map((item) => (
              <div key={item.id} className="user-row-wrapper">
                <div
                  className="user-table-row"
                  onClick={() => toggleRow(item.id)}
                >
                  <div>{item.type}</div>
                  <div>{item.amount}</div>
                  <div>{item.date}</div>
                  <div>{expandedRow === item.id ? "↑" : "↓"}</div>
                </div>

                <div
                  className={`user-row-details ${
                    expandedRow === item.id ? "expanded" : ""
                  }`}
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
