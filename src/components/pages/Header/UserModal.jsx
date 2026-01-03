import React, { useState, useEffect } from "react";
import "./UserModal.css";

const UserModal = ({ onClose }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [tgUser, setTgUser] = useState(null);

  // 🔹 Telegram WebApp integration
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand();

      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        setTgUser(tg.initDataUnsafe.user);
      } else {
        alert("Web App Telegram ichida ochilmagan!");
      }
    }
  }, []);

  const historyData = [
    {
      id: 1,
      type: "Transfer",
      amount: "+250 000",
      date: "06.12.2025",
      details: "Sent to account XYZ",
    },
    {
      id: 2,
      type: "Deposit",
      amount: "+500 000",
      date: "05.12.2025",
      details: "Received from Bank",
    },
    {
      id: 3,
      type: "Purchase",
      amount: "-120 000",
      date: "04.12.2025",
      details: "Bought premium stars",
    },
  ];

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="user-modal-overlay" onClick={onClose}>
      <div className="user-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="user-modal-header">
          <div className="user-modal-profile">
            <div className="user-modal-avatar">
              {tgUser?.photo_url && (
                <img src={tgUser.photo_url} alt="avatar" />
              )}
            </div>

            <div className="user-modal-info">
              <h3>
                {tgUser
                  ? `${tgUser.first_name || ""} ${tgUser.last_name || ""}`
                  : "Loading..."}
              </h3>
              <p>@{tgUser?.username || "no_username"}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="user-modal-body">
          <h2 className="user-modal-title">HISTORY</h2>

          {/* Table Header */}
          <div className="user-table-header">
            <div className="user-th-action">
              <span className="user-dot"></span>
              ACTION TYPE
            </div>
            <div className="user-th-amount">AMOUNT</div>
            <div className="user-th-date">DATE</div>
            <div className="user-th-expand"></div>
          </div>

          {/* Rows */}
          {historyData.map((item) => (
            <div key={item.id} className="user-row-wrapper">

              <div
                className="user-table-row"
                onClick={() => toggleRow(item.id)}
              >
                <div className="user-action-cell">
                  <span className="user-dot"></span>
                  {item.type}
                </div>
                <div className="user-amount-cell">{item.amount}</div>
                <div className="user-date-cell">{item.date}</div>
                <div className="user-expand-icon">
                  {expandedRow === item.id ? "↑" : "↓"}
                </div>
              </div>

              <div
                className={`user-row-details ${
                  expandedRow === item.id ? "expanded" : ""
                }`}
              >
                <div className="details-content">
                  <strong>Tafsilot:</strong> {item.details}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <button className="user-modal-close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default UserModal;
