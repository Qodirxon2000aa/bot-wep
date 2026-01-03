import React, { useState, useEffect } from "react";
import "./UserModal.css";
import { useTelegram } from "../../../../context/TelegramContext";

const UserModal = ({ onClose }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const { user, apiUser, loading: telegramLoading } = useTelegram();

  console.log("🔍 UserModal render:");
  console.log("  - user:", user);
  console.log("  - apiUser:", apiUser);
  console.log("  - apiUser.balance:", apiUser?.balance);

  // Profile rasmi
  const profilePhotoUrl = user?.photo_url || apiUser?.profile || null;

  // Balance uchun alohida state
  const [balance, setBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(true);

  // Balance ni modal ochilganda fetch qilish
  useEffect(() => {
    console.log("🚀 useEffect ishladi, user.id:", user?.id);

    if (!user?.id) {
      console.warn("⚠️ user.id yo'q!");
      setBalanceLoading(false);
      setBalance("0");
      return;
    }

    setBalanceLoading(true);

    const userId = user.id;
    const fetchUrl = `https://m4746.myxvest.ru/webapp/get_user.php?user_id=${userId}`;

    console.log("📡 Fetch qilinmoqda:", fetchUrl);

    fetch(fetchUrl)
      .then((res) => {
        console.log("📥 Response status:", res.status, res.ok);
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((response) => {
        console.log("✅ PHP javobi:", response);
        console.log("   - response.ok:", response.ok);
        console.log("   - response.data:", response.data);
        console.log("   - response.data.balance:", response.data?.balance);

        if (response.ok && response.data && response.data.balance !== undefined) {
          const userBalance = response.data.balance;
          console.log("💰 Balance set qilinmoqda:", userBalance);
          setBalance(userBalance);
        } else {
          console.warn("⚠️ Balance topilmadi, 0 qo'yildi");
          setBalance("0");
        }
      })
      .catch((err) => {
        console.error("❌ Fetch xatolik:", err);
        setBalance("0");
      })
      .finally(() => {
        console.log("🏁 Fetch tugadi, balanceLoading = false");
        setBalanceLoading(false);
      });
  }, [user?.id]);

  // Balance ni formatlash
  const formatBalance = (bal) => {
    if (!bal || bal === "0") return "0";
    return bal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  // Demo history
  const historyData = [
    { id: 1, type: "Transfer", amount: "+250 000", date: "06.12.2025", details: "Sent to account XYZ" },
    { id: 2, type: "Deposit", amount: "+500 000", date: "05.12.2025", details: "Received from Bank" },
    { id: 3, type: "Purchase", amount: "-120 000", date: "04.12.2025", details: "Bought premium stars" },
  ];

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  console.log("🎨 Render qilinmoqda:");
  console.log("   - balance state:", balance);
  console.log("   - balanceLoading:", balanceLoading);
  console.log("   - formatBalance(balance):", formatBalance(balance));

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
                  }}
                />
              ) : (
                <div className="avatar-placeholder"></div>
              )}
            </div>
            <div className="user-modal-info">
              <h3>{user?.first_name || ""} {user?.last_name || ""}</h3>
              <p>{user?.username || "Username yo'q"}</p>
              <small>ID: {user?.id || "Noma'lum"}</small>
              
              {/* DEBUG INFO */}
              <div style={{ 
                marginTop: "12px", 
                padding: "8px", 
                backgroundColor: "#f0f0f0",
                borderRadius: "4px",
                fontSize: "12px"
              }}>
                <div>balanceLoading: {balanceLoading ? "true" : "false"}</div>
                <div>balance state: {balance === null ? "null" : balance}</div>
                <div>apiUser.balance: {apiUser?.balance || "yo'q"}</div>
              </div>

              {/* BALANCE KO'RSATISH */}
              <div style={{ 
                marginTop: "8px", 
                fontWeight: "bold", 
                fontSize: "18px", 
                color: "#4CAF50",
                padding: "8px",
                backgroundColor: "#e8f5e9",
                borderRadius: "4px"
              }}>
                💰 Balance: {
                  balanceLoading 
                    ? "⏳ Yuklanmoqda..." 
                    : balance !== null 
                      ? `${formatBalance(balance)} UZS` 
                      : "❌ Xato"
                }
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