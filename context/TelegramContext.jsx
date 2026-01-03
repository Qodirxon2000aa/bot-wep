import { createContext, useContext, useEffect, useState } from "react";

const TelegramContext = createContext(null);

export const TelegramProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [apiUser, setApiUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserFromApi = async (userId) => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://m4746.myxvest.ru/webapp/get_user.php?user_id=${userId}`
      );
      const response = await res.json();

      console.log("PHP RESPONSE:", response);

      if (response.ok && response.data) {
        setApiUser(response.data);
      } else {
        setApiUser({ balance: "0", profile: null });
      }
    } catch (err) {
      console.error("API error:", err);
      setApiUser({ balance: "0", profile: null });
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  const tg = window.Telegram?.WebApp;

  let interval;
  let timeout;

  if (tg) {
    tg.ready();

    interval = setInterval(() => {
      const tgUser = tg.initDataUnsafe?.user;

      if (tgUser?.id) {
        clearInterval(interval);
        clearTimeout(timeout);

        const baseUser = {
          id: tgUser.id,
          first_name: tgUser.first_name || "",
          last_name: tgUser.last_name || "",
          username: tgUser.username ? `@${tgUser.username}` : "",
          isTelegram: true,
          photo_url: tgUser.photo_url || null,
        };

        setUser(baseUser);
        fetchUserFromApi(tgUser.id);
      }
    }, 300);

    // 🔥 MUHIM: agar 3 sekundda Telegram user kelmasa → DEV MODE
    timeout = setTimeout(() => {
      clearInterval(interval);

      console.warn("Telegram user topilmadi → DEV MODE");

      const devUser = {
        id: "DEV_123456",
        first_name: "Dev",
        last_name: "User",
        username: "@dev_user",
        isTelegram: false,
        photo_url: null,
      };

      setUser(devUser);
      fetchUserFromApi(devUser.id);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }

  // ===== TELEGRAM YO‘Q BO‘LSA =====
  const devUser = {
    id: "DEV_123456",
    first_name: "Dev",
    last_name: "User",
    username: "@dev_user",
    isTelegram: false,
    photo_url: null,
  };

  setUser(devUser);
  fetchUserFromApi(devUser.id);
}, []);


  return (
    <TelegramContext.Provider
      value={{
        user,
        apiUser,
        loading,
        refreshUser: () => user?.id && fetchUserFromApi(user.id),
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => useContext(TelegramContext);
