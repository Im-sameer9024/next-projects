import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Heading,
  Section,
} from "@react-email/components";

type VerificationEmailProps = {
  body: {
    email: string;
    username: string;
    verifyCode: string;
  };
};

const styles = {
  body: {
    backgroundColor: "#f6f9fc",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "400px",
  },
  heading: {
    fontSize: "20px",
    marginBottom: "20px",
  },
  text: {
    fontSize: "14px",
    margin: "10px 0",
  },
  otpBox: {
    textAlign: "center" as const,
    margin: "20px 0",
  },
  otp: {
    fontSize: "24px",
    fontWeight: "bold",
    letterSpacing: "4px",
  },
  footer: {
    fontSize: "12px",
    color: "#888",
    marginTop: "20px",
  },
};

export const CodeVerificationTemplate = ({ body }: VerificationEmailProps) => {
  return (
    <Html lang="en">
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>
            Email Verification {body.email}
          </Heading>

          <Text style={styles.text}>Hello {body.username},</Text>

          <Text style={styles.text}>Your OTP for verification is:</Text>

          <Section style={styles.otpBox}>
            <Text style={styles.otp}>{body.verifyCode}</Text>
          </Section>

          <Text style={styles.text}>
            This OTP is valid for 5 minutes. Do not share it with anyone.
          </Text>

          <Text style={styles.footer}>— Your Team</Text>
        </Container>
      </Body>
    </Html>
  );
};
