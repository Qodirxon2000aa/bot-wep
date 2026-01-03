import { createContext, useContext, useEffect, useState } from "react";

const TelegramContext = createContext(null);

export const TelegramProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [apiUser, setApiUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ API dan ma'lumot olish
  const fetchUserFromApi = async (userId, isTelegram = true) => {
    try {
      setLoading(true);
      // DEV mode uchun real ID
      const actualUserId = !isTelegram ? "7521806735" : userId;
      const fetchUrl = `https://m4746.myxvest.ru/webapp/get_user.php?user_id=${actualUserId}`;
     
      console.log("=== API Fetch Start ===");
      console.log("🌐 URL:", fetchUrl);
      console.log("🆔 User ID:", actualUserId);
      
      const res = await fetch(fetchUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
        cache: 'no-cache',
      });
      
      console.log("📥 Response:", res.status, res.ok);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      const text = await res.text();
      console.log("📄 Raw:", text.substring(0, 200));
      
      const response = JSON.parse(text);
      
      // ✅ Response parsing to'g'rilandi
      if (response.ok) {
        // Orders ni saqlash
        if (response.orders) {
          setOrders(response.orders);
          console.log("📦 Orders count:", response.orders.length);
        }
        
        // User data ni saqlash
        const userData = {
          balance: response.data?.balance || "0",
          profile: response.data?.profile || null,
          ...response.data,
        };
       
        console.log("✅ Balance:", userData.balance);
        setApiUser(userData);
        return userData;
      } else {
        console.warn("⚠️ Invalid response");
        const fallback = { balance: "0", profile: null };
        setApiUser(fallback);
        setOrders([]);
        return fallback;
      }
    } catch (err) {
      console.error("❌ Fetch Error:", err.message);
     
      // CORS xatoligini aniq ko'rsatish
      if (err.message.includes('Failed to fetch')) {
        console.error("🚫 CORS XATOLIGI: Serverda CORS headers yo'q!");
        console.error("📝 PHP faylingizga quyidagilarni qo'shing:");
        console.error(" header('Access-Control-Allow-Origin: *');");
      }
     
      const fallback = { balance: "0", profile: null };
      setApiUser(fallback);
      setOrders([]);
      return fallback;
    } finally {
      setLoading(false);
      console.log("=== API Fetch End ===");
    }
  };

  // ✅ Ma'lumotlarni yangilash
  const refreshUser = async () => {
    if (user?.id) {
      console.log("🔄 Refreshing...");
      await fetchUserFromApi(user.id, user.isTelegram);
    }
  };

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    
    if (tg) {
      console.log("✅ Telegram WebApp found");
     
      tg.ready();
     
      // Expand - xavfsiz
      try {
        tg.expand();
      } catch (e) {
        console.warn("Expand error:", e);
      }
      
      let interval;
      let timeout;
      
      // Telegram user ni kutish
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
            language_code: tgUser.language_code || "en",
            isTelegram: true,
            photo_url: tgUser.photo_url || null,
          };
          
          console.log("✅ Telegram user:", baseUser.id);
          setUser(baseUser);
          fetchUserFromApi(tgUser.id, true);
        }
      }, 300);
      
      // 3 soniya → DEV MODE
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
    } else {
      // Browser → DEV MODE
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