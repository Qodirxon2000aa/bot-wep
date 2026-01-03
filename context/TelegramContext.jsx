import { createContext, useContext, useEffect, useState } from "react";

const TelegramContext = createContext(null);

export const TelegramProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // Telegram user
  const [apiUser, setApiUser] = useState(null); // PHP dan kelgan data (profile, balance, ...)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    let waitForUser = null;
    let timeoutId = null;

    // =========================
    // 🟢 TELEGRAM MODE
    // =========================
    if (tg) {
      tg.ready();

      waitForUser = setInterval(() => {
        const tgUser = tg.initDataUnsafe?.user;

        if (tgUser?.id) {
          clearInterval(waitForUser);
          clearTimeout(timeoutId);

          const baseUser = {
            id: tgUser.id,
            first_name: tgUser.first_name || "",
            last_name: tgUser.last_name || "",
            username: tgUser.username ? `@${tgUser.username}` : "",
            isTelegram: true,
          };

          setUser(baseUser);

          // 🔥 PHP API — PROFILE RASM SHU YERDA OLINADI
          fetch(
            `https://m4746.myxvest.ru/webapp/get_user.php?user_id=${tgUser.id}`,
            { cache: "no-store" }
          )
            .then((res) => res.json())
            .then((response) => {
              console.log("PHP RESPONSE (context):", response);

              if (response.ok && response.data) {
                setApiUser(response.data); // 👈 profile shu yerda
              } else {
                setApiUser(null);
              }
            })
            .catch((err) => {
              console.error("PHP API xato:", err);
              setApiUser(null);
            })
            .finally(() => setLoading(false));
        }
      }, 300);

      // ⏱ 5 sekund kutadi, keyin to‘xtaydi
      timeoutId = setTimeout(() => {
        clearInterval(waitForUser);
        setLoading(false);
      }, 5000);

      return () => {
        clearInterval(waitForUser);
        clearTimeout(timeoutId);
      };
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
    });

    fetch(
      `https://m4746.myxvest.ru/webapp/get_user.php?user_id=${devId}`,
      { cache: "no-store" }
    )
      .then((res) => res.json())
      .then((response) => {
        if (response.ok && response.data) {
          setApiUser(response.data);
        } else {
          setApiUser(null);
        }
      })
      .catch(() => setApiUser(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <TelegramContext.Provider
      value={{
        user,     // Telegram info
        apiUser,  // 👈 profile, balance, status, action
        loading,
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => useContext(TelegramContext);
