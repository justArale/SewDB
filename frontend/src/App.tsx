import { Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import DashboardPage from "./pages/DashboardPage";
import ErrorPage from "./pages/ErrorPage";
import Navbar from "./components/Navbar";

function App() {
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState(true);

  const handleLoginClick = () => {
    setIsLogin(true);
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
  };

  return (
    <div>
      <Navbar
        isOverlayOpen={isOverlayOpen}
        handleLoginClick={handleLoginClick}
        handleCloseOverlay={handleCloseOverlay}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
      />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
