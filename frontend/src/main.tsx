// import "./index.css";
import "./assets/sass/main.sass";
import App from "./App.tsx";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthContextWrapper } from "./context/auth.context.tsx";
import { LikedPatternWrapper } from "./context/likedPatterns.context.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <AuthContextWrapper>
        <LikedPatternWrapper>
          <App />
        </LikedPatternWrapper>
      </AuthContextWrapper>
    </Router>
  </React.StrictMode>
);
