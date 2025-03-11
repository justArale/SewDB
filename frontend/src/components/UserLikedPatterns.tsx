import React from "react";
import { UserToPattern } from "../service/user.service";

interface currentUserLikedPatterns {
  likedPatterns: UserToPattern[];
}

const UserLikedPattern: React.FC<currentUserLikedPatterns> = ({
  likedPatterns,
}) => {
  return (
    <div>
      {likedPatterns.length > 0 ? (
        <ul>
          {likedPatterns.map((pattern) => (
            <li key={pattern.id}>{pattern.name}</li>
          ))}
        </ul>
      ) : (
        <div>
          <p>No patterns found</p>
        </div>
      )}
    </div>
  );
};

export default UserLikedPattern;
