import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/pages/Dashboard";
import Gifts from "./components/pages/Gifts/Gifts";
import { TelegramProvider } from "../context/TelegramContext";

function App() {
  return (
    <TelegramProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/gifts" element={<Gifts />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </TelegramProvider>
  );
}

export default App;
