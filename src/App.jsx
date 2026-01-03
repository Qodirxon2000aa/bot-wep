import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/pages/Dashboard";
import Gifts from "./components/pages/Gifts/Gifts";

// Agar boshqa sahifalar qo'shmoqchi bo'lsangiz, shu yerga import qiling
// import Settings from "./components/pages/Settings";
// import Profile from "./components/pages/Profile";

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Sayt ochilganda avtomatik /dashboard ga o'tkazsin */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* 2. Asosiy sahifalar (Layout siz) */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/gifts" element={<Gifts />} />

        {/* Misollar (kerak bo'lsa ochib qo'ying) */}
        {/* <Route path="/settings" element={<Settings />} /> */}
        {/* <Route path="/profile" element={<Profile />} /> */}

        {/* 3. Hamma noto'g'ri URL larni dashboard ga qaytarsin */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;