// TelegramContext.jsx (asosiysi o'zgarmadi: apiUser va profile ni saqlaydi, faqat balance ni modalda qayta fetch qilish mumkin)
import { createContext, useContext, useEffect, useState } from "react";

const TelegramContext = createContext(null);

export const TelegramProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [apiUser, setApiUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      const waitForUser = setInterval(() => {
        const tgUser = tg.initDataUnsafe?.user;
        if (tgUser?.id) {
          clearInterval(waitForUser);
          const baseUser = {
            id: tgUser.id,
            first_name: tgUser.first_name || "",
            last_name: tgUser.last_name || "",
            username: tgUser.username ? `@${tgUser.username}` : "",
            isTelegram: true,
            photo_url: tgUser.photo_url || null,
          };
          setUser(baseUser);

          // API fetch: profile va boshqa ma'lumotlar uchun (balance ni modalda qayta olish mumkin)
          const fetchUrl = `https://m4746.myxvest.ru/webapp/get_user.php?user_id=${tgUser.id}`;
          console.log("Fetching API for user:", tgUser.id, "URL:", fetchUrl);
          fetch(fetchUrl)
            .then((res) => res.json())
            .then((response) => {
              console.log("FULL PHP RESPONSE:", response);
              if (response.ok && response.data) {
                // Balance ni contextda saqlaymiz, lekin modalda qayta fetch qilish mumkin
                setApiUser(response.data);
                console.log("apiUser set to:", response.data);
              } else {
                console.warn("API response not ok:", response);
                setApiUser({ balance: "0", profile: null }); // fallback
              }
            })
            .catch((err) => {
              console.error("Fetch error:", err);
              setApiUser({ balance: "0", profile: null });
            })
            .finally(() => setLoading(false));
          return; // loading ni fetch tugagach o'chiramiz
        }
      }, 300);

      setTimeout(() => {
        clearInterval(waitForUser);
        setLoading(false);
      }, 5000);
      return;
    }

    // DEV MODE
    console.warn("DEV MODE: Telegram yo‘q");
    const devId = "DEV_123456";
    setUser({
      id: devId,
      first_name: "Dev",
      last_name: "User",
      username: "@dev_user",
      isTelegram: false,
      photo_url: null,
    });

    const fetchUrl = `https://m4746.myxvest.ru/webapp/get_user.php?user_id=${devId}`;
    console.log("DEV fetch:", fetchUrl);
    fetch(fetchUrl)
      .then((res) => res.json())
      .then((response) => {
        console.log("DEV PHP RESPONSE:", response);
        if (response.ok && response.data) {
          setApiUser(response.data);
        } else {
          setApiUser({ balance: "0", profile: null });
        }
      })
      .catch((err) => console.error("DEV fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <TelegramContext.Provider value={{ user, apiUser, loading }}>
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => useContext(TelegramContext);