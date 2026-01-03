import React, { useEffect, useState } from "react";

const TelegramUserIdComponent = () => {
  const [userId, setUserId] = useState("Loading...");

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      tg.expand();

      const tgUser = tg.initDataUnsafe?.user;

      if (tgUser?.id) {
        setUserId(tgUser.id);
      } else {
        setUserId("User data not available");
      }
    } else {
      // Local development (browser)
      setUserId("Not in Telegram (local test)");
    }
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h2>Telegram User ID</h2>
      <p><strong>{userId}</strong></p>
    </div>
  );
};

export default TelegramUserIdComponent;
