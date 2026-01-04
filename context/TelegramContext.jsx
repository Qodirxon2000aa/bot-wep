import { createContext, useContext, useEffect, useState } from "react";

const TelegramContext = createContext(null);

export const TelegramProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [apiUser, setApiUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUserFromApi = async (userId, isTelegram = true) => {
    try {
      setLoading(true);
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

      if (response.ok) {
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
        return fallback;
      }
    } catch (err) {
      console.error("❌ Fetch Error:", err.message);
      const fallback = { balance: "0", profile: null };
      setApiUser(fallback);
      return fallback;
    } finally {
      setLoading(false);
      console.log("=== API Fetch End ===");
    }
  };

  const fetchOrders = async (userId, isTelegram = true) => {
    try {
      const actualUserId = !isTelegram ? "7521806735" : userId;
      const url = `https://m4746.myxvest.ru/webapp/history.php?user_id=${actualUserId}`;

      console.log("📦 Fetching orders from:", url);

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
        cache: 'no-cache',
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log("📦 Orders response:", data);

      if (data.ok && Array.isArray(data.orders)) {
        setOrders(data.orders);
        console.log("✅ Orders loaded:", data.orders.length);
      } else {
        setOrders([]);
        console.warn("⚠️ No orders in response");
      }
    } catch (err) {
      console.error("❌ Orders fetch error:", err.message);
      setOrders([]);
    }
  };

  const createPremiumOrder = async ({ months, sent, overall }) => {
    try {
      if (!user?.id) {
        throw new Error("User ID yo'q");
      }

      const actualUserId = user.isTelegram ? user.id : "7521806735";
      
      const url = `https://m4746.myxvest.ru/webapp/premium.php` +
        `?user_id=${actualUserId}` +
        `&amount=${months}` +
        `&sent=${sent.replace("@", "")}` +
        `&overall=${overall}`;

      console.log("💎 PREMIUM ORDER URL:", url);

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await res.json();
      console.log("💎 PREMIUM ORDER RESPONSE:", data);

      if (data.ok) {
        await refreshUser();
        return {
          ok: true,
          data: data.data,
          order_id: data.order_id,
          balance_after: data.balance_after
        };
      }

      return { ok: false, message: data.message || "Order saqlanmadi" };
    } catch (err) {
      console.error("❌ createPremiumOrder error:", err.message);
      return { ok: false, message: err.message };
    }
  };

  const createOrder = async ({ amount, sent, type, overall }) => {
    try {
      if (!user?.id) {
        throw new Error("User ID yo'q");
      }

      const actualUserId = user.isTelegram ? user.id : "7521806735";

      const url = `https://m4746.myxvest.ru/webapp/order.php` +
        `?user_id=${actualUserId}` +
        `&amount=${amount}` +
        `&sent=@${sent.replace("@", "")}` +
        `&type=${type}` +
        `&overall=${overall}`;

      console.log("📤 ORDER URL:", url);

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await res.json();
      console.log("📥 ORDER RESPONSE:", data);

      if (data.ok) {
        await refreshUser();
        return { ok: true };
      }

      return { ok: false, message: "Order saqlanmadi" };
    } catch (err) {
      console.error("❌ createOrder error:", err.message);
      return { ok: false, message: err.message };
    }
  };

  const fetchPayments = async (userId, isTelegram = true) => {
    try {
      const actualUserId = !isTelegram ? "7521806735" : userId;
      const url = `https://m4746.myxvest.ru/webapp/payments.php?user_id=${actualUserId}`;

      console.log("💳 Fetching payments from:", url);

      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
        cache: 'no-cache',
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log("💳 Payments response:", data);

      if (data.ok && Array.isArray(data.payments)) {
        setPayments(data.payments);
        console.log("✅ Payments loaded:", data.payments.length);
      } else {
        setPayments([]);
        console.warn("⚠️ No payments in response");
      }
    } catch (err) {
      console.error("❌ Payments fetch error:", err.message);
      setPayments([]);
    }
  };

  const refreshUser = async () => {
    if (user?.id) {
      console.log("🔄 Refreshing all data...");
      await Promise.all([
        fetchUserFromApi(user.id, user.isTelegram),
        fetchOrders(user.id, user.isTelegram),
        fetchPayments(user.id, user.isTelegram)
      ]);
    }
  };

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (tg) {
      console.log("✅ Telegram WebApp found");
      
      // 🔥 TO'LIQ EKRAN REJIMI
      tg.ready();
      tg.expand();
      tg.enableClosingConfirmation();
      
      // 🔥 Viewport sozlamalari
      if (tg.setHeaderColor) {
        tg.setHeaderColor('secondary_bg_color');
      }
      if (tg.setBackgroundColor) {
        tg.setBackgroundColor('#ffffff');
      }
      
      // 🔥 Har doim to'liq ekranda bo'lishi uchun
      const expandInterval = setInterval(() => {
        if (tg.viewportHeight < window.innerHeight) {
          tg.expand();
        }
      }, 100);

      // 🔒 VIEWPORT LOCK - Har qanday o'zgarishda expand qilish
      tg.onEvent("viewportChanged", () => {
        console.log("📱 Viewport changed, expanding...");
        tg.expand();
      });

      let interval;
      let timeout;

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

          setUser(baseUser);
          fetchUserFromApi(tgUser.id, true);
          fetchOrders(tgUser.id, true);
          fetchPayments(tgUser.id, true);
        }
      }, 300);

      timeout = setTimeout(() => {
        clearInterval(interval);

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
        fetchOrders(devUser.id, false);
        fetchPayments(devUser.id, false);
      }, 3000);

      return () => {
        clearInterval(interval);
        clearInterval(expandInterval);
        clearTimeout(timeout);
      };
    }
  }, []);

  return (
    <TelegramContext.Provider
      value={{
        user,
        apiUser,
        orders,
        payments,
        loading,
        createOrder,
        createPremiumOrder,
        refreshUser,
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