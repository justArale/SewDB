import "./Navbar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useContext, Dispatch, SetStateAction } from "react";
import { AuthContext } from "../context/auth.context";
import { Add } from "@just1arale/icons";
import { User } from "../service/user.service";
import logo from "../assets/image/logo.svg";
import Overlay from "./OverlaySignupLogin";

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
            <img src={logo} alt="logo" className="logoImage" />
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
          {isLoggedIn && (
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
          )}
          <div className="action">
            {user?.isAdmin && (
              <div>
                <button
                  className="bodyfont buttonDefault"
                  onClick={handleButtonClick}
                >
                  <div className="bodyfont buttonDefault">
                    <Add width="16" height="16" color="#FFF" />
                    <span className="">Pattern</span>
                  </div>
                </button>
                <Link to={`/users`}>
                  <p
                    className={`mainFont semiBoldWeight thirdColor profil ${
                      location.pathname === `/user/${user?.id}` ||
                      location.pathname === `/user/${user?.id}/edit`
                        ? "active"
                        : ""
                    }`}
                  >
                    All users
                  </p>
                </Link>
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
                      className="buttonDefault"
                    >
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
