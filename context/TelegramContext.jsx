import { createContext, useContext, useEffect, useState } from "react";

const TelegramContext = createContext(null);

export const TelegramProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Telegram user with photo_url
  const [apiUser, setApiUser] = useState(null); // PHP dan kelgan data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    // =========================
    // 🟢 TELEGRAM MODE
    // =========================
    if (tg) {
      tg.ready();
      const waitForUser = setInterval(() => {
        const tgUser = tg.initDataUnsafe?.user;
        if (tgUser?.id) {
          clearInterval(waitForUser);
          const baseUser = {
            id: tgUser.id,
            first_name: tgUser.first_name || "",
            last_name: tgUser.last_name || "",
            username: tgUser.username ? `@${tgUser.username}` : "",
            isTelegram: true,
            photo_url: tgUser.photo_url || null, // 🔥 Telegramdan profil rasmi URL
          };
          setUser(baseUser);
          // 🔥 TO‘G‘RI PHP API (HTTPS)
          fetch(
            `https://m4746.myxvest.ru/webapp/get_user.php?user_id=${tgUser.id}`
          )
            .then((res) => res.json())
            .then((response) => {
              console.log("PHP RESPONSE:", response);
              if (response.ok && response.data) {
                setApiUser(response.data);
              }
            })
            .catch((err) => {
              console.error("PHP API xato:", err);
            })
            .finally(() => setLoading(false));
        }
      }, 300);
      // 5 sekunddan keyin majburan to‘xtaydi
      setTimeout(() => {
        clearInterval(waitForUser);
        setLoading(false);
      }, 5000);
      return;
    }

    // =========================
    // 🟡 CHROME / DEV MODE
    // =========================
    console.warn("DEV MODE: Telegram yo‘q");
    const devId = "DEV_123456";
    setUser({
      id: devId,
      first_name: "Dev",
      last_name: "User",
      username: "@dev_user",
      isTelegram: false,
      photo_url: null, // Dev modda rasm yo‘q
    });
    fetch(
      `https://m4746.myxvest.ru/webapp/get_user.php?user_id=${devId}`
    )
      .then((res) => res.json())
      .then((response) => {
        if (response.ok && response.data) {
          setApiUser(response.data);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <TelegramContext.Provider
      value={{
        user, // telegram info including photo_url
        apiUser, // profile, balance, status, action
        loading,
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => useContext(TelegramContext);