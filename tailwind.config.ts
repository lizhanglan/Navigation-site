import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 扩展 Tailwind 的默认颜色系统
      // 使用 CSS 变量和 HSL 颜色格式实现动态主题
      colors: {
        // 基础界面颜色
        border: "hsl(var(--border))", // 边框颜色
        input: "hsl(var(--input))", // 输入框边框颜色
        ring: "hsl(var(--ring))", // 焦点环颜色
        background: "hsl(var(--background))", // 背景色
        foreground: "hsl(var(--foreground))", // 前景色（主要文本色）

        // 主要强调色，用于主要按钮、重要元素等
        primary: {
          DEFAULT: "hsl(var(--primary))", // 主色调
          foreground: "hsl(var(--primary-foreground))", // 在主色调背景上的文本颜色
        },

        // 次要强调色，用于次要按钮、次要元素等
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },

        // 破坏性操作颜色，用于删除、警告等
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },

        // 柔和的界面元素颜色，用于不需要强调的内容
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },

        // 强调色，用于高亮或特殊元素
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },

        // 弹出层颜色
        popover: {
          DEFAULT: "hsl(var(--popover))", // 弹出框背景色
          foreground: "hsl(var(--popover-foreground))", // 弹出框文本色
        },

        // 卡片颜色
        card: {
          DEFAULT: "hsl(var(--card))", // 卡片背景色
          foreground: "hsl(var(--card-foreground))", // 卡片文本色
        },
      },

      // 扩展圆角半径系统
      // 使用 CSS 变量实现一致的圆角样式
      borderRadius: {
        lg: "var(--radius)", // 大圆角
        md: "calc(var(--radius) - 2px)", // 中等圆角
        sm: "calc(var(--radius) - 4px)", // 小圆角
      },
    },
  },
  plugins: [],
  darkMode: "class", // 使用 class 策略来控制暗色模式
} satisfies Config;
