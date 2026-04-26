import { PasswordHashed } from "@/shared/helpers/password.helper";
import { prisma } from "@/shared/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { Role } from "../../../../generated/prisma/enums";
import { validate } from "@/shared/middleware/validation.middleware";
import {
  SignUpSchemaValidation,
  SignUpSchemaValidationTypes,
} from "@/shared/validation/auth.validation";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();

    const userData = {
      name: (data.get("name") as string)?.trim(),
      password: data.get("password") as string,
      email: (data.get("email") as string)?.trim().toLowerCase(),
      role: data.get("role") as string,
    };

    const validateData = validate(SignUpSchemaValidation, userData);

    if (!validateData.success) {
      return NextResponse.json(
        {
          success: false,
          errors: validateData.errors,
        },
        {
          status: 400,
        },
      );
    }

    const { email, password, role, name } =
      validateData.data as SignUpSchemaValidationTypes;

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email.toLowerCase(),
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

    const actualRole = role === "teacher" ? Role.TEACHER : Role.USER;

    // 🔥 Avatar seed
    const seed = name.split(" ")[0] || "Guest";

    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${seed}`;

    const newUser = await prisma.user.create({
      data: {
        name: name?.trim(),
        email: email.toLowerCase(),
        password: hashedPassword,
        role: actualRole,
        image: avatarUrl,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "User created",
        data: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
        },
      },
      { status: 201 },
    );
  } catch (error) {
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
