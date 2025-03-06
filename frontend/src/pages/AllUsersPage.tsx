import React from "react";
import { useState, useEffect } from "react";
import { User, getAllUsers } from "../service/user.service";

const AllUsersPage: React.FC = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    getAllUsers().then((users) => {
      users && setAllUsers(users);
      console.log("users: ", users);
    });
  }, []);

  return (
    <div>
      <h2>All Users</h2>
      <ul>
        {allUsers.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllUsersPage;
