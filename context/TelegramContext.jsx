import { createContext, useContext, useEffect, useState } from "react";

const TelegramContext = createContext(null);

export const TelegramProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [apiUser, setApiUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Balance ni API dan olish
  const fetchUserFromApi = async (userId, isTelegram = true) => {
    try {
      setLoading(true);

      // DEV mode bo'lsa real Telegram ID
      const actualUserId = !isTelegram ? "7887859754" : userId;

      const fetchUrl = `https://m4746.myxvest.ru/webapp/get_user.php?user_id=${actualUserId}`;
      
      console.log("=== API Fetch Start ===");
      console.log("🌐 URL:", fetchUrl);
      console.log("🆔 User ID:", actualUserId);
      console.log("📱 Is Telegram:", isTelegram);

      const res = await fetch(fetchUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors',
        cache: 'no-cache', // ✅ Cache ni o'chirish
      });

      console.log("📥 Response Status:", res.status, res.ok);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const text = await res.text();
      console.log("📄 Raw Response:", text);

      const response = JSON.parse(text);
      console.log("✅ Parsed JSON:", response);

      if (response.ok && response.data) {
        const userData = {
          balance: response.data.balance || "0",
          profile: response.data.profile || null,
          // Qo'shimcha ma'lumotlar bo'lsa
          ...response.data
        };
        
        console.log("💰 Balance:", userData.balance);
        console.log("🖼️ Profile:", userData.profile);
        
        setApiUser(userData);
        return userData; // ✅ Return qilish
      } else {
        console.warn("⚠️ Invalid response structure:", response);
        setApiUser({ balance: "0", profile: null });
        return { balance: "0", profile: null };
      }
    } catch (err) {
      console.error("❌ API Error:", err);
      console.error("❌ Error Details:", err.message);
      setApiUser({ balance: "0", profile: null });
      return { balance: "0", profile: null };
    } finally {
      setLoading(false);
      console.log("=== API Fetch End ===");
    }
  };

  // ✅ User ma'lumotlarini yangilash funksiyasi
  const refreshUser = async () => {
    if (user?.id) {
      console.log("🔄 Refreshing user data...");
      await fetchUserFromApi(user.id, user.isTelegram);
    }
  };

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      console.log("✅ Telegram WebApp topildi");
      
      // Telegram WebApp ni tayyor qilish
      tg.ready();
      tg.expand(); // ✅ To'liq ekranga yoyish
      
      // ✅ Theme colors ni o'rnatish
      if (tg.themeParams) {
        document.documentElement.style.setProperty(
          '--tg-theme-bg-color', 
          tg.themeParams.bg_color || '#ffffff'
        );
        document.documentElement.style.setProperty(
          '--tg-theme-text-color', 
          tg.themeParams.text_color || '#000000'
        );
      }

      let interval;
      let timeout;

      // ✅ Telegram user ma'lumotlarini olish (har 300ms tekshirish)
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

          console.log("✅ Telegram user topildi:", baseUser);
          setUser(baseUser);
          fetchUserFromApi(tgUser.id, true);
        }
      }, 300);

      // ✅ 3 soniya kutib, Telegram user kelmasa → DEV MODE
      timeout = setTimeout(() => {
        clearInterval(interval);

        console.warn("⚠️ Telegram user 3 soniyada topilmadi → DEV MODE");

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
      // ===== TELEGRAM YO'Q (Browser test) → DEV MODE =====
      console.warn("⚠️ Telegram.WebApp mavjud emas → DEV MODE");

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

  // ✅ Debug: User va API ma'lumotlarini kuzatish
  useEffect(() => {
    console.log("=== Context State ===");
    console.log("👤 User:", user);
    console.log("💰 API User:", apiUser);
    console.log("⏳ Loading:", loading);
    console.log("====================");
  }, [user, apiUser, loading]);

  return (
    <TelegramContext.Provider
      value={{
        user,
        apiUser,
        loading,
        refreshUser, // ✅ Export qilish
        tg: window.Telegram?.WebApp, // ✅ Telegram API
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