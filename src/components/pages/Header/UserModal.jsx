import React, { useEffect, useState } from "react";
import "./UserModal.css";

const UserModal = ({ onClose }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [user, setUser] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  // 🔹 Telegram WebApp + Backend fetch
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.expand();

      if (tg.initDataUnsafe?.user) {
        const user_id = tg.initDataUnsafe.user.id;

        fetch(`https://multinet.uz/webapp/get_user.php?user_id=${user_id}`)
          .then(res => res.json())
          .then(data => {
            if (data.status === "success") {
              setUser({
                name: data.name,
                username: data.username,
                avatar: data.avatar || null,
              });

              // Agar history backend’dan kelsa
              setHistoryData(data.history || []);
            }
          })
          .catch(err => console.error("API error:", err));
      }
    }
  }, []);

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="user-modal-overlay" onClick={onClose}>
      <div className="user-modal" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="user-modal-header">
          <div className="user-modal-profile">
            <div
              className="user-modal-avatar"
              style={{
                backgroundImage: user?.avatar
                  ? `url(${user.avatar})`
                  : "none",
              }}
            ></div>
            <div className="user-modal-info">
              <h3>{user ? user.name : "Loading..."}</h3>
              <p>{user ? `@${user.username}` : ""}</p>
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
          {historyData.length === 0 && (
            <p style={{ textAlign: "center", opacity: 0.6 }}>
              History mavjud emas
            </p>
          )}

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
