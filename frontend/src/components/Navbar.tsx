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
            <h1 className="pagetitle primaryFontColor normalLineheight">
              SewDB
            </h1>
            <p className="labelfont secondaryFontColor">All my patterns</p>
          </Link>
        </div>
        <div className="navigation">
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
            {user?.isAdmin && (
              <div>
                <button
                  className="bodyfont buttonDefault"
                  onClick={handleButtonClick}
                >
                  <div className="">
                    <Add width="16" height="16" color="#FFF" />
                    <span className="">Pattern</span>
                  </div>
                </button>
                <Link to={`/users`}>
                  <p
                    className={`bodyfont secondaryFontColor ${
                      location.pathname === `/users/` ? "active" : ""
                    }`}
                  >
                    All users
                  </p>
                </Link>
              </div>
            )}
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
