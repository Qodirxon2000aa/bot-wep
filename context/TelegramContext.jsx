import { createContext, useContext, useEffect, useState } from "react";

const TelegramContext = createContext(null);

export const TelegramProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [apiUser, setApiUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserFromApi = async (userId, isTelegram = true) => {
    try {
      setLoading(true);
      const actualUserId = !isTelegram ? "7887859754" : userId;
      const fetchUrl = `https://m4746.myxvest.ru/webapp/get_user.php?user_id=${actualUserId}`;

      console.log("=== API Fetch Start ===", { fetchUrl, actualUserId });

      const res = await fetch(fetchUrl, {
        method: "GET",
        headers: { "Accept": "application/json" },
        mode: "cors",
        cache: "no-cache",
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const response = await res.json();

      if (response.ok && response.data) {
        // Orders ni saqlash
        if (response.orders) {
          setOrders(response.orders);
          console.log("📦 Orders count:", response.orders.length);
        }

        const userData = {
          balance: response.data.balance || "0",
          profile: response.data.profile || null,
          ...response.data,
        };

        setApiUser(userData);
        return userData;
      } else {
        console.warn("⚠️ Invalid response structure");
      }
    } catch (err) {
      console.error("❌ Fetch Error:", err.message);
      if (err.message.includes("Failed to fetch")) {
        console.error("🚫 CORS xatoligi ehtimoli yuqori!");
      }
    } finally {
      setLoading(false);
      console.log("=== API Fetch End ===");
    }

    // Fallback
    const fallback = { balance: "0", profile: null };
    setApiUser(fallback);
    return fallback;
  };

  const refreshUser = async () => {
    if (user?.id) {
      await fetchUserFromApi(user.id, user.isTelegram);
    }
  };

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    const initTelegram = () => {
      tg?.ready();
      try { tg?.expand(); } catch (e) {}

      let interval, timeout;

      interval = setInterval(() => {
        const tgUser = tg?.initDataUnsafe?.user;
        if (tgUser?.id) {
          clearInterval(interval);
          clearTimeout(timeout);

          const baseUser = {
            id: tgUser.id,
            first_name: tgUser.first_name || "",
            last_name: tgUser.last_name || "",
            username: tgUser.username ? `@${tgUser.username}` : "",
            language_code: tgUser.language_code || "en",
            isTelegram: true,
            photo_url: tgUser.photo_url || null,
          };

          setUser(baseUser);
          fetchUserFromApi(tgUser.id, true);
        }
      }, 300);

      // DEV MODE timeout
      timeout = setTimeout(() => {
        clearInterval(interval);
        console.warn("⚠️ DEV MODE aktiv");
        const devUser = {
          id: "DEV_123456",
          first_name: "Dev",
          last_name: "User",
          username: "@dev_user",
          language_code: "uz",
          isTelegram: false,
          photo_url: null,
        };
        setUser(devUser);
        fetchUserFromApi(devUser.id, false);
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    };

    if (tg) {
      initTelegram();
    } else {
      // Browserda to'g'ridan-to'g'ri DEV mode
      console.warn("⚠️ Browser mode");
      const devUser = {
        id: "DEV_123456",
        first_name: "Dev",
        last_name: "User",
        username: "@dev_user",
        language_code: "uz",
        isTelegram: false,
        photo_url: null,
      };
      setUser(devUser);
      fetchUserFromApi(devUser.id, false);
    }
  }, []);

  return (
    <TelegramContext.Provider
      value={{
        user,
        apiUser,
        orders,
        loading,
        refreshUser,
        tg: window.Telegram?.WebApp,
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error("useTelegram must be used within TelegramProvider");
  }
  return context;
};