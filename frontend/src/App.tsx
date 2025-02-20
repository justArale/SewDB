import { Routes, Route } from "react-router-dom";
import "./App.css";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
      </Routes>
    </div>
  );
}

export default App;
