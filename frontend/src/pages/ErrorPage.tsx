import React from "react";

const ErrorPage: React.FC = () => {
  return (
    <div className="componentBox">
      <h4 className="pagetitle">Oops, Wrong Turn ...</h4>
      <p className="bodyfont">
        Lost in the pattern maze? This page doesn’t seem to exist, but there are
        plenty of designs waiting for you. Let’s get you back.
      </p>
      <button className="buttonAction labelfont">Back to Home</button>
    </div>
  );
};

export default ErrorPage;
