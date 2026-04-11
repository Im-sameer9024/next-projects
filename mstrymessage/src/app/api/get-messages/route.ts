import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from "@/shared/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const user = session?.user as User;

    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          message: "UnAuthorized",
        },
        {
          status: 401,
        },
      );
    }

    const userId = user?.id;

    const userMessages = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        messages: true,
      },
    });

    if (!userMessages) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: userMessages,
      },
      {
        status: 200,
      },
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
