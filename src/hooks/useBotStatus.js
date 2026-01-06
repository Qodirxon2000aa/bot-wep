import { useEffect, useState } from "react";

export default function useBotStatus() {
  const [status, setStatus] = useState(null); // null | "on" | "off"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://tezpremium.uz/webapp/settings.php")
      .then(res => res.json())
      .then(data => {
        setStatus(data?.settings?.bot_status);
      })
      .catch(() => {
        setStatus("off"); // xatolik bo‘lsa ham o‘chirilgan deb hisoblaymiz
      })
      .finally(() => setLoading(false));
  }, []);

  return { status, loading };
}
