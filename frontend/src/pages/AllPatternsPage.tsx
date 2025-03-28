import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/auth.context";
import { Pattern, getAllPatterns } from "../service/pattern.service";
import PatternGrid from "../components/PatternGrid";

const AllPatternsPage: React.FC = () => {
  const [allPatterns, setAllPatterns] = useState<Pattern[]>([]);
  const { isLoggedIn } = useAuth();

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
