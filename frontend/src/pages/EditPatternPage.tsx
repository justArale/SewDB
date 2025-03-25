// EditPatternPage.tsx
import React from "react";
import AddPattern from "../components/AddPattern";
import { useLocation } from "react-router-dom";

const PatternEditPage: React.FC = () => {
  const location = useLocation();
  const patternFromLocation = location.state?.currentPattern;

  return (
    <div className="componentBox">
      <AddPattern existingPattern={patternFromLocation} />
    </div>
  );
};

export default PatternEditPage;
