import { useContext } from "react";
import AboutPage from "./AboutPage";
import AllPattern from "../components/AllPattern";
import { AuthContext } from "../context/auth.context";

const DashboardPage: React.FC = () => {
  const authContext = useContext(AuthContext);
  const isLoggedIn = authContext ? authContext.isLoggedIn : false;

  return <div>{isLoggedIn ? <AllPattern /> : <AboutPage />}</div>;
};

export default DashboardPage;
