// root/frontend/src/service/email.service.ts
import axios from "axios";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { VerificationBody } from "../emails/VerificationBody";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8787",
  withCredentials: true,
});

export const sendVerificationEmail = async (to: string, url: string) => {
  try {
    const htmlBody = ReactDOMServer.renderToStaticMarkup(
      React.createElement(VerificationBody, { url })
    );
    ReactDOMServer.renderToStaticMarkup(
      React.createElement(VerificationBody, { url })
    );

    // Send the HTML body to the backend
    await API.post("/api/email/sendVerification", { to, htmlBody });
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};
