import AboutPage from "./AboutPage";
import AllPatternsPage from "./AllPatternsPage";
import { useAuth } from "../context/auth.context";

const DashboardPage: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return <div>{isLoggedIn ? <AllPatternsPage /> : <AboutPage />}</div>;
};

export default DashboardPage;
