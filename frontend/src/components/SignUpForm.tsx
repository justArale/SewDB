import React from "react";

type SignUpFormProps = {
  handleSignupSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleEmail: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePassword: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  email: string;
  password: string;
  name: string;
  errorMessage?: string;
  onSwitch: () => void;
  formStatus: string;
};

const SignUpForm: React.FC<SignUpFormProps> = ({
  handleSignupSubmit,
  handleEmail,
  handlePassword,
  handleName,
  email,
  password,
  name,
  errorMessage,
  onSwitch,
  formStatus,
}) => {
  return (
    <div className="access">
      <form onSubmit={handleSignupSubmit} className="accessForm">
        <h3 className="bodyfontLarge">Sign Up</h3>
        <div className="input-group">
          <label htmlFor="name" className="bodyfont secondaryFontColor">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={handleName}
            autoComplete="off"
            className="accessInput"
            placeholder="What's your name?"
          />
        </div>

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
            className="accessInput"
            placeholder="What's your email?"
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

        <button
          type="submit"
          className="buttonfont buttonSave"
          disabled={formStatus === "loading" || formStatus === "success"}
        >
          {formStatus === "loading"
            ? "Sending verification email..."
            : formStatus === "success"
              ? "Email sent!"
              : formStatus === "error"
                ? "Try again"
                : "Create Account"}
        </button>
        <p className="bodyfont secondaryFontColor">
          Already have an account?{" "}
          <a
            href="#"
            onClick={onSwitch}
            className="bodyfont secondaryFontColor"
          >
            Log In
          </a>
        </p>
      </form>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default SignUpForm;
