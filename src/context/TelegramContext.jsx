import { createContext, useContext, useEffect, useState } from "react";

const TelegramContext = createContext(null);

export const TelegramProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (tg?.initDataUnsafe?.user) {
      const tgUser = tg.initDataUnsafe.user;

      setUser({
        id: tgUser.id,
        first_name: tgUser.first_name || "",
        last_name: tgUser.last_name || "",
        username: tgUser.username ? `@${tgUser.username}` : "",
        photo_url: tgUser.photo_url || null,
        isTelegram: true,
      });
    } else {
      // DEV MODE
      setUser({
        id: "DEV_123456",
        first_name: "Dev",
        last_name: "User",
        username: "@dev_user",
        photo_url: null,
        isTelegram: false,
      });
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ user }}>
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => {
  const ctx = useContext(TelegramContext);
  if (!ctx) {
    throw new Error("useTelegram must be used inside TelegramProvider");
  }
  return ctx;
};
