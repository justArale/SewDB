import React from "react";
import { User } from "../service/user.service";

interface UserInfoCardProps {
  user: User;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ user }) => {
  return (
    <div className="userInfoBox">
      <div className="userInfoWrapper">
        <div className="userInfo">
          <h1 className="title">{user.name}</h1>
          <div className="">
            <p
              className="mainFont semiBoldWeigth"
              style={{ marginTop: "auto" }}
            >
              {/* {user.likes.length} liked pattern */}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfoCard;
