import { atomWithStorage } from "jotai/utils";
import type { Website, Category, FooterSettings, Setting } from "@/lib/types";
// 使用 atomWithStorage 来持久化存储设置
export const websitesAtom = atomWithStorage<Website[]>("websites", []);
export const categoriesAtom = atomWithStorage<Category[]>("categories", []);
export const searchQueryAtom = atomWithStorage<string>("searchQuery", "");
export const selectedCategoryAtom = atomWithStorage<number | null>("selectedCategory", null);
export const isAdminModeAtom = atomWithStorage<boolean>("isAdminMode", false);
export const isCompactModeAtom = atomWithStorage<boolean>("isCompactMode", true);
export const recentlyVisitedAtom = atomWithStorage<Website[]>("recentlyVisited", []);
export const favoritesAtom = atomWithStorage<Website[]>("favorites", []);

// OSS 设置
export interface OSSSettings {
  provider: string;
  region: string;
  bucket: string;
  accessKeyId: string;
  accessKeySecret: string;
  endpoint: string;
}

export const ossSettingsAtom = atomWithStorage<OSSSettings>("ossSettings", {
  provider: "aliyun",
  region: "oss-cn-hangzhou",
  bucket: "",
  accessKeyId: "",
  accessKeySecret: "",
  endpoint: "",
});

export const footerSettingsAtom = atomWithStorage<FooterSettings>("footerSettings", {
  copyright: "© 2024 网站导航",
  icpBeian: "京ICP备XXXXXXXX号",
  links: [],
  customHtml: "",
});
