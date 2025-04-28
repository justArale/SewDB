import * as React from "react";
import {
  Html,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Button,
  Hr,
} from "@react-email/components";

type VerificationEmailProps = {
  name: string;
  url: string;
};

export const VerificationBody: React.FC<VerificationEmailProps> = ({
  name,
  url,
}) => {
  return (
    <Html lang="en">
      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f4f4f4",
          padding: "20px",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            padding: "40px",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0,0,0,0.05)",
          }}
        >
          {/* Logo or Titel */}
          <Section style={{ textAlign: "center", marginBottom: "30px" }}>
            <Heading
              as="h2"
              style={{ color: "#333", fontSize: "24px", marginBottom: "10px" }}
            >
              Welcome to SewDB
            </Heading>
          </Section>

          {/* Greetings */}
          <Section style={{ marginBottom: "20px" }}>
            <Text style={{ fontSize: "16px", color: "#333" }}>
              Hello {name},
            </Text>
            <Text style={{ fontSize: "16px", color: "#555" }}>
              Thanks for signing up! Please confirm your email address by
              clicking the button below.
            </Text>
          </Section>

          {/* Confirm Button */}
          <Section style={{ textAlign: "center", marginBottom: "30px" }}>
            <Button
              href={url}
              style={{
                backgroundColor: "#007bff",
                color: "#ffffff",
                padding: "14px 24px",
                borderRadius: "6px",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "16px",
                display: "inline-block",
              }}
            >
              Confirm Email
            </Button>
          </Section>

          {/* Spacing */}
          <Hr style={{ borderColor: "#eaeaea", margin: "30px 0" }} />

          {/* Footer */}
          <Section
            style={{ textAlign: "center", fontSize: "12px", color: "#999" }}
          >
            <Text>
              © {new Date().getFullYear()} SewDB. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
