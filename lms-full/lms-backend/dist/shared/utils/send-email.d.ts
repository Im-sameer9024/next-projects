interface SendEmailProps {
    email: string;
    title: string;
    body: string;
}
export declare const SendEmail: ({ email, title, body }: SendEmailProps) => Promise<import("nodemailer/lib/smtp-pool").SentMessageInfo>;
export {};
//# sourceMappingURL=send-email.d.ts.map