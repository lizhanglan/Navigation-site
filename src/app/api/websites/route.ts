import { NextResponse } from "next/server";
import type { Website } from "@/lib/types";
import { AjaxResponse } from "@/lib/utils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/websites
// 获取所有指定分类的网站
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status =
    (searchParams.get("status") as Website["status"]) || "approved";
  const websites = await prisma.website.findMany({
    where: { status: status === "all" ? undefined : status },
  });
  return NextResponse.json(AjaxResponse.ok(websites));
}

// POST /api/websites
// 创建网站
export async function POST(request: Request) {
  if (!request.body) {
    return NextResponse.json(AjaxResponse.fail("Request body is required"), {
      status: 400,
    });
  }

  try {
    const data = await request.json();

    // Validate required fields
    if (!data.title || !data.url || !data.category_id) {
      return NextResponse.json(
        AjaxResponse.fail(
          "Missing required fields: title, url, or category_id"
        ),
        { status: 400 }
      );
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: Number(data.category_id) },
    });

    if (!category) {
      return NextResponse.json(AjaxResponse.fail("Category does not exist"), {
        status: 400,
      });
    }

    console.log(data);

    // Check if URL already exists
    const existingWebsite = await prisma.website.findFirst({
      where: { url: data.url },
    });

    if (existingWebsite) {
      return NextResponse.json(AjaxResponse.fail("URL already exists"), {
        status: 400,
      });
    }

    // Validate URL format
    try {
      new URL(data.url);
    } catch (error) {
      return NextResponse.json(AjaxResponse.fail("Invalid URL format"), {
        status: 400,
      });
    }

    // 将图片转换为base64
    const image = await fetch(data.thumbnail);
    const imageBuffer = await image.arrayBuffer();
    const imageBase64 = `data:${image.headers.get(
      "content-type"
    )};base64,${Buffer.from(imageBuffer).toString("base64")}`;

    const website = await prisma.website.create({
      data: {
        title: data.title.trim(),
        url: data.url.trim(),
        description: data.description?.trim() || "",
        category_id: Number(data.category_id),
        thumbnail: data.thumbnail?.trim() || "",
        status: data.status || "pending",
        thumbnail_base64: imageBase64 as string,
      },
    });

    return NextResponse.json(AjaxResponse.ok(website));
  } catch (error) {
    console.error("Failed to create website:", error);
    return NextResponse.json(AjaxResponse.fail("Failed to create website"), {
      status: 500,
    });
  }
}
