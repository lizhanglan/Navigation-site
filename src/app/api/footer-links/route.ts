import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/db";
import { AjaxResponse } from "@/lib/utils";

// 获取所有页脚链接
export async function GET() {
  try {
    const links = await prisma.footerLink.findMany({
      select: {
        title: true,
        url: true,
      },
      orderBy: {
        created_at: "asc",
      },
    });
    return NextResponse.json(AjaxResponse.ok(links));
  } catch (error) {
    return NextResponse.json(AjaxResponse.fail("获取页脚链接失败"));
  }
}

// 创建新的页脚链接
export async function POST(request: Request) {
  try {
    const { title, url } = await request.json();

    if (!title || !url) {
      return NextResponse.json(AjaxResponse.fail("标题和URL都是必需的"));
    }

    // 验证 URL 格式
    try {
      new URL(url);
    } catch (e) {
      return NextResponse.json(AjaxResponse.fail("请输入有效的URL地址"));
    }

    const link = await prisma.footerLink.create({
      data: {
        title,
        url,
      },
    });

    return NextResponse.json(AjaxResponse.ok(link));
  } catch (error) {
    if ((error as any).code === "P2002") {
      return NextResponse.json(AjaxResponse.fail("该URL已存在"));
    }
    return NextResponse.json(AjaxResponse.fail("创建页脚链接失败"));
  }
}

// 更新页脚链接
export async function PUT(request: Request) {
  try {
    const { id, title, url } = await request.json();

    if (!id || !title || !url) {
      return NextResponse.json(AjaxResponse.fail("ID、标题和URL都是必需的"));
    }

    const link = await prisma.footerLink.update({
      where: { id },
      data: {
        title,
        url,
      },
    });

    return NextResponse.json(AjaxResponse.ok(link));
  } catch (error) {
    if ((error as any).code === "P2025") {
      return NextResponse.json(AjaxResponse.fail("链接不存在"));
    }
    return NextResponse.json(AjaxResponse.fail("更新页脚链接失败"));
  }
}

// 删除页脚链接
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(AjaxResponse.fail("缺少ID参数"));
    }

    await prisma.footerLink.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(AjaxResponse.ok("success"));
  } catch (error) {
    if ((error as any).code === "P2025") {
      return NextResponse.json(AjaxResponse.fail("链接不存在"));
    }
    return NextResponse.json(AjaxResponse.fail("删除页脚链接失败"));
  }
}
