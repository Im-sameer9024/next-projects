import { Roles } from "@/shared/data/data";
import { auth } from "@/shared/lib/auth";
import { prisma } from "@/shared/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ attachmentId: string }> },
) {
  try {
    const { attachmentId } = await params;

    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const user = session.user;

    if (user.role !== Roles.teacher) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId },
    });

    if (!attachment) {
      return NextResponse.json(
        { success: false, message: "Attachment not found" },
        { status: 404 },
      );
    }

    // Ensure the attachment belongs to a course owned by the user
    const course = await prisma.course.findUnique({
      where: { id: attachment.courseId },
    });

    if (!course || course.userId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        },
      );
    }

   const deleteAttachment =  await prisma.attachment.delete({
      where: { id: attachmentId },
    });

    return NextResponse.json(
      {
        success: true,
        data:deleteAttachment,
        message: "Attachment deleted successfully",
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error deleting attachment:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      },
    );
  }
}
