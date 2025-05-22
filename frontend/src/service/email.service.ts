// root/frontend/src/service/email.service.ts
import axios from "axios";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { VerificationBody } from "../emails/VerificationBody";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8787",
  withCredentials: true,
});

export const sendVerificationEmail = async (
  name: string,
  email: string,
  url: string,
  verifyToken: string
) => {
  try {
    const htmlBody = ReactDOMServer.renderToStaticMarkup(
      React.createElement(VerificationBody, { name, url })
    );

    // Send the HTML body to the backend
    const response = await API.post(
      "/auth/email/sendVerification",
      { email, htmlBody },
      { headers: { Authorization: `Bearer ${verifyToken}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
};
