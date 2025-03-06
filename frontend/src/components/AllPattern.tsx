// src/components/AllPatterns.tsx
import React from "react";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Link } from "react-router-dom";
import { Pattern, getAllPatterns } from "../service/pattern.service";

const AllPattern: React.FC = () => {
  const [allPatterns, setAllPatterns] = useState<Pattern[]>([]);
  const authContext = useContext(AuthContext);
  const isLoggedIn = authContext ? authContext.isLoggedIn : false;

  useEffect(() => {
    if (isLoggedIn) {
      console.log("getAllPatterns called inside of isLoggedIn");

      getAllPatterns().then((patterns) => {
        setAllPatterns(patterns);
      });
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
