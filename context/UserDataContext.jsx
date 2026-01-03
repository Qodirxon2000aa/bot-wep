import { createContext, useContext, useEffect, useState } from "react";
import { useTelegram } from "./TelegramContext";

const UserDataContext = createContext(null);

export const UserDataProvider = ({ children }) => {
  const { user } = useTelegram(); // faqat Telegram ID olamiz
  const [apiUser, setApiUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchUser = async (userId) => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://m4746.myxvest.ru/webapp/get_user.php?user_id=${userId}`
      );
      const json = await res.json();

      console.log("USER DATA API:", json);

      if (json.ok && json.data) {
        setApiUser(json.data);
      } else {
        setApiUser({ balance: "0", profile: null });
      }
    } catch (e) {
      console.error("UserData error:", e);
      setApiUser({ balance: "0", profile: null });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    fetchUser(user.id);
  }, [user?.id]);

  return (
    <UserDataContext.Provider
      value={{
        apiUser,
        loading,
        refresh: () => user?.id && fetchUser(user.id),
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => useContext(UserDataContext);
