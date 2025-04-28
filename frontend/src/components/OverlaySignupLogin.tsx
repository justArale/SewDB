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
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  const sendEmail = async (name: string, email: string) => {
    const url = "https://sewdb.arale.space";

    try {
      await sendVerificationEmail(name, email, url);
      console.log("✅ Test-Mail erfolgreich gesendet!");
    } catch (error) {
      console.error("❌ Fehler beim Senden der Test-Mail:", error);
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
    console.log("API_URL", API_URL);
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
    const requestBody = { email, password, name };

    axios
      .post(`${API_URL}/auth/signup`, requestBody)
      .then(() => {
        sendEmail(name, email);
      })
      .then(() => {
        const loginRequestBody = { email, password };

        axios
          .post(`${API_URL}/auth/login`, loginRequestBody, {
            withCredentials: true,
          })
          .then(() => {
            onClose();
            window.location.reload();
          })
          .catch((error) => {
            const errorDescription =
              error.response?.data?.message || "An error occurred";
            setErrorMessage(errorDescription);
          });
      })

      .catch((error) => {
        const errorDescription =
          error.response?.data?.message || "An error occurred";
        setErrorMessage(errorDescription);
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
          />
        )}
      </div>
    </div>
  );
};

export default Overlay;
