// Header.jsx (yangilangan versiya)
import React, { useState } from "react";
import "./Header.css";
import { useTelegram } from "../../../../context/TelegramContext.jsx";
import UserModal from "./UserModal.jsx";
import Money from "../../pages/Money/Money.jsx"; // Yo'lni loyihangizga moslashtiring

const Header = () => {
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isMoneyModalOpen, setIsMoneyModalOpen] = useState(false);

  const { user, apiUser, loading } = useTelegram();

  const profilePhotoUrl =
    user?.photo_url ||
    apiUser?.profile ||
    "https://freesvg.org/img/abstract-user-flat-4.png";

  const balance = loading ? "..." : apiUser?.balance || "0";

  return (
    <>
      <header className="header">
        <div className="balance">
          <div
            className="profile-icon"
            onClick={() => setIsUserModalOpen(true)}
            style={{ cursor: "pointer" }}
          >
            <div className="icon-placeholder">
              <img src={profilePhotoUrl} alt="user" />
            </div>
          </div>
          <div className="money">
            {balance}
            <span
              className="plus"
              onClick={(e) => {
                e.stopPropagation();
                setIsMoneyModalOpen(true);
              }}
            >
              +
            </span>
          </div>
        </div>
      </header>

      {/* User Modal */}
      {isUserModalOpen && (
        <UserModal onClose={() => setIsUserModalOpen(false)} />
      )}

      {/* Money Modal */}
      {isMoneyModalOpen && (
        <Money onClose={() => setIsMoneyModalOpen(false)} />
      )}
    </>
  );
};

export default Header;