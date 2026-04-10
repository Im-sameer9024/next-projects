import { PasswordHashed } from "@/shared/helpers/password.helpers";
import { prisma } from "@/shared/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { SendEmail } from "@/shared/helpers/emailsend.helpers";
import { RegistrationSuccessTemplate } from "@/shared/email-templates/usersignup.template";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();

    const username = data.get("username") as string;
    const password = data.get("password") as string;
    const email = data.get("email") as string;

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User already exist",
        },
        {
          status: 400,
        },
      );
    }

    const hashedPassword = await PasswordHashed(password);

    const newUser = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hashedPassword,
      },
    });

    const emailData = {
      username: newUser.username,
      appName: "Mystry Message Team",
    };

    await SendEmail({
      email: newUser.email,
      title: "Registration Successfully",
      body: emailData,
      Template: RegistrationSuccessTemplate,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          email,
          username,
        },
        message: "User Created Successfully",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("Error occur in user sign-up", error);
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
        error: error,
      },
      {
        status: 500,
      },
    );
  }
}
