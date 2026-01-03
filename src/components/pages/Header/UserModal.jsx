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
    const tg = window.Telegram?.WebApp;

    if (tg) {
      tg.ready();        // WebApp ni tayyor deb belgilaydi
      tg.expand();       // To'liq ekran qiladi

      // User ma'lumotlarini olish
      const tgUser = tg.initDataUnsafe?.user;

      if (tgUser) {
        setUser({
          id: tgUser.id?.toString() || "Noma'lum",
          first_name: tgUser.first_name || "",
          last_name: tgUser.last_name || "",
          username: tgUser.username ? `@${tgUser.username}` : "Yo'q"
        });
        console.log("TG USER:", tgUser);
      } else {
        console.log("Telegram user topilmadi. Kuting...");
        // Agar darhol bo'lmasa, biroz kutib qayta urinib ko'rish
        const interval = setInterval(() => {
          const retryUser = tg.initDataUnsafe?.user;
          if (retryUser) {
            setUser({
              id: retryUser.id?.toString() || "Noma'lum",
              first_name: retryUser.first_name || "",
              last_name: retryUser.last_name || "",
              username: retryUser.username ? `@${retryUser.username}` : "Yo'q"
            });
            console.log("Retry muvaffaqiyatli:", retryUser);
            clearInterval(interval);
          }
        }, 500); // Har 0.5 sekunda tekshiradi

        // 10 sekunddan keyin to'xtatish
        setTimeout(() => clearInterval(interval), 10000);
      }
    } else {
      console.log("Telegram WebApp mavjud emas");
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