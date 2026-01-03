import React, { useState, useEffect } from "react";
import "./UserModal.css";
import { useTelegram } from "../../../../context/TelegramContext";

const UserModal = ({ onClose }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const { user, apiUser, loading: telegramLoading } = useTelegram();

  // Profile rasmi: Telegramdan yoki contextdan (apiUser.profile)
  const profilePhotoUrl = user?.photo_url || apiUser?.profile || null;

  // Balance uchun alohida state
  const [balance, setBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(true);

  // Balance ni har safar modal ochilganda yangi fetch qilamiz
  useEffect(() => {
    if (!user?.id) {
      setBalanceLoading(false);
      return;
    }

    setBalanceLoading(true);

    const userId = user.id;
    const fetchUrl = `https://m4746.myxvest.ru/webapp/get_user.php?user_id=${userId}`;

    console.log("Balance yangi fetch qilinmoqda:", fetchUrl);

    fetch(fetchUrl)
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((response) => {
        console.log("PHP javobi (UserModal):", response);

        // Balance ni to'g'ri olish
        if (response.ok && response.data) {
          const userBalance = response.data.balance;
          console.log("Olingan balance:", userBalance);
          setBalance(userBalance || "0");
        } else {
          console.warn("Javobda balance yo'q yoki ok: false", response);
          setBalance("0");
        }
      })
      .catch((err) => {
        console.error("Balance fetch xatolik:", err);
        setBalance("0");
      })
      .finally(() => {
        setBalanceLoading(false);
      });
  }, [user?.id]); // user.id o'zgarganda (modal ochilganda) fetch

  // 📜 Demo history (hozircha demo, keyin API dan olishingiz mumkin)
  const historyData = [
    { id: 1, type: "Transfer", amount: "+250 000", date: "06.12.2025", details: "Sent to account XYZ" },
    { id: 2, type: "Deposit", amount: "+500 000", date: "05.12.2025", details: "Received from Bank" },
    { id: 3, type: "Purchase", amount: "-120 000", date: "04.12.2025", details: "Bought premium stars" },
  ];

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Balance ni formatlash (masalan: 259000 → "259 000")
  const formatBalance = (bal) => {
    if (!bal || bal === "0") return "0";
    return bal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
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
              <p>{user?.username || "Username yo'q"}</p>
              <small>ID: {user?.id || "Noma'lum"}</small>
              <div style={{ marginTop: "8px", fontWeight: "bold", fontSize: "18px", color: "#4CAF50" }}>
                💰 Balance: {balanceLoading ? "Yuklanmoqda..." : `${formatBalance(balance)} UZS`}
              </div>
            </div>
          </div>
        </div>

        {/* BODY - HISTORY */}
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