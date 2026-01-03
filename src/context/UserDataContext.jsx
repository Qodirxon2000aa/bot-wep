import { createContext, useContext, useEffect, useState } from "react";
import { useTelegram } from "@/context/TelegramContext";

const UserDataContext = createContext(null);

export const UserDataProvider = ({ children }) => {
  const { user } = useTelegram();

  const [apiUser, setApiUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ Default true bo'lsin

  // ✅ Balansni yangilash funksiyasi
  const refreshBalance = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);

      const res = await fetch(
        `https://m4746.myxvest.ru/webapp/get_user.php?user_id=${user.id}`
      );
      const json = await res.json();

      console.log("USER DATA API:", json);

      if (json.ok && json.data) {
        setApiUser(json.data);
      } else {
        setApiUser({ balance: "0" });
      }
    } catch (e) {
      console.error("Balance fetch error:", e);
      setApiUser({ balance: "0" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshBalance();
  }, [user?.id]);

  return (
    <UserDataContext.Provider value={{ apiUser, loading, refreshBalance }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const ctx = useContext(UserDataContext);
  if (!ctx) {
    throw new Error("useUserData must be used inside UserDataProvider");
  }
  return ctx;
};