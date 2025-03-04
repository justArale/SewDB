import React from "react";
import axios from "axios";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Link } from "react-router-dom";

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

const AllPattern: React.FC = () => {
  const [allPatterns, setAllPatterns] = useState<Patterns[]>([]);
  const authContext = useContext(AuthContext);
  const isLoggedIn = authContext ? authContext.isLoggedIn : false;

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
      {allPatterns && (
        <div className="">
          <div className=""></div>
          <div className="">
            <h1>Patterns</h1>
            {allPatterns.map((pattern) => (
              <div key={pattern.id} className="">
                <Link to={`/patterns/${pattern.id}`}>
                  <h2>{pattern.name}</h2>
                  <p>Category: {pattern.category.join(", ")}</p>
                  <p>Sizes: {pattern.sizes.join(", ")}</p>
                  <p>Source: {pattern.source.join(", ")}</p>
                  <p>Intended for: {pattern.intendedFor}</p>
                  {pattern.image && (
                    <img src={pattern.image} alt={pattern.name} />
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPattern;
