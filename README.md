# 🧵 SewDB – React/HONC Fullstack App

## Description

SewDB is a private, full-stack web application for managing and browsing sewing patterns. It was developed as a personal project to explore the HONC stack — a modern, serverless architecture combining Hono, Neon, and Drizzle — which I first encountered during a hackathon.

The platform allows authenticated users to view, search, and manage sewing patterns. Features include protected routes, user authentication (secure HTTP-only cookies), role-based access control, and a responsive image carousel. The application is built with TypeScript on both the frontend (React + Vite) and backend, and integrates services like Cloudinary for image handling.

SewDB serves as both a practical tool for organizing creative work and a demonstration of modern full-stack development practices using lightweight, scalable technologies.

## 📚 Table of Contents

- [Features](#features)
- [Dependencies](#dependencies)
- [Planned Features](#planned-features)
- [License](#license)

## 🚀 Features

- **🔒 Protected Routes** – Authenticated access required to view patterns.
- **👤 User Authentication** – Signup, login, logout with secure, HTTP-only cookies.
- **🛡️ Role-Based Access Control** – Admins can create, update, and delete entries.
- **🧵 Pattern Catalog** – Users can browse, search, and like/unlike sewing patterns.
- **🖼️ Pattern Details View** – Carousel with detailed pattern information.
- **🍪 Secure Session Handling** – JWT-based authentication via server-side middleware.
- **📩 Email Verification** – Users must confirm their email after signup.
- **☁️ Cloudinary Integration** – Image uploads and transformations handled via Cloudinary.
- **📜 Infinite Scroll** – Patterns load automatically as the user scrolls down, improving performance and user experience.

## 🛠️ Dependencies

#### Frontend

- **React**: TypeScript library for building user interfaces
- **React Router**: Library for handling routing in React applications
- **Axios**: Promise-based HTTP client for making restfull API requests
- **Icon Library**: For reusable custom vector-based UI icons from a library I developed
- **SASS**: CSS preprocessor for modular styling
- **Resend**: Email API used for sending verification emails

#### Backend

🪿 HONC - The backend of this project is created with the `create-honc-app` template and TypeScript and deployed with Cloudflare Workers.

Learn more about the HONC stack on the [website](https://honc.dev) or the main [repo](https://github.com/fiberplane/create-honc-app).

## 🪡 Planned Features

- **Advanced Filtering** – Users will be able to filter patterns by category, sizes, and intended-for attributes using query parameters.
- **User Profile Management** – Users will be able to update their account details (email, password) from a dedicated profile page.

## 📄 License

This project is licensed under the [MIT License](https://github.com/justArale/SewDB/blob/main/LICENSE).
