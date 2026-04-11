import { prisma } from "@/shared/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { username, content } = await req.json();

    if (!username || !content) {
      return NextResponse.json(
        { message: "Username and content are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (!user.isAcceptingMessage) {
      return NextResponse.json(
        { message: "User is not accepting messages" },
        { status: 403 }
      );
    }

    const message = await prisma.message.create({
      data: {
        content,
        user: { connect: { id: user.id } },
      },
    });

    return NextResponse.json(
      { message: "Message created successfully", data: message },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
