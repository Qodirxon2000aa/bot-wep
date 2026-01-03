// Header.jsx
import React, { useState } from "react";
import "./Header.css";

import UserModal from "./UserModal.jsx"; // 🔥 Yangi modal component

const Header = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
              <img
                src="https://freesvg.org/img/abstract-user-flat-4.png"
                alt="user"
              />
            </div>
          </div>

          <div className="money">
            0.00 UZS
            <span className="plus">+</span>
          </div>
        </div>
      </header>

      {/* MODAL COMPONENT */}
      {isModalOpen && (
        <UserModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
};

export default Header;
