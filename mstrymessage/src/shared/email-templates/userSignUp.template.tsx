import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Heading,
} from "@react-email/components";

type RegistrationSuccessEmailProps = {
  body: {
    username: string;
    appName?: string;
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
    textAlign: "center" as const,
  },
  heading: {
    fontSize: "22px",
    marginBottom: "20px",
  },
  text: {
    fontSize: "14px",
    margin: "10px 0",
  },
  ctaSection: {
    margin: "25px 0",
  },
  button: {
    backgroundColor: "#000",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "5px",
    textDecoration: "none",
    fontSize: "14px",
  },
  footer: {
    fontSize: "12px",
    color: "#888",
    marginTop: "20px",
  },
};

export const RegistrationSuccessTemplate = ({
  body,
}: RegistrationSuccessEmailProps) => {
  return (
    <Html lang="en">
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>
            🎉 Welcome to {body.appName}!
          </Heading>

          <Text style={styles.text}>Hi {body.username},</Text>

          <Text style={styles.text}>
            Your account has been successfully created. We&#39;re excited to
            have you onboard 🚀
          </Text>

          <Text style={styles.text}>
            You can now log in and start exploring all the features we offer.
          </Text>

          <Text style={styles.text}>
            If you have any questions, feel free to reach out to our support
            team anytime.
          </Text>

          <Text style={styles.footer}>— {body.appName} Team</Text>
        </Container>
      </Body>
    </Html>
  );
};
