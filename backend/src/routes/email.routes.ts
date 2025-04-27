// root/backend/src/routes/email.routes.ts
import { Hono } from "hono";
import { Bindings } from "../bindings";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const emailRouter = new Hono<{ Bindings: Bindings }>();

emailRouter.post("/email/sendVerification", async (c) => {
  const { to, htmlBody } = await c.req.json<{ to: string; htmlBody: string }>();

  if (!to || !htmlBody) {
    return c.json({ message: "Missing parameters" }, 400);
  }
  console.log("backend-Sending email to:", to);
  console.log("backend-Email URL:", htmlBody);
  try {
    await resend.emails.send({
      from: c.env.EMAIL_FROM,
      to,
      subject: "Bitte teste diesen Link",
      html: htmlBody,
    });
    return c.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return c.json({ message: "Error sending email" }, 500);
  }
});

export default emailRouter;
