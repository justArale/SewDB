// src/pages/AllPatternsPage.tsx
import React from "react";
import { useState, useEffect } from "react";
import { useAuth } from "../context/auth.context";
import {
  Pattern,
  getAllPatterns,
  filterPatternsByParameter,
} from "../service/pattern.service";
import PatternGrid from "../components/PatternGrid";
import PatternSearchbar from "../components/PatternSearchbar";

const AllPatternsPage: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const primaryParam = params.get("primaryParam");
  const primaryValue = params.get("primaryValue");
  const secondaryParam = params.get("secondaryParam");
  const secondaryValue = params.get("secondaryValue");
  const [allPatterns, setAllPatterns] = useState<Pattern[]>([]);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (isLoggedIn) {
      if (primaryParam && primaryValue) {
        filterPatternsByParameter(
          primaryParam,
          primaryValue,
          secondaryParam || undefined,
          secondaryValue || undefined
        ).then(setAllPatterns);
        console.log("filterPatternsByParameter is called");
      } else {
        getAllPatterns().then(setAllPatterns);
      }
    }
  }, [isLoggedIn, window.location.search]);

  return (
    <div className="componentBox">
      {allPatterns && <PatternSearchbar patterns={allPatterns} />}
      {allPatterns && <PatternGrid patterns={allPatterns} />}
    </div>
  );
};

export default AllPatternsPage;
