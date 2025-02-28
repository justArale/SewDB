import React from "react";
const imgURL =
  "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbno3cmxtYWQyeXU0MWlvcThpdndiMnh3MXY0am83emx1NzcwdWE3OCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/C21GGDOpKT6Z4VuXyn/giphy.gif";

const ErrorPage: React.FC = () => {
  return (
    <div>
      <img src={imgURL} alt="404 error gif" className="page-img" />
    </div>
  );
};

export default ErrorPage;
