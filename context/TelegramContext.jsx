import { createContext, useContext, useEffect, useState } from "react";

const TelegramContext = createContext(null);

export const TelegramProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [apiUser, setApiUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserFromApi = async (userId, isTelegram = true) => {
    try {
      setLoading(true);

      // 🔥 DEV mode bo'lsa real Telegram ID ishlatamiz
      const actualUserId = !isTelegram 
        ? "7887859754"  // Real Telegram ID
        : userId;

      const fetchUrl = `https://m4746.myxvest.ru/webapp/get_user.php?user_id=${actualUserId}`;
      
      console.log("🌐 TelegramContext fetch:", fetchUrl);
      console.log("🆔 Actual User ID:", actualUserId);
      console.log("📱 Is Telegram:", isTelegram);

      const res = await fetch(fetchUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
      });

      console.log("📥 Response status:", res.status, res.ok);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const text = await res.text();
      console.log("📄 Raw response:", text);

      const response = JSON.parse(text);
      console.log("✅ Parsed JSON:", response);

      if (response.ok && response.data) {
        console.log("💰 Balance from API:", response.data.balance);
        setApiUser(response.data);
      } else {
        console.warn("⚠️ Invalid response structure");
        setApiUser({ balance: "0", profile: null });
      }
    } catch (err) {
      console.error("❌ API error:", err);
      console.error("❌ Error message:", err.message);
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

          console.log("✅ Telegram user topildi:", baseUser);
          setUser(baseUser);
          fetchUserFromApi(tgUser.id, true);
        }
      }, 300);

      // 🔥 3 sekundda Telegram user kelmasa → DEV MODE
      timeout = setTimeout(() => {
        clearInterval(interval);

        console.warn("⚠️ Telegram user topilmadi → DEV MODE");

        const devUser = {
          id: "DEV_123456",
          first_name: "Dev",
          last_name: "User",
          username: "@dev_user",
          isTelegram: false,
          photo_url: null,
        };

        setUser(devUser);
        fetchUserFromApi(devUser.id, false); // ✅ isTelegram: false
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }

    // ===== TELEGRAM YO'Q BO'LSA (Browser test) =====
    console.warn("⚠️ Telegram.WebApp mavjud emas → DEV MODE");

    const devUser = {
      id: "DEV_123456",
      first_name: "Dev",
      last_name: "User",
      username: "@dev_user",
      isTelegram: false,
      photo_url: null,
    };

    setUser(devUser);
    fetchUserFromApi(devUser.id, false); // ✅ isTelegram: false
  }, []);

  return (
    <TelegramContext.Provider
      value={{
        user,
        apiUser,
        loading,
        refreshUser: () => user?.id && fetchUserFromApi(user.id, user.isTelegram),
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => useContext(TelegramContext);