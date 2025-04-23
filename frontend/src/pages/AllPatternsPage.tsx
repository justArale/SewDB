// src/pages/AllPatternsPage.tsx
import React, { useState, useEffect } from "react";
// import { useLocation } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import {
  Pattern,
  getAllPatterns,
  filterPatternsByParameter,
} from "../service/pattern.service";
import PatternGrid from "../components/PatternGrid";
// import PatternSearchbar from "../components/PatternSearchbar";

const AllPatternsPage: React.FC = () => {
  // const location = useLocation();
  const [allPatterns, setAllPatterns] = useState<Pattern[]>([]);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const primaryParam = params.get("primaryParam");
    const primaryValue = params.get("primaryValue");
    const secondaryParam = params.get("secondaryParam");
    const secondaryValue = params.get("secondaryValue");
    if (isLoggedIn) {
      if (primaryParam && primaryValue) {
        filterPatternsByParameter(
          primaryParam,
          primaryValue,
          secondaryParam || undefined,
          secondaryValue || undefined
        ).then(setAllPatterns);
        // console.log("filterPatternsByParameter is called");
      } else {
        getAllPatterns().then(setAllPatterns);
      }
    }
    // console.log("Current location.search:", location.search);
    // console.log("primaryParam", primaryParam);
    // console.log("primaryValue", primaryValue);
  }, [isLoggedIn]);

  return (
    <div className="componentBox">
      {/* {allPatterns && <PatternSearchbar patterns={allPatterns} />} */}
      {allPatterns && <PatternGrid patterns={allPatterns} />}
    </div>
  );
};

export default AllPatternsPage;
