import React, { useEffect } from "react";

const Dashboard = () => {
  useEffect(() => {
    if (!window.Telegram || !window.Telegram.WebApp) {
      alert("Telegram WebApp emas!");
      return;
    }

    const tg = window.Telegram.WebApp;
    tg.expand();

    // ⚠️ ENG MUHIM QATOR (senda ishlagan joy)
    const user = tg.initDataUnsafe?.user;

    if (!user || !user.id) {
      alert("Telegram user aniqlanmadi!");
      return;
    }

    const user_id = user.id;

    // ✅ AUTOMATIC ALERT
    alert(
      "Telegram foydalanuvchi topildi ✅\n\n" +
      "ID: " + user_id + "\n" +
      "Name: " + user.first_name + "\n" +
      "Username: @" + (user.username || "yo‘q")
    );

    // (ixtiyoriy) backendga so‘rov
    fetch(`get_user.php?user_id=${user_id}`)
      .then(r => r.json())
      .then(d => {
        console.log("Balance:", d.balance);
      });

  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Telegram WebApp active</p>
    </div>
  );
};

export default Dashboard;
