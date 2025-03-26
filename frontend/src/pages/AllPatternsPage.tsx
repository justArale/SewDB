import React from "react";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Pattern, getAllPatterns } from "../service/pattern.service";
import PatternGrid from "../components/PatternGrid";

const AllPatternsPage: React.FC = () => {
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
    <div className="componentBox">
      <p>Place for the searchbar</p>
      {allPatterns && <PatternGrid patterns={allPatterns} />}
    </div>
  );
};

export default AllPatternsPage;
