import { getServerSession, User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { prisma } from "@/shared/lib/prisma";

export async function POST(req: NextRequest) {
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

    const { acceptMessages } = await req.json();

    // ✅ Update the user directly
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isAcceptingMessage: acceptMessages },
    });

    return NextResponse.json(
      {
        success: true,
        message: "User accept message status updated successfully",
        user: updatedUser,
      },
      { status: 200 },
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

    const currentUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!currentUser) {
      return NextResponse.json(
        {
          success: true,
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
        data: {
          isAcceptingMessage: currentUser.isAcceptingMessage,
        },
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
