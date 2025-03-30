import * as z from "zod";

export const websiteFormSchema = z.object({
  title: z
    .string()
    .min(2, "标题至少需要2个字符")
    .max(100, "标题不能超过100个字符"),
  url: z.string().url("请输入有效的网址"),
  description: z
    .string()
    .min(10, "描述至少需要10个字符")
    .max(500, "描述不能超过500个字符"),
  category_id: z.string().min(1, "请选择分类"),
  thumbnail: z.string().url("请输入有效的图片地址").optional(),
});

