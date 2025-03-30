"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtom } from "jotai";
import { categoriesAtom, isAdminModeAtom } from "@/lib/atoms";
import { fetchMetadata } from "@/lib/utils";
import { websiteFormSchema } from "@/lib/utils";
import { FormField } from "./form-field";
import { Button } from "@/ui/common/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/common/select";
import { useToast } from "@/hooks/use-toast";
import type { FormInputs } from "@/lib/types";
import { useSettings } from "@/hooks/use-settings";

export function WebsiteForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [categories, setCategories] = useAtom(categoriesAtom);
  const [isAdmin] = useAtom(isAdminModeAtom);
  const { settings } = useSettings();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Ensure categories are loaded
    const loadCategories = async () => {
      try {
        const categoryData = await fetch("/api/categories").then((res) => {
          if (!res.ok) throw new Error("Failed to load categories");
          return res.json();
        });
        setCategories(categoryData.data);
      } catch (error) {
        toast({
          title: "加载分类失败",
          description: "请刷新页面重试",
          variant: "destructive",
        });
      }
    };

    if (categories.length === 0) {
      loadCategories();
    }
  }, [categories.length, setCategories, toast]);

  const form = useForm<FormInputs>({
    resolver: zodResolver(websiteFormSchema),
    defaultValues: {
      title: "",
      url: "",
      description: "",
      category_id: "",
      thumbnail: "",
    },
  });

  const { watch, setValue } = form;
  const url = watch("url");
  const isValidUrl = url && url.startsWith("http");

  const fetchWebsiteMetadata = async () => {
    if (!isValidUrl) return;

    setIsFetching(true);
    try {
      const metadata = await fetchMetadata(url);
      if (metadata.title) setValue("title", metadata.title);
      if (metadata.description) setValue("description", metadata.description);
      if (metadata.image) setValue("thumbnail", metadata.image);

      toast({
        title: "获取成功",
        description: "网站信息已自动填充",
      });
    } catch (error) {
      toast({
        title: "获取元数据失败",
        description: "请手动填写网站信息",
        variant: "destructive",
      });
    } finally {
      setIsFetching(false);
    }
  };

  const onSubmit = async (values: FormInputs) => {
    if (!values.category_id) {
      toast({
        title: "请选择分类",
        description: "网站分类不能为空",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Check if submissions are allowed based on settings
      if (!isAdmin && settings?.allowSubmissions === false) {
        throw new Error("网站提交功能暂时关闭");
      }

      const response = await fetch("/api/websites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error((await response.text()) || "Failed to submit website");
      }

      toast({
        title: "提交成功！",
        description: isAdmin
          ? "网站已添加到已通过列表。"
          : "您的网站已提交审核。",
      });

      router.push(isAdmin ? "/admin" : "/");
      router.refresh();
    } catch (error) {
      toast({
        title: "错误",
        description:
          error instanceof Error ? error.message : "提交失败，请重试。",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      {/* URL Input Group */}
      <div className="space-y-4">
        <FormField
          label="网站地址"
          name="url"
          form={form}
          placeholder="https://example.com"
        />
        <Button
          type="button"
          variant="outline"
          onClick={fetchWebsiteMetadata}
          disabled={!isValidUrl || isFetching || isSubmitting}
          className="w-full bg-background/50 backdrop-blur-sm border-border/40 hover:bg-background/70 hover:border-border/60 transition-all duration-300"
        >
          {isFetching ? "获取中..." : "自动获取网站信息"}
        </Button>
      </div>

      {/* Basic Info */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <FormField
          label="网站标题"
          name="title"
          form={form}
          placeholder="输入网站标题"
        />

        <FormField
          label="网站描述"
          name="description"
          form={form}
          placeholder="描述这个网站"
          textarea
        />
      </motion.div>

      {/* Category Selection */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <label className="block text-sm font-medium mb-2 text-foreground/80">
          分类
        </label>
        <Select
          onValueChange={(value) => setValue("category_id", value)}
          disabled={isSubmitting}
        >
          <SelectTrigger className="w-full bg-background/50 backdrop-blur-sm border-border/40 hover:bg-background/70 hover:border-border/60 transition-all duration-300">
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent className="bg-background/80 backdrop-blur-md border-border/30">
            {categories.map((category: { id: number; name: string }) => (
              <SelectItem
                key={category.id}
                value={category.id.toString()}
                className="hover:bg-primary/10 focus:bg-primary/10"
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {form.formState.errors.category_id && (
          <p className="text-sm text-red-500/70 mt-1">请选择网站分类</p>
        )}
      </motion.div>

      {/* Thumbnail URL */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <FormField
          label="缩略图地址（可选）"
          name="thumbnail"
          form={form}
          placeholder="https://example.com/thumbnail.jpg"
        />
      </motion.div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="pt-4"
      >
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-11 bg-primary/90 hover:bg-primary text-primary-foreground shadow-[0_2px_10px_-3px_rgba(var(--primary),0.3)] transition-all duration-300"
        >
          {isSubmitting ? "提交中..." : "提交网站"}
        </Button>
      </motion.div>
    </form>
  );
}
