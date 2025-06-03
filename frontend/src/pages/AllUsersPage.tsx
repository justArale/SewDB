import React from "react";
import { useState, useEffect } from "react";
import { User, getAllUsers } from "../service/user.service";
import { Link } from "react-router-dom";

const AllUsersPage: React.FC = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    getAllUsers().then((users) => {
      users && setAllUsers(users);
    });
  }, []);

  return (
    <div className="componentBox">
      <h2>All Users</h2>
      <ul>
        {allUsers.map((user) => (
          <Link to={`/users/${user.id}`}>
            <li key={user.id}>
              {user.name} ({user.email})
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default AllUsersPage;
