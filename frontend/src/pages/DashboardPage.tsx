import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface User {
  id: string;
  name: string;
  email: string;
}

const DashboardPage: React.FC = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const getAllUsers = () => {
    axios
      .get(`${API_URL}/api/users`)
      .then((response) => {
        setAllUsers(response.data.users);
      })
      .catch((error) => {
        console.log(error.response?.data?.message);
      });
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  useEffect(() => {
    console.log("Show response:", allUsers);
  }, [allUsers]);

  return (
    allUsers && (
      <div className="recipe-columns">
        <div className="left-column"></div>
        <div className="right-column">
          <h1>Users</h1>
          {allUsers.map((user) => (
            <div key={user.id} className="recipe-card">
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default DashboardPage;
