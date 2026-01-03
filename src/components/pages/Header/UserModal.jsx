import React, { useState, useEffect } from "react";
import "./UserModal.css";
import { useTelegram } from "../../../../context/TelegramContext";

const UserModal = ({ onClose }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const { user, apiUser, loading: telegramLoading, refreshUser } = useTelegram();

  // Profile rasmi
  const profilePhotoUrl = user?.photo_url || apiUser?.profile || null;

  // Balance uchun alohida state
  const [balance, setBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Balance ni modal ochilganda fetch qilish
  useEffect(() => {
    console.log("🚀 UserModal useEffect started");
    console.log("📋 user:", user);
    console.log("📋 apiUser:", apiUser);

    if (!user?.id) {
      console.warn("⚠️ user.id yo'q!");
      setBalanceLoading(false);
      setBalance("0");
      return;
    }

    setBalanceLoading(true);
    setFetchError(null);

    // 🔥 MUHIM: DEV mode bo'lsa real Telegram ID ishlatamiz
    const actualUserId = user.isTelegram === false 
      ? "7887859754"  // Real Telegram ID
      : user.id;

    const fetchUrl = `https://m4746.myxvest.ru/webapp/get_user.php?user_id=${actualUserId}`;

    console.log("📡 Fetch URL:", fetchUrl);
    console.log("🆔 User ID:", actualUserId);
    console.log("🌐 Is Telegram:", user.isTelegram);

    // Fetch with better error handling
    fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors', // CORS explicit
    })
      .then((res) => {
        console.log("📥 Response:", {
          status: res.status,
          statusText: res.statusText,
          ok: res.ok,
          headers: Array.from(res.headers.entries())
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.text(); // First get as text
      })
      .then((text) => {
        console.log("📄 Raw Response Text:", text);
        
        try {
          const response = JSON.parse(text);
          console.log("✅ Parsed JSON:", response);

          if (response.ok && response.data && response.data.balance !== undefined) {
            const userBalance = response.data.balance;
            console.log("💰 Balance found:", userBalance, typeof userBalance);
            setBalance(userBalance);
            setFetchError(null);
          } else {
            console.warn("⚠️ Invalid response structure");
            setFetchError("Invalid response");
            setBalance("0");
          }
        } catch (parseError) {
          console.error("❌ JSON Parse Error:", parseError);
          console.error("Raw text was:", text);
          setFetchError("JSON parse error");
          setBalance("0");
        }
      })
      .catch((err) => {
        console.error("❌ Fetch Error:", err);
        console.error("❌ Error name:", err.name);
        console.error("❌ Error message:", err.message);
        
        // More specific error messages
        if (err.message === "Failed to fetch") {
          setFetchError("CORS yoki network xatosi");
        } else {
          setFetchError(err.message);
        }
        
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

  // Manual refresh function
  const handleRefresh = () => {
    console.log("🔄 Manual refresh triggered");
    if (refreshUser) {
      refreshUser();
    }
    // Re-trigger useEffect by clearing balance
    setBalance(null);
    setBalanceLoading(true);
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
                backgroundColor: fetchError ? "#ffebee" : "#fff3cd",
                border: `1px solid ${fetchError ? "#f44336" : "#ffc107"}`,
                borderRadius: "4px",
                fontSize: "11px",
                fontFamily: "monospace"
              }}>
                <div><strong>🔍 DEBUG INFO:</strong></div>
                <div>• Loading: {balanceLoading ? "⏳" : "✅"}</div>
                <div>• Balance: {balance === null ? "null" : `"${balance}"`}</div>
                <div>• Type: {balance === null ? "-" : typeof balance}</div>
                <div>• User ID: {user?.id}</div>
                <div>• Telegram: {user?.isTelegram ? "Yes ✅" : "No (DEV) 🔧"}</div>
                <div>• API Balance: {apiUser?.balance || "N/A"}</div>
                {fetchError && (
                  <div style={{color: "#d32f2f", fontWeight: "bold", marginTop: "4px"}}>
                    ⚠️ {fetchError}
                  </div>
                )}
              </div>

              {/* BALANCE DISPLAY */}
              <div style={{ 
                marginTop: "12px", 
                fontWeight: "bold", 
                fontSize: "20px", 
                color: fetchError ? "#f44336" : (balance && balance !== "0" ? "#4CAF50" : "#666"),
                padding: "12px",
                backgroundColor: fetchError ? "#ffebee" : (balance && balance !== "0" ? "#e8f5e9" : "#f5f5f5"),
                borderRadius: "8px",
                textAlign: "center",
                border: fetchError ? "2px solid #f44336" : "none"
              }}>
                💰 Balance: {
                  balanceLoading 
                    ? "⏳ Yuklanmoqda..." 
                    : fetchError
                      ? "❌ Xato"
                      : balance !== null 
                        ? `${formatBalance(balance)} UZS` 
                        : "⚠️ Ma'lumot yo'q"
                }
              </div>

              {/* REFRESH BUTTON */}
              {fetchError && (
                <button 
                  onClick={handleRefresh}
                  style={{
                    marginTop: "8px",
                    width: "100%",
                    padding: "8px",
                    backgroundColor: "#2196F3",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                >
                  🔄 Qayta urinish
                </button>
              )}

              {/* WORKAROUND: Agar fetch ishlamasa, Context dan ko'rsat */}
              {fetchError && apiUser?.balance && (
                <div style={{
                  marginTop: "8px",
                  padding: "8px",
                  backgroundColor: "#e3f2fd",
                  borderRadius: "4px",
                  fontSize: "12px"
                }}>
                  ℹ️ Context balance: <strong>{formatBalance(apiUser.balance)} UZS</strong>
                </div>
              )}
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