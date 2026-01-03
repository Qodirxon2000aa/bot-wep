import { createContext, useContext, useEffect, useState } from "react";
import { useTelegram } from "@/context/TelegramContext"; // ⚠️ BIR XIL YO‘L

const UserDataContext = createContext(null);

export const UserDataProvider = ({ children }) => {
  const { user } = useTelegram();

  const [apiUser, setApiUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const fetchUser = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://m4746.myxvest.ru/webapp/get_user.php?user_id=${user.id}`
        );
        const json = await res.json();

        console.log("USER DATA API:", json);

        setApiUser(json.ok && json.data ? json.data : { balance: "0" });
      } catch (e) {
        console.error(e);
        setApiUser({ balance: "0" });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user?.id]);

  return (
    <UserDataContext.Provider value={{ apiUser, loading }}>
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
