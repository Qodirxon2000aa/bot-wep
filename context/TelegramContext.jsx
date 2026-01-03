import { createContext, useContext, useEffect, useState } from "react";

const TelegramContext = createContext(null);

export const TelegramProvider = ({ children }) => {
  const [telegram, setTelegram] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (!tg) {
      console.warn("Telegram WebApp mavjud emas");
      return;
    }



    setTelegram(tg);

    const tgUser = tg.initDataUnsafe?.user;

    if (tgUser) {
      setUser({
        id: tgUser.id,
        first_name: tgUser.first_name || "",
        last_name: tgUser.last_name || "",
        username: tgUser.username ? `@${tgUser.username}` : "",
      });

      console.log("Telegram user global:", tgUser);
    }
  }, []);

  return (
    <TelegramContext.Provider value={{ telegram, user }}>
      {children}
    </TelegramContext.Provider>
  );
};

// Custom hook
export const useTelegram = () => useContext(TelegramContext);
