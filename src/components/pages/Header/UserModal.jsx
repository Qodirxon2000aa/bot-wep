import React, { useState, useEffect } from "react";
import "./UserModal.css";
import { useTelegram } from "../../../../context/TelegramContext";

const UserModal = ({ onClose }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const { user, apiUser, loading: telegramLoading } = useTelegram();

  // Profile rasmi
  const profilePhotoUrl = user?.photo_url || apiUser?.profile || null;

  // Balance uchun alohida state
  const [balance, setBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Balance ni modal ochilganda fetch qilish
  useEffect(() => {
    console.log("🚀 UserModal useEffect started");
    console.log("📋 user object:", JSON.stringify(user, null, 2));
    console.log("📋 user.id:", user?.id);
    console.log("📋 user.isTelegram:", user?.isTelegram);

    if (!user?.id) {
      console.warn("⚠️ user.id yo'q!");
      setBalanceLoading(false);
      setBalance("0");
      return;
    }

    setBalanceLoading(true);
    setFetchError(null);

    const userId = user.id;
    
    // ❗ MUHIM: Agar DEV mode bo'lsa, real Telegram ID ishlatish
    const actualUserId = user.isTelegram === false 
      ? "7887859754"  // 🔥 Bu sizning real Telegram ID'ingiz (PHP da mavjud)
      : userId;

    const fetchUrl = `https://m4746.myxvest.ru/webapp/get_user.php?user_id=${actualUserId}`;

    console.log("📡 Fetch URL:", fetchUrl);
    console.log("🆔 Actual User ID:", actualUserId);

    fetch(fetchUrl)
      .then((res) => {
        console.log("📥 HTTP Status:", res.status, res.statusText);
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then((response) => {
        console.log("✅ Full PHP Response:", JSON.stringify(response, null, 2));

        if (response.ok && response.data) {
          console.log("✅ response.ok = true");
          console.log("💾 response.data:", response.data);
          console.log("💰 response.data.balance:", response.data.balance);
          console.log("💰 typeof balance:", typeof response.data.balance);

          const userBalance = response.data.balance;
          
          if (userBalance !== undefined && userBalance !== null) {
            console.log("✅ Balance set qilindi:", userBalance);
            setBalance(userBalance);
          } else {
            console.warn("⚠️ Balance undefined/null, 0 qo'yildi");
            setBalance("0");
          }
        } else {
          console.warn("⚠️ response.ok !== true yoki data yo'q");
          console.log("Response:", response);
          setFetchError("Server javobida xatolik");
          setBalance("0");
        }
      })
      .catch((err) => {
        console.error("❌ Fetch Error:", err);
        console.error("❌ Error message:", err.message);
        console.error("❌ Error stack:", err.stack);
        setFetchError(err.message);
        setBalance("0");
      })
      .finally(() => {
        console.log("🏁 Fetch completed");
        setBalanceLoading(false);
      });
  }, [user?.id, user?.isTelegram]);

  // Balance ni formatlash
  const formatBalance = (bal) => {
    if (!bal || bal === "0") return "0";
    const balStr = bal.toString();
    return balStr.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
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

  console.log("🎨 Final Render State:");
  console.log("   balance:", balance);
  console.log("   balanceLoading:", balanceLoading);
  console.log("   fetchError:", fetchError);

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
                marginTop: "8px", 
                padding: "8px", 
                backgroundColor: "#fff3cd",
                border: "1px solid #ffc107",
                borderRadius: "4px",
                fontSize: "11px",
                fontFamily: "monospace"
              }}>
                <div><strong>DEBUG:</strong></div>
                <div>• Loading: {balanceLoading ? "⏳ true" : "✅ false"}</div>
                <div>• State: {balance === null ? "null" : `"${balance}"`}</div>
                <div>• Type: {balance === null ? "null" : typeof balance}</div>
                <div>• Context: {apiUser?.balance || "N/A"}</div>
                <div>• User ID: {user?.id}</div>
                <div>• Is Telegram: {user?.isTelegram ? "Yes" : "No"}</div>
                {fetchError && <div style={{color: "red"}}>• Error: {fetchError}</div>}
              </div>

              {/* BALANCE DISPLAY */}
              <div style={{ 
                marginTop: "12px", 
                fontWeight: "bold", 
                fontSize: "20px", 
                color: balance && balance !== "0" ? "#4CAF50" : "#666",
                padding: "12px",
                backgroundColor: balance && balance !== "0" ? "#e8f5e9" : "#f5f5f5",
                borderRadius: "8px",
                textAlign: "center"
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