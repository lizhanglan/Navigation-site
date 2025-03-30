import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { AjaxResponse } from "@/lib/utils";

const prisma = new PrismaClient();

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { status } = await request.json();
    const websiteId = parseInt(params.id);

    if (isNaN(websiteId)) {
      return NextResponse.json(AjaxResponse.fail("Invalid website ID"), {
        status: 400,
      });
    }

    const website = await prisma.website.findUnique({
      where: { id: websiteId },
    });

    if (!website) {
      return NextResponse.json(AjaxResponse.fail("Website not found"), {
        status: 404,
      });
    }

    await prisma.website.update({
      where: { id: websiteId },
      data: { status },
    });

    return NextResponse.json(AjaxResponse.ok("Status updated"));
  } catch (error) {
    console.error("Failed to update website status:", error);
    return NextResponse.json(AjaxResponse.fail("Failed to update status"), {
      status: 500,
    });
  }
}
