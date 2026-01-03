import React, { useState } from "react";
import "./UserModal.css";
import { useTelegram } from "../../../../context/TelegramContext";

const UserModal = ({ onClose }) => {
  const [expandedRow, setExpandedRow] = useState(null);

  const { user, apiUser, loading } = useTelegram();

  const profilePhotoUrl = user?.photo_url || apiUser?.profile || null;

  const displayBalance = loading 
    ? "Yuklanmoqda..." 
    : (apiUser?.balance ?? "0");  // ?? null/undefined uchun "0"

  return (
    <div className="user-modal-overlay" onClick={onClose}>
      <div className="user-modal" onClick={(e) => e.stopPropagation()}>
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
                    e.target.nextElementSibling && (e.target.nextElementSibling.style.display = "block");
                  }}
                />
              ) : null}
              {!profilePhotoUrl && <div className="avatar-placeholder"></div>}
            </div>

            <div className="user-modal-info">
              <h3>{user?.first_name || ""} {user?.last_name || ""}</h3>
              <p>{user?.username || "Username yo‘q"}</p>
              <small>ID: {user?.id || "Noma'lum"}</small>
              <div style={{ marginTop: "8px", fontWeight: "bold", fontSize: "18px" }}>
                💰 Balance: {displayBalance} UZS
              </div>
            </div>
          </div>
        </div>

        {/* HISTORY qismi o‘zgarmaydi */}
        <div className="user-modal-body">
          <h2 className="user-modal-title">HISTORY</h2>
          {/* ... qolgan history kod */}
        </div>

        <button className="user-modal-close" onClick={onClose}>×</button>
      </div>
    </div>
  );
};

export default UserModal;