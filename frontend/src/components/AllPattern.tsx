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
      getAllPatterns().then((patterns) => {
        setAllPatterns(patterns);
      });
    }
  }, [isLoggedIn]);

  return (
    <div>
      <h1 className="bodyfontLarge">Patterns</h1>

      {allPatterns && (
        <div className="patternGrid">
          {allPatterns.map((pattern) => (
            <div key={pattern.id} className="patternCard">
              <Link to={`/patterns/${pattern.id}`} className="noUnderline">
                {pattern.image && (
                  <img
                    src={pattern.image}
                    alt={pattern.name}
                    className="patternCardImage"
                  />
                )}
                <div className="patternCardContent primaryFontColor">
                  <h2 className="labelfont">{pattern.name}</h2>
                  <p className="bodyfont">Sizes: {pattern.sizes.join(", ")}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllPattern;
