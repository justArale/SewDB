import "./Navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useState, useContext, Dispatch, SetStateAction } from "react";
import { AuthContext } from "../context/auth.context";
import axios from "axios";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import { Add } from "@just1arale/icons";
import { User } from "../service/user.service";

const API_URL = import.meta.env.VITE_API_URL;

interface NavProps {
  isOverlayOpen: boolean;
  handleLoginClick: () => void;
  handleCloseOverlay: () => void;
  isLogin: boolean;
  setIsLogin: Dispatch<SetStateAction<boolean>>;
}

const Navbar: React.FC<NavProps> = ({
  isOverlayOpen,
  handleLoginClick,
  handleCloseOverlay,
  isLogin,
  setIsLogin,
}) => {
  const location = useLocation();
  const authContext = useContext(AuthContext);
  const isLoggedIn = authContext?.isLoggedIn ?? false;
  const user: User | null = authContext?.user ?? null;
  const logoutClick = authContext?.logoutClick;
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (isLoggedIn) {
      navigate("/patterns/new");
    } else {
      handleLoginClick();
    }
  };

  const handleLogout = () => {
    logoutClick && logoutClick();
    navigate("/");
  };

  return (
    <div className="header">
      <div className="inner">
        <div className="nav-title">
          <div className="logoWrapper">
            {/* <img src={logo} alt="logo" className="logoImage" /> */}
          </div>
          <Link to={`/`} className="noUnderline">
            <h1 className="headline normalLineHeight boldWeight primaryColor">
              SewDB
            </h1>
            <p className="mainFont semiBoldWeight thirdColor">
              All my patterns
            </p>
          </Link>
        </div>
        <div className="navigation">
          <div className="sidebar-path">
            <Link className="primaryColor noUnderline" to={`/`}>
              <p
                className={`mainFont semiBoldWeight thirdColor home ${
                  location.pathname === "/" ? "active" : ""
                }`}
              >
                Home
              </p>
            </Link>
          </div>
          {isLoggedIn ? (
            <div className="sidebar-path">
              <Link
                className="primaryColor noUnderline"
                to={`/user/${user?.id}`}
              >
                <p
                  className={`mainFont semiBoldWeight thirdColor profil ${
                    location.pathname === `/user/${user?.id}` ||
                    location.pathname === `/user/${user?.id}/edit`
                      ? "active"
                      : ""
                  }`}
                >
                  Profil
                </p>
              </Link>
            </div>
          ) : (
            <div className="sidebar-path">
              <Link className="primaryColor noUnderline" to={`/about`}>
                <p
                  className={`mainFont semiBoldWeight thirdColor about ${
                    location.pathname === "/about" ? "active" : ""
                  }`}
                >
                  About
                </p>
              </Link>
            </div>
          )}
          <div className="action">
            {user?.isAdmin && (
              <div>
                <button
                  className="mainFont noUnderline primaryColor buttonReverse"
                  onClick={handleButtonClick}
                >
                  <div className="buttonContentWrapper">
                    <Add width="16" height="16" color="#FFF" />
                    <span className="buttonFont buttonFontReverse">
                      Pattern
                    </span>
                  </div>
                </button>
              </div>
            )}
            {isLoggedIn ? (
              <div>
                <button
                  onClick={handleLogout}
                  className="mainFont noUnderline primaryColor"
                >
                  <span className="buttonFont">Log Out</span>
                </button>
              </div>
            ) : (
              <>
                {location.pathname !== "/login" &&
                  location.pathname !== "/signup" && (
                    <button
                      onClick={handleLoginClick}
                      className="mainFont noUnderline primaryColor"
                    >
                      <span className="buttonFont">Log In</span>
                    </button>
                  )}
              </>
            )}
          </div>
        </div>
      </div>
      {isOverlayOpen && (
        <Overlay
          isLogin={isLogin}
          onClose={handleCloseOverlay}
          onSwitch={() => setIsLogin(!isLogin)}
        />
      )}
    </div>
  );
};

interface OverlayProps {
  isLogin: boolean;
  onClose: () => void;
  onSwitch: () => void;
}

function Overlay({ isLogin, onClose, onSwitch }: OverlayProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

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
}

export default Navbar;
