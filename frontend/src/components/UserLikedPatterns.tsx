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
    <>
      {likedPatterns.length > 0 ? (
        <PatternGrid patterns={likedPatterns} />
      ) : (
        <div>
          <p className="bodyfont">No patterns found</p>
        </div>
      )}
    </>
  );
};

export default UserLikedPattern;
