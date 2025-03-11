import React from "react";
import { UserToPattern } from "../service/user.service";

interface currentUserLikedPatterns {
  likedPatterns: UserToPattern;
}

const UserLikedPattern: React.FC<currentUserLikedPatterns> = ({
  likedPatterns,
}) => {
  return (
    <div>
      {likedPatterns?.map((pattern) => {
        <li key={pattern.id}>{pattern.name}</li>;
      })}
    </div>
  );
};

export default UserLikedPattern;
