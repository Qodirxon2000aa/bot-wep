import { createContext, useContext, useEffect, useState } from "react";

const TelegramContext = createContext(null);

export const TelegramProvider = ({ children }) => {
  const [telegram, setTelegram] = useState(null);
  const [user, setUser] = useState(null);
  const [apiUser, setApiUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    // =========================
    // 🟢 TELEGRAM MODE
    // =========================
    if (tg) {
      tg.ready();
     

      setTelegram(tg);

      const tgUser = tg.initDataUnsafe?.user;

      if (tgUser?.id) {
        const baseUser = {
          id: tgUser.id,
          first_name: tgUser.first_name || "",
          last_name: tgUser.last_name || "",
          username: tgUser.username ? `@${tgUser.username}` : "",
          isTelegram: true,
        };

        setUser(baseUser);

        // 🔥 PHP API SO‘ROV SHU YERDA
        fetch(`http://multinet.uz/webapp/get_user.php?user_id=${tgUser.id}`)
          .then((res) => res.json())
          .then((response) => {
            console.log("API RESPONSE (context):", response);

            if (response.ok && response.data) {
              setApiUser(response.data);
            }
          })
          .catch((err) => {
            console.error("API xato:", err);
          })
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }

      return;
    }

    // =========================
    // 🟡 CHROME / DEV MODE
    // =========================
    console.warn("DEV MODE (Telegram yo‘q)");

    const devUser = {
      id: "DEV_123456",
      first_name: "Dev",
      last_name: "User",
      username: "@dev_user",
      isTelegram: false,
    };

    setUser(devUser);

    // 🔧 DEV MODE UCHUN API
    fetch(`http://multinet.uz/webapp/get_user.php?user_id=${devUser.id}`)
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
        telegram,
        user,
        apiUser,   // 👈 profile, balance, status shu yerda
        loading,
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => useContext(TelegramContext);
