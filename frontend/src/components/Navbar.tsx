import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { Dispatch, SetStateAction } from "react";
import { useAuth } from "../context/auth.context";
import { Add } from "@just1arale/icons";
import logo from "../assets/image/logo.svg";
import Overlay from "./OverlaySignupLogin";

type NavProps = {
  isOverlayOpen: boolean;
  handleLoginClick: () => void;
  handleCloseOverlay: () => void;
  isLogin: boolean;
  setIsLogin: Dispatch<SetStateAction<boolean>>;
};

const Navbar: React.FC<NavProps> = ({
  isOverlayOpen,
  handleLoginClick,
  handleCloseOverlay,
  isLogin,
  setIsLogin,
}) => {
  const location = useLocation();
  const { isLoggedIn, user, isLoading, logoutClick } = useAuth();
  const navigate = useNavigate();

  if (isLoading) return null;

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
            <img src={logo} alt="logo" className="logoImage" />
          </div>
          <Link to={`/`} className="noUnderline">
            <h1 className="pagetitle primaryFontColor normalLineheight">
              SewDB
            </h1>
            <p className="labelfont secondaryFontColor">All my patterns</p>
          </Link>
        </div>
        <div className="navigation">
          {user?.isAdmin && (
            <div className="navigation">
              <div className="">
                <Link to={`/users`} className="primaryFontColor noUnderline">
                  <p
                    className={`bodyfont secondaryFontColor profile ${
                      location.pathname === `/users` ? "active" : ""
                    }`}
                  >
                    All users
                  </p>
                </Link>
              </div>

              <div>
                <button
                  className="bodyfont buttonDefault"
                  onClick={handleButtonClick}
                >
                  <div className="innerButtonWrapper">
                    <Add width="16" height="16" color="#000" />
                    <span className="">Pattern</span>
                  </div>
                </button>
              </div>
            </div>
          )}
          {isLoggedIn && (
            <div className="">
              <Link
                className="primaryFontColor noUnderline"
                to={`/users/${user?.id}`}
              >
                <p
                  className={`bodyfont secondaryFontColor profile ${
                    location.pathname === `/users/${user?.id}` ||
                    location.pathname === `/users/${user?.id}/edit`
                      ? "active"
                      : ""
                  }`}
                >
                  My Profile
                </p>
              </Link>
            </div>
          )}
          <div className="">
            {isLoggedIn ? (
              <div>
                <button onClick={handleLogout} className="buttonDefault">
                  <span className="labelfont">Log Out</span>
                </button>
              </div>
            ) : (
              <>
                {location.pathname !== "/login" &&
                  location.pathname !== "/signup" && (
                    <button onClick={handleLoginClick} className="buttonAction">
                      <span className="labelfont">Log In</span>
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

export default Navbar;
