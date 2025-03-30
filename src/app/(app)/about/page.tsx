import { Metadata } from "next";
import { Card, CardContent } from "@/ui/common/card";
import {
  Brain,
  Globe,
  Download,
  Plus,
  Trophy,
  Search,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Button } from "@/ui/common/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "关于 科研 导航",
  description: "科研导航是一个帮助用户发现、分享和收藏优质科研工具与资源的平台。",
};

export default function AboutPage() {
  const features = [
    {
      icon: <Globe className="h-6 w-6" />,
      title: "发现工具",
      description: "精选优质科研工具和资源，帮助你找到最适合的科研解决方案",
    },
    {
      icon: <Plus className="h-6 w-6" />,
      title: "分享收藏",
      description: "发现好用的科研工具？一键分享给大家，收藏喜欢的工具",
    },
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "实时排行",
      description: "实时更新的科研工具排行榜，发现最受欢迎的科研产品",
    },
    {
      icon: <Search className="h-6 w-6" />,
      title: "智能搜索",
      description: "强大的搜索功能，快速找到你需要的科研工具",
    },
  ];

  const steps = [
    {
      icon: <Download className="h-5 w-5" />,
      title: "安装助手",
      description: "安装浏览器扩展和科研导航助手脚本，一键采集科研工具信息",
      action: (
        <Link href="/scripts/科研-nav-collector.user.js">
          <Button
            variant="outline"
            size="sm"
            className="mt-2 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-shine animate-background-shine" />
            <Download className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
            安装脚本
          </Button>
        </Link>
      ),
    },
    {
      icon: <Plus className="h-5 w-5" />,
      title: "提交工具",
      description: "发现好用的科研工具？点击提交按钮或使用助手快速分享",
      action: (
        <Link href="/submit">
          <Button
            variant="outline"
            size="sm"
            className="mt-2 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-shine animate-background-shine" />
            <Plus className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
            提交网站
          </Button>
        </Link>
      ),
    },
    {
      icon: <Search className="h-5 w-5" />,
      title: "发现使用",
      description: "通过搜索、分类、排行榜发现并使用优质科研工具",
      action: (
        <Link href="/">
          <Button
            variant="outline"
            size="sm"
            className="mt-2 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-shine animate-background-shine" />
            <Search className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
            开始探索
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background/50 relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="cont科研ner px-4 py-16 sm:py-24 mx-auto text-center">
          <div className="relative inline-flex flex-col items-center">
            <div className="relative">
              <Brain className="h-14 w-14 sm:h-16 sm:w-16 text-primary animate-float" />
              <div className="absolute inset-0 bg-primary/20 blur-2xl -z-10 animate-pulse [animation-duration:4s]" />
            </div>
            <div className="mt-8 sm:mt-10 space-y-4">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70 animate-fade-up [animation-delay:400ms] px-4">
                发现优质 科研 工具的最佳平台
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground/90 max-w-2xl mx-auto animate-fade-up [animation-delay:800ms] leading-relaxed px-4">
                科研导航致力于帮助用户发现、分享和收藏优质的科研工具与资源，让你的科研之旅更轻松。
              </p>
            </div>
          </div>
        </div>
        {/* Background Effect */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-gradient-flow opacity-30" />
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-12 sm:py-20 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden backdrop-blur-sm border-border/30 bg-background/30 hover:shadow-lg transition-all duration-500 hover:-translate-y-1"
              style={{ animationDelay: `${(index + 1) * 200}ms` }}
            >
              <CardContent className="p-5 sm:p-6">
                <div className="flex sm:block items-center sm:items-start gap-4 sm:gap-0">
                  <div className="flex-shrink-0 text-primary">
                    <div className="relative inline-flex p-2 rounded-xl bg-primary/10 group-hover:bg-primary/15 transition-colors duration-500">
                      {feature.icon}
                      <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </div>
                  <div className="min-w-0 sm:mt-4">
                    <h3 className="text-base sm:text-lg font-semibold mb-1.5 sm:mb-2 group-hover:text-primary transition-colors duration-500">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground/80 group-hover:text-muted-foreground transition-colors duration-500 line-clamp-2 sm:line-clamp-none">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Steps Section */}
      <section className="container px-4 py-12 sm:py-20 mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative p-5 sm:p-6 rounded-xl border border-border/30 bg-background/30 backdrop-blur-sm animate-fade-up hover:shadow-lg transition-all duration-500"
              style={{ animationDelay: `${(index + 1) * 300}ms` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 relative flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors duration-500">
                  {step.icon}
                  <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-base sm:text-lg font-semibold group-hover:text-primary transition-colors duration-500">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground/80 group-hover:text-muted-foreground transition-colors duration-500">
                    {step.description}
                  </p>
                </div>
              </div>
              <div className="ml-14">{step.action}</div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 left-[calc(100%+0.5rem)] w-4 border-t border-dashed border-border/50">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-glow-line-horizontal" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="container px-4 py-16 sm:py-24 mx-auto text-center border-t border-border/40">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">
            桂警院智警研究协会
          </h2>
          <p className="text-base text-muted-foreground/90 mb-8 sm:mb-10 px-4">
            加入我们，一起探索科研的无限可能！
          </p>
          <a
            href="https://www.gxjcxy.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary/10 hover:bg-primary/15 text-primary transition-colors duration-500 group"
          >
            <span className="text-sm sm:text-base font-medium">
              访问广西警察学院官网
            </span>
            <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-500" />
          </a>
        </div>
      </section>
    </div>
  );
}
