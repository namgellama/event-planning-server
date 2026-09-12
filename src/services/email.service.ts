import { env } from "../config/env.js";
import { transporter } from "../config/nodemailer.js";

export async function sendEmail({
    to,
    subject,
    html,
    text,
}: {
    to: string;
    subject: string;
    html?: string;
    text?: string;
}) {
    const info = await transporter.sendMail({
        from: `"Gather" <${env.SMTP_FROM}>`,
        to,
        subject,
        text,
        html,
    });

    return info;
}
