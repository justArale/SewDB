import React from "react";

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
      <div className="access">
        <form onSubmit={handleLoginSubmit} className="accessForm">
          <h3 className="bodyfontLarge">Log In</h3>

          <div className="input-group">
            <label htmlFor="email" className="bodyfont secondaryFontColor">
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
              className="accessInput"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password" className="bodyfont secondaryFontColor">
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
              className="accessInput"
            />
          </div>

          <button type="submit" className="buttonfont buttonSave">
            Log In
          </button>
          <p className="bodyfont secondaryFontColor">
            Don’t have an account?{" "}
            <a
              href="#"
              onClick={onSwitch}
              className="noUnderline secondaryFontColor"
            >
              Sign Up
            </a>
          </p>
        </form>

        {errorMessage && <p className="bodyfont">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default LoginForm;
