import axios from "axios";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import React, { useState } from "react";
import { sendVerificationEmail } from "../service/email.service";

const API_URL = import.meta.env.VITE_API_URL;

type OverlayProps = {
  isLogin: boolean;
  onClose: () => void;
  onSwitch: () => void;
};

const Overlay: React.FC<OverlayProps> = ({ isLogin, onClose, onSwitch }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [formStatus, setFormStatus] = useState<
    "loading" | "success" | "error" | ""
  >("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  const sendEmail = async (
    name: string,
    email: string,
    verifyToken: string
  ) => {
    const url = `https://sewdb.arale.space/verify?token=${verifyToken}`;

    try {
      const response = await sendVerificationEmail(
        name,
        email,
        url,
        verifyToken
      );
      console.log("response", response);
      console.log("response.message", response.message);
      if (response && response.message === "Email sent successfully") {
        setFormStatus("success");
        setTimeout(() => {
          onClose();
        }, 1500);
        return response;
      } else {
        setFormStatus("error");
        return response;
      }
    } catch (error) {
      setFormStatus("error");
      console.error("Issue sending email:", error);
    }
  };

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(e.target.value);
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);
  const handleName = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const requestBody = { email, password };

    axios
      .post(`${API_URL}/auth/login`, requestBody, { withCredentials: true })
      .then(() => {
        onClose();
        window.location.reload();
      })
      .catch((error) => {
        const errorDescription =
          error.response?.data?.message || "An error occurred";
        setErrorMessage(errorDescription);
      });
  };

  const handleSignupSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("loading");
    const requestBody = { email, password, name };

    axios
      .post(`${API_URL}/auth/signup`, requestBody)
      .then((response) => {
        const verifyToken = response.data.user.verificationToken;
        sendEmail(name, email, verifyToken);
      })
      .catch((error) => {
        const errorDescription =
          error.response?.data?.message || "An error occurred";
        setErrorMessage(errorDescription);
        setFormStatus("error");
      });
  };

  return (
    <div className="overlay">
      <div className="overlay-background" onClick={onClose}></div>
      <div className="overlay-content">
        {isLogin ? (
          <LoginForm
            handleLoginSubmit={handleLoginSubmit}
            handleEmail={handleEmail}
            handlePassword={handlePassword}
            email={email}
            password={password}
            errorMessage={errorMessage}
            onSwitch={onSwitch}
          />
        ) : (
          <SignUpForm
            handleSignupSubmit={handleSignupSubmit}
            handleEmail={handleEmail}
            handlePassword={handlePassword}
            handleName={handleName}
            email={email}
            password={password}
            name={name}
            errorMessage={errorMessage}
            onSwitch={onSwitch}
            formStatus={formStatus}
          />
        )}
      </div>
    </div>
  );
};

export default Overlay;
