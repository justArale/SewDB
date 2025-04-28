// root/backend/src/routes/email.routes.ts
import { Hono } from "hono";
import { Bindings } from "../bindings";
import { Resend } from "resend";

const emailRouter = new Hono<{ Bindings: Bindings }>();

const getResendApiKey = (RESEND_API_KEY: string) => new Resend(RESEND_API_KEY);

emailRouter.post("/email/sendVerification", async (c) => {
  const { email, htmlBody } = await c.req.json<{
    email: string;
    htmlBody: string;
  }>();
  const resend = getResendApiKey(c.env.RESEND_API_KEY);

  if (!email || !htmlBody) {
    return c.json({ message: "Missing parameters" }, 400);
  }

  try {
    await resend.emails.send({
      from: c.env.EMAIL_FROM,
      to: email,
      subject: "Confirm Your Email Address",
      html: htmlBody,
      tags: [
        {
          name: "category",
          value: "confirm_email",
        },
      ],
    });
    return c.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return c.json({ message: "Error sending email" }, 500);
  }
});

export default emailRouter;
