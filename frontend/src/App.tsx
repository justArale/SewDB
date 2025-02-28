import { Routes, Route } from "react-router-dom";
import "./App.css";
import DashboardPage from "./pages/DashboardPage";
import AboutPage from "./pages/AboutPage";
import ErrorPage from "./pages/ErrorPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
