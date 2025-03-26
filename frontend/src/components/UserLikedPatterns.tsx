import React from "react";
import { Pattern } from "../service/pattern.service";
import PatternGrid from "./PatternGrid";

interface currentUserLikedPatterns {
  likedPatterns: Pattern[];
}

const UserLikedPattern: React.FC<currentUserLikedPatterns> = ({
  likedPatterns,
}) => {
  return (
    <div>
      {likedPatterns.length > 0 ? (
        <PatternGrid patterns={likedPatterns} />
      ) : (
        <div>
          <p className="bodyfont">No patterns found</p>
        </div>
      )}
    </div>
  );
};

export default UserLikedPattern;
