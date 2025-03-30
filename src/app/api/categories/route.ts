import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { AjaxResponse } from "@/lib/utils";

const prisma = new PrismaClient();

// GET: 查询所有分类
export async function GET() {
  try {
    const categories = await prisma.category.findMany();
    return NextResponse.json(AjaxResponse.ok(categories));
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(AjaxResponse.fail("获取分类数据失败"), {
      status: 500,
    });
  }
}

// POST: 创建新分类
export async function POST(request: Request) {
  try {
    const { name, slug } = await request.json();
    const newCategory = await prisma.category.create({
      data: { name, slug },
    });
    return NextResponse.json(AjaxResponse.ok(newCategory));
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(AjaxResponse.fail("创建分类失败"), {
      status: 500,
    });
  }
}
