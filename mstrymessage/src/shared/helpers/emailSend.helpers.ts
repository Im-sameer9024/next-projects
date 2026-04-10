/* eslint-disable @typescript-eslint/no-explicit-any */
import { resend } from "../lib/resend";

type SendEmailProps = {
  email: string;
  title: string;
  body: any;
  Template: any;
};

export const SendEmail = async ({
  email,
  title,
  body,
  Template,
}: SendEmailProps) => {
  try {
    const data = await resend.emails.send({
      from: "Mystry Message | <mstrymessage@gmail.com>",
      to: [email],
      subject: title,
      react: Template(body),
    });

    return data;
  } catch (error) {
    console.log("Error in SendEmail function ",error)
    return error;
  }
};
