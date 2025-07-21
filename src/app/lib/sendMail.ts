import { smtpTransport } from "./mailTransport";

export const sendMail = async ({
  from,
  to,
  subject,
  html,
}: {
  from: string;
  to: string;
  subject: string;
  html: string;
}) => {
  let mailOptions = { from, to, subject, html };
  await smtpTransport.sendMail(mailOptions);
};