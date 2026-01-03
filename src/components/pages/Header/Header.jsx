// Header.jsx
import React, { useState } from "react";
import "./Header.css";

import { useTelegram } from "../../../context/TelegramContext.jsx";
import UserModal from "./UserModal.jsx";

const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ HOOK FAQAT COMPONENT ICHIDA
  const { user, apiUser, loading } = useTelegram();

  // ✅ PROFIL RASMI (Telegram → API → default)
  const profilePhotoUrl =
    user?.photo_url ||
    apiUser?.profile ||
    "https://freesvg.org/img/abstract-user-flat-4.png";

  // ✅ BALANCE
  const balance = loading ? "..." : apiUser?.balance || "0";

  return (
    <>
      <header className="header">
        <div className="balance">
          <div
            className="profile-icon"
            onClick={() => setIsModalOpen(true)}
            style={{ cursor: "pointer" }}
          >
            <div className="icon-placeholder">
              <img src={profilePhotoUrl} alt="user" />
            </div>
          </div>

          <div className="money">
            {balance} UZS
            <span className="plus">+</span>
          </div>
        </div>
      </header>

      {/* MODAL */}
      {isModalOpen && (
        <UserModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default Header;
