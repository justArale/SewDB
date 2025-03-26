import React from "react";
import { User } from "../service/user.service";

interface UserInfoCardProps {
  user: User;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ user }) => {
  return (
    <div className="userInfoBox">
      <ul className="userInfoBoxContentWrapper">
        <li className="userInfoBoxContent">
          <span></span>
          <h3 className="labelfont">Name:</h3>
          <p className="bodyfont">{user.name}</p>
        </li>
        <li className="userInfoBoxContent">
          <span></span>
          <h3 className="labelfont">Email:</h3>
          <p className="bodyfont">{user.email}</p>
        </li>
      </ul>
    </div>
  );
};

export default UserInfoCard;
