import React, { useEffect, useState } from "react";
import { verifyUser } from "../service/user.service";

const UserVerifyPage: React.FC = () => {
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      verifyUser(token)
        .then((response) => {
          console.log("response", response);
          console.log("response.message", response?.message);
          if (
            response &&
            response.message === "Your email has been successfully verified!"
          ) {
            setStatus("success");
            setTimeout(() => {
              window.location.href = "/";
            }, 1500);
          } else {
            setStatus("error");
          }
        })
        .catch((error) => {
          console.error("Error verifying user:", error);
          setStatus("error");
        });
    } else {
      setStatus("error");
    }
  }, []);

  return (
    <div>
      {status === "loading" && <p>Verifing user...</p>}
      {status === "success" && <p>Success! Returning to main page.</p>}
      {status === "error" && <p>An error occurred. Please try again.</p>}
    </div>
  );
};

export default UserVerifyPage;
