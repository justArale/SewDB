import React from "react";
import "./LogInForm.css";

interface LoginFormProps {
  handleLoginSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleEmail: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePassword: (event: React.ChangeEvent<HTMLInputElement>) => void;
  email: string;
  password: string;
  errorMessage?: string;
  onSwitch: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  handleLoginSubmit,
  handleEmail,
  handlePassword,
  email,
  password,
  errorMessage,
  onSwitch,
}) => {
  return (
    <div>
      <p className="mainFont">
        <a href="#" onClick={onSwitch} className="noUnderline hiddenSignUp">
          Sign Up
        </a>
      </p>
      <div className="login">
        <form onSubmit={handleLoginSubmit} className="signup-form">
          <h3 className="headline">Log In</h3>

          <div className="input-group">
            <label htmlFor="email" className="mainFont">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={handleEmail}
              autoComplete="off"
              placeholder="What's your email?"
              className="signUpInput"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="mainFont">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={password}
              onChange={handlePassword}
              autoComplete="off"
              placeholder="••••••••••••••••"
              className="signUpInput"
            />
          </div>

          <button
            type="submit"
            className="buttonFont primaryColor becomePrivateButton"
          >
            Log In
          </button>
        </form>

        {errorMessage && <p className="mainFont">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default LoginForm;
