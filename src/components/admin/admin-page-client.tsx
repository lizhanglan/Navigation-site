"use client";

import { useState } from "react";
import { WebsiteList } from "@/components/admin/website-list";
import { Button } from "@/ui/common/button";
import { Badge } from "@/ui/common/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/common/select";
import { Tabs, TabsList, TabsTrigger } from "@/ui/common/tabs";
import type { Website } from "@/lib/types";
import Link from "next/link";
import { motion } from "framer-motion";
import { Settings, ListFilter } from "lucide-react";
import { cn } from "@/lib/utils/utils";

export function AdminPageClient({
  initialWebsites,
  initialCategories,
}: {
  initialWebsites: Website[];
  initialCategories: any[];
}) {
  const [activeStatus, setActiveStatus] =
    useState<Website["status"]>("pending");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  if (!initialWebsites || !Array.isArray(initialWebsites)) return null;
  if (!initialCategories || !Array.isArray(initialCategories)) return null;

  const filteredWebsites = initialWebsites.filter((website) => {
    const matchesStatus = website.status === activeStatus;
    const matchesCategory =
      selectedCategory === "all" ||
      website.category_id === parseInt(selectedCategory);
    return matchesStatus && matchesCategory;
  });

  const statusCounts = {
    pending: initialWebsites.filter((w) => w.status === "pending").length,
    approved: initialWebsites.filter((w) => w.status === "approved").length,
    rejected: initialWebsites.filter((w) => w.status === "rejected").length,
  };

  const getStatusColor = (status: Website["status"]) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "approved":
        return "text-green-500";
      case "rejected":
        return "text-red-500";
      default:
        return "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 min-h-[calc(100vh-4rem)] space-y-6"
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-background/30 backdrop-blur-sm p-6 rounded-xl border border-border/40">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
            后台管理
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            管理网站内容和系统设置
          </p>
        </div>
        <Tabs defaultValue="websites" className="w-full sm:w-auto">
          <TabsList className="grid w-full sm:w-auto grid-cols-2 bg-background/50">
            <TabsTrigger
              value="websites"
              className="flex items-center gap-2 data-[state=active]:bg-background/60"
            >
              <ListFilter className="w-4 h-4" />
              网站管理
            </TabsTrigger>
            <TabsTrigger value="settings" asChild>
              <Link href="/admin/settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                系统设置
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Main Content */}
      <div className="rounded-xl border border-border/40 bg-background/30 shadow-sm overflow-hidden backdrop-blur-sm">
        {/* Filter Section */}
        <div className="border-b border-border/40 bg-background/20 p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex flex-wrap gap-2 flex-1">
              {["pending", "approved", "rejected"].map((status) => (
                <motion.button
                  key={status}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveStatus(status as Website["status"])}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200
                    ${
                      activeStatus === status
                        ? "bg-background/40 border-primary/30 shadow-sm " +
                          getStatusColor(status as Website["status"])
                        : "bg-background/20 border-border/40 hover:border-border/60 text-muted-foreground hover:text-foreground"
                    }
                  `}
                >
                  <span className="text-sm font-medium">
                    {status === "pending"
                      ? "待审核"
                      : status === "approved"
                      ? "已通过"
                      : "已拒绝"}
                  </span>
                  <Badge
                    variant={activeStatus === status ? "secondary" : "outline"}
                    className={cn(
                      "ml-1 bg-background/50",
                      activeStatus === status &&
                        getStatusColor(status as Website["status"])
                    )}
                  >
                    {statusCounts[status as keyof typeof statusCounts]}
                  </Badge>
                </motion.button>
              ))}
            </div>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-full sm:w-[180px] bg-background/40 border-border/40">
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent
                align="end"
                className="bg-background/95 backdrop-blur-sm"
              >
                <SelectItem value="all">全部分类</SelectItem>
                {initialCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Website List */}
        <div className="bg-background/20">
          <WebsiteList
            key={`${activeStatus}-${selectedCategory}`}
            websites={filteredWebsites}
            categories={initialCategories}
            showActions={true}
          />
        </div>
      </div>
    </motion.div>
  );
}
