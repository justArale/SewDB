import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import ErrorPage from "./pages/ErrorPage";
import Navbar from "./components/Navbar";
import NewPatternPage from "./pages/NewPatternPage";
import EditPatternPage from "./pages/EditPatternPage";
import PatternDetailPage from "./pages/PatternDetailPage";
import AllUsersPage from "./pages/AllUsersPage";
import ProfilPage from "./pages/ProfilPage";

function App() {
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState(true);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleLoginClick = () => {
    setIsLogin(true);
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
  };

  return (
    <div className="page">
      <Navbar
        isOverlayOpen={isOverlayOpen}
        handleLoginClick={handleLoginClick}
        handleCloseOverlay={handleCloseOverlay}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
      />
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/users" element={<AllUsersPage />} />
          <Route path="users/:userId" element={<ProfilPage />} />
          <Route path="/patterns/:patternId" element={<PatternDetailPage />} />
          <Route path="/patterns/new" element={<NewPatternPage />} />
          <Route
            path="/patterns/:patternId/edit"
            element={<EditPatternPage />}
          />
        </Route>
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
