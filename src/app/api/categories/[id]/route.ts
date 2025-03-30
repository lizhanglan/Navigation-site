import { NextResponse } from "next/server";
import type { Category } from "@/lib/types";
import { AjaxResponse } from "@/lib/utils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT: 更新分类
export async function PUT(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const { name, slug } = await request.json();
    const id = parseInt(params.id);

    if (!name || !slug) {
      return NextResponse.json(
        AjaxResponse.fail("Missing required fields: name or slug"),
        { status: 400 }
      );
    }

    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(AjaxResponse.fail("Category not found"), {
        status: 404,
      });
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name, slug },
    });

    return NextResponse.json(AjaxResponse.ok(updatedCategory));
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
}

// DELETE: 删除分类
export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    const id = parseInt(params.id);

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json(AjaxResponse.ok(null));
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(AjaxResponse.fail("删除分类失败"), {
      status: 500,
    });
  }
}
