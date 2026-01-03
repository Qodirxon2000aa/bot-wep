import React, { useEffect, useState } from "react";
import "./UserModal.css";
import { useTelegram } from "../../../../context/TelegramContext";

const UserModal = ({ onClose }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [balance, setBalance] = useState("0");

  // 🔥 Telegram user global context'dan (photo_url bilan)
  const { user, apiUser } = useTelegram();

  // Profil rasmi: Birinchi Telegram photo_url, fallback sifatida apiUser.profile
  const profilePhotoUrl = user?.photo_url || apiUser?.profile || null;

  // 🔄 API dan user ma'lumotlarini olish (balance uchun)
  useEffect(() => {
    if (!user?.id) return;
    fetch(`https://m4746.myxvest.ru/webapp/get_user.php?user_id=${user.id}`)
      .then((res) => res.json())
      .then((response) => {
        console.log("API RESPONSE:", response);
        if (response.ok && response.data) {
          if (response.data.balance !== undefined) {
            setBalance(response.data.balance);
          }
        }
      })
      .catch((err) => {
        console.error("User data olishda xato:", err);
      });
  }, [user?.id]);

  // 📜 Demo history
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
        {/* HEADER */}
        <div className="user-modal-header">
          <div className="user-modal-profile">
            <div className="user-modal-avatar">
              {profilePhotoUrl ? (
                <img
                  src={profilePhotoUrl}
                  alt="profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div className="avatar-placeholder"></div>
              )}
            </div>
            <div className="user-modal-info">
              <h3>{user?.first_name} {user?.last_name}</h3>
              <p>{user?.username}</p>
              <small>ID: {user?.id || "Yuklanmoqda..."}</small>
              <div style={{ marginTop: "6px", fontWeight: "bold" }}>
                💰 Balance: {balance} UZS
              </div>
            </div>
          </div>
        </div>
        {/* BODY */}
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