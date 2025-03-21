import React from "react";
import { Link } from "react-router-dom";
import { Pattern } from "../service/pattern.service";

interface PatternProps {
  patterns: Pattern[];
}

const AllPattern: React.FC<PatternProps> = ({ patterns }) => {
  return (
    <div className="patternGrid">
      {patterns.map((pattern) => (
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
  );
};

export default AllPattern;
