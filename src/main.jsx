import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { TelegramProvider } from "../context/TelegramContext.jsx";
import { UserDataProvider } from "../context/UserDataContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TelegramProvider>
      <UserDataProvider>
        <App />
      </UserDataProvider>
    </TelegramProvider>
  </StrictMode>
);
