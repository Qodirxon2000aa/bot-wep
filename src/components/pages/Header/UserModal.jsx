import React, { useEffect, useState } from "react";
import "./UserModal.css";

const UserModal = ({ onClose }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [user, setUser] = useState({
    id: "",
    first_name: "",
    last_name: "",
    username: ""
  });

useEffect(() => {
  const telegram = window.Telegram?.WebApp;

  if (!telegram) {
    console.log("Telegram WebApp mavjud emas");
    return;
  }

  telegram.ready();
  telegram.expand();
  telegram.requestFullscreen?.();
  telegram.disableVerticalSwipes?.();
  telegram.MainButton?.hide();

  // 🔴 ID ni aynan sen aytgan usulda olish
  const tgUser = telegram.initDataUnsafe?.user;

  if (tgUser && tgUser.id) {
    setUser({
      id: tgUser.id.toString(),
      first_name: tgUser.first_name || "",
      last_name: tgUser.last_name || "",
      username: tgUser.username ? `@${tgUser.username}` : "Yo'q",
    });

    console.log("TG USER (your method):", tgUser);
  } else {
    console.log("Telegram user topilmadi");
  }
}, []);


  // Qolgan kod o'zgarmaydi...
  const historyData = [
    { id: 1, type: "Transfer", amount: "+250 000", date: "06.12.2025", details: "Sent to account XYZ" },
    { id: 2, type: "Deposit", amount: "+500 000", date: "05.12.2025", details: "Received from Bank" },
    { id: 3, type: "Purchase", amount: "-120 000", date: "04.12.2025", details: "Bought premium stars" },
  ];

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="user-modal-overlay" onClick={onClose}>
      <div className="user-modal" onClick={(e) => e.stopPropagation()}>
        <div className="user-modal-header">
          <div className="user-modal-profile">
            <div className="user-modal-avatar"></div>
            <div className="user-modal-info">
              <h3>{user.first_name} {user.last_name}</h3>
              <p>{user.username}</p>
              <small>ID: {user.id || "Yuklanmoqda..."}</small>
            </div>
          </div>
        </div>

        <div className="user-modal-body">
          <h2 className="user-modal-title">HISTORY</h2>
          {historyData.map((item) => (
            <div key={item.id} className="user-row-wrapper">
              <div className="user-table-row" onClick={() => toggleRow(item.id)}>
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
          ))}
        </div>
        <button className="user-modal-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default UserModal;