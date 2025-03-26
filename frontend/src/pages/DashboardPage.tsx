import { useContext } from "react";
import AboutPage from "./AboutPage";
import AllPatternsPage from "./AllPatternsPage";
import { AuthContext } from "../context/auth.context";

const DashboardPage: React.FC = () => {
  const authContext = useContext(AuthContext);
  const isLoggedIn = authContext ? authContext.isLoggedIn : false;

  return <div>{isLoggedIn ? <AllPatternsPage /> : <AboutPage />}</div>;
};

export default DashboardPage;
