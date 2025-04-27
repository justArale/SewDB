import * as React from "react";
import { Html, Button } from "@react-email/components";

type VerificationEmailProps = {
  url: string;
};

export const VerificationBody: React.FC<VerificationEmailProps> = ({ url }) => {
  return (
    <Html>
      <Button
        href={url}
        style={{
          display: "inline-block",
          backgroundColor: "#000",
          color: "#fff",
          padding: "12px 20px",
          textDecoration: "none",
          borderRadius: "4px",
        }}
      >
        Besuche meine Webseite
      </Button>
    </Html>
  );
};
