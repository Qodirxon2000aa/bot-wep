// UserModal.jsx (yangilangan: faqat balance alohida fetch, profile va boshqalar contextdan)
import React, { useState, useEffect } from "react";
import "./UserModal.css";
import { useTelegram } from "../../../../context/TelegramContext";

const UserModal = ({ onClose }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const { user, apiUser, loading: telegramLoading } = useTelegram();
  
  // Profile rasmi: Telegram photo_url yoki API dan (contextdan)
  const profilePhotoUrl = user?.photo_url || apiUser?.profile || null;
  
  // Balance: alohida fetch (agar API da bo'lmasa yoki yangilash kerak bo'lsa)
  const [balance, setBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  useEffect(() => {
    // Agar contextda apiUser bor va balance mavjud bo'lsa, fetch qilmaymiz
    if (apiUser && apiUser.balance !== undefined) {
      setBalance(apiUser.balance);
      return;
    }

    // Aks holda, alohida fetch qilamiz
    if (!user?.id) return;

    setBalanceLoading(true);
    const userId = user.id;
    const fetchUrl = `https://m4746.myxvest.ru/webapp/get_user.php?user_id=${userId}`;

    console.log("Balance fetch boshlandi (contextda yo'q edi):", fetchUrl);

    fetch(fetchUrl)
      .then((res) => res.json())
      .then((response) => {
        console.log("Balance PHP RESPONSE:", response);
        if (response.ok && response.data && response.data.balance !== undefined) {
          setBalance(response.data.balance);
        } else {
          console.warn("Balance response not ok:", response);
          setBalance("0");
        }
      })
      .catch((err) => {
        console.error("Balance fetch error:", err);
        setBalance("0");
      })
      .finally(() => setBalanceLoading(false));
  }, [user?.id, apiUser]); // apiUser o'zgarganda ham tekshiradi

  // Balance ni tanlash: fetch dan yoki contextdan
  const displayBalance = balance !== null ? balance : apiUser?.balance;

  // Umumiy loading
  const loading = telegramLoading || balanceLoading;

  // 📜 Demo history (o'zgarmadi)
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
                💰 Balance: {loading ? "Yuklanmoqda..." : (displayBalance !== undefined ? `${displayBalance} UZS` : "0 UZS")}
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