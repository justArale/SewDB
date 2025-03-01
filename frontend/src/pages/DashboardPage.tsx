import { useState, useEffect, useContext } from "react";
import axios from "axios";
import AboutPage from "./AboutPage";
import { AuthContext } from "../context/auth.context";

const API_URL = import.meta.env.VITE_API_URL;

interface Patterns {
  id: string;
  name: string;
  image: string;
  sizes: [];
  category: [];
  source: [];
  intendedFor: string;
}

const DashboardPage: React.FC = () => {
  const authContext = useContext(AuthContext);
  const isLoggedIn = authContext ? authContext.isLoggedIn : false;
  const [allPatterns, setAllPatterns] = useState<Patterns[]>([]);

  const getAllPatterns = () => {
    axios
      .get(`${API_URL}/api/patterns`, {
        withCredentials: true,
      })
      .then((response) => {
        setAllPatterns(response.data);
      })
      .catch((error) => {
        console.log("catcherror:", error);
        if (error.response) {
          console.log("Server Error:", error.response?.data?.message);
        } else if (error.request) {
          console.log("No response received:", error.request);
        } else {
          console.log("Error setting up the request:", error.message);
        }
      });
  };

  useEffect(() => {
    if (isLoggedIn) {
      console.log("getAllPatterns called inside of isLoggedIn");

      getAllPatterns();
    }
  }, [isLoggedIn]);

  return (
    <div>
      {isLoggedIn ? (
        allPatterns && (
          <div className="">
            <div className=""></div>
            <div className="">
              <h1>Patterns</h1>
              {allPatterns.map((pattern) => (
                <div key={pattern.id} className="">
                  <h2>{pattern.name}</h2>
                  <p>Kategorie: {pattern.category.join(", ")}</p>
                  <p>Größen: {pattern.sizes.join(", ")}</p>
                  <p>Quelle: {pattern.source.join(", ")}</p>
                  <p>Intended for: {pattern.intendedFor}</p>
                  {pattern.image && (
                    <img src={pattern.image} alt={pattern.name} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      ) : (
        <AboutPage />
      )}
    </div>
  );
};

export default DashboardPage;
