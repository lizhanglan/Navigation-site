import { prisma } from '../../lib/prisma';
import type { Prisma, PrismaClient, Category } from '@prisma/client';
import { WebsiteSettings } from '../constraint';
import * as fs from 'fs';
import * as path from 'path';

const defaultCategories = [
  { name: 'AI 聊天', slug: 'ai-chat' },
  { name: 'AI 绘画', slug: 'ai-art' },
  { name: 'AI 写作', slug: 'ai-writing' },
  { name: 'AI 编程', slug: 'ai-coding' },
  { name: 'AI 工具', slug: 'ai-tools' },
  { name: '大语言模型', slug: 'llm' },
];

interface WebsiteInput {
  title: string;
  url: string;
  description: string;
  category_slug: string;
  thumbnail: string;
  status: 'pending' | 'approved' | 'rejected';
}

const defaultWebsites = [
  {
    title: 'ChatGPT',
    url: 'https://chat.openai.com',
    description: 'OpenAI 开发的 AI 聊天助手，能够进行自然对话并协助完成各种任务。',
    category_slug: 'ai-chat',
    thumbnail: 'https://chat.openai.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Claude',
    url: 'https://claude.ai',
    description: 'Anthropic 开发的 AI 助手，擅长写作、分析和编程等任务。',
    category_slug: 'ai-chat',
    thumbnail: 'https://claude.ai/favicon.ico',
    status: 'approved',
  },
  {
    title: 'Midjourney',
    url: 'https://www.midjourney.com',
    description: '强大的 AI 绘画工具，可以通过文字描述生成高质量图片。',
    category_slug: 'ai-art',
    thumbnail: 'https://www.midjourney.com/favicon.ico',
    status: 'approved',
  },
  {
    title: 'GitHub Copilot',
    url: 'https://github.com/features/copilot',
    description: 'GitHub 和 OpenAI 合作开发的 AI 编程助手，提供智能代码补全。',
    category_slug: 'ai-coding',
    thumbnail: 'https://github.com/favicon.ico',
    status: 'approved',
  },
  {
    title: '豆包',
    url : 'https://yuanbao.tencent.com/chat/naQivTmsDa',
    description: '豆包',
    category_slug: 'ai-coding',
    thumbnail: 'https://github.com/favicon.ico',
    status: 'approved',
  }
] as WebsiteInput[];

interface FooterLinkInput {
  title: string;
  url: string;
}

const defaultFooterLinks: FooterLinkInput[] = [
  { title: '广西警察学院', url: 'https://www.gxjcxy.com/' }
];

interface CSVWebsite {
  Group: string;
  Name: string;
  Link: string;
  Image: string;
  Title: string;
}

function parseCSV(content: string): CSVWebsite[] {
  const lines = content.split('\n');
  const headers = lines[0].split(',');
  const results: CSVWebsite[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(',');
    if (values.length !== headers.length) continue;

    results.push({
      Group: values[0],
      Name: values[1],
      Link: values[2],
      Image: values[3],
      Title: values[4]
    });
  }

  return results;
}

async function importCSVData() {
  try {
    console.log('开始导入 CSV 数据...');
    
    // 读取 CSV 文件
    const csvFilePath = path.join(process.cwd(), 'yanweb_content.csv');
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
    
    // 解析 CSV 数据
    const records = parseCSV(fileContent);
    console.log(`读取到 ${records.length} 条记录`);

    // 获取所有唯一的分组
    const uniqueGroups = Array.from(new Set(records.map(record => record.Group)));
    console.log('发现的分组:', uniqueGroups);

    // 为每个分组创建分类
    console.log('创建分类...');
    for (const group of uniqueGroups) {
      const slug = group.toLowerCase().replace(/\s+/g, '-');
      await prisma.category.upsert({
        where: { slug },
        update: { name: group },
        create: { name: group, slug }
      });
    }

    // 获取所有分类的映射
    const categories = await prisma.category.findMany();
    const categoryMap = new Map(
      categories.map(c => [c.name, c.id])
    );

    // 导入网站数据
    console.log('导入网站数据...');
    for (const record of records) {
      const category_id = categoryMap.get(record.Group);
      if (!category_id) {
        console.log(`警告: 找不到分类 ${record.Group}`);
        continue;
      }

      const websiteData = {
        title: record.Name,
        url: record.Link,
        description: record.Title,
        thumbnail: record.Image !== 'SVG icon' ? record.Image : null,
        status: 'approved',
        category: {
          connect: { id: category_id }
        }
      };

      const existingWebsite = await prisma.website.findFirst({
        where: {
          url: record.Link
        }
      });

      if (existingWebsite) {
        console.log(`更新网站: ${record.Name}`);
        await prisma.website.update({
          where: { id: existingWebsite.id },
          data: websiteData
        });
      } else {
        console.log(`创建网站: ${record.Name}`);
        await prisma.website.create({
          data: websiteData
        });
      }
    }

    console.log('CSV 数据导入完成');
  } catch (error) {
    console.error('CSV 数据导入失败:', error);
    throw error;
  }
}

export async function initializeData() {
  try {
    console.log('开始初始化数据...');
    console.log('正在初始化分类...');
    // 初始化分类
    await Promise.all(
      defaultCategories.map(category =>
        prisma.category.upsert({
          where: { slug: category.slug },
          update: category,
          create: category,
        })
      )
    );
    console.log('分类初始化完成');

    // 获取所有分类的映射
    console.log('正在获取分类映射...');
    const categories = await prisma.category.findMany();
    console.log('获取到的分类:', categories);
    const categoryMap = new Map(
      categories.map((c: Category) => [c.slug, c.id])
    );

    // 初始化网站
    console.log('正在初始化网站数据...');
    await Promise.all(
      defaultWebsites.map(async website => {
        const { category_slug, ...websiteData } = website;
        const category_id = categoryMap.get(category_slug);
        console.log(`处理网站: ${website.title}, 分类: ${category_slug}, 分类ID: ${category_id}`);
        
        if (category_id) {
          const createData: Prisma.WebsiteCreateInput = {
            ...websiteData,
            category: { 
              connect: { id: Number(category_id) } 
            }
          };

          const existingWebsite = await prisma.website.findFirst({
            where: { 
              url: website.url,
              title: website.title
            }
          });

          if (existingWebsite) {
            console.log(`更新已存在的网站: ${website.title}`);
            return prisma.website.update({
              where: { id: existingWebsite.id },
              data: createData
            });
          } else {
            console.log(`创建新网站: ${website.title}`);
            return prisma.website.create({
              data: createData
            });
          }
        } else {
          console.log(`警告: 找不到网站 ${website.title} 对应的分类 ${category_slug}`);
        }
      })
    );
    console.log('网站数据初始化完成');

    // 初始化页脚链接
    console.log('正在初始化页脚链接...');
    await Promise.all(
      defaultFooterLinks.map(async link => {
        console.log(`处理页脚链接: ${link.title}`);
        const existingLink = await prisma.footerLink.findUnique({
          where: { url: link.url }
        });

        if (existingLink) {
          console.log(`更新已存在的页脚链接: ${link.title}`);
          return prisma.footerLink.update({
            where: { id: existingLink.id },
            data: link
          });
        } else {
          console.log(`创建新页脚链接: ${link.title}`);
          return prisma.footerLink.create({
            data: link
          });
        }
      })
    );

    console.log('页脚链接初始化完成');
    console.log('所有数据初始化完成');
  } catch (error) {
    console.error('数据初始化失败:', error);
    throw error;
  }
}

export async function initializeSettings() {
  try {
    console.log('开始初始化设置...');
    const requiredSettings = [
      { key: WebsiteSettings.title, value: 'AI导航' },
      { key: WebsiteSettings.description, value: '发现、分享和收藏优质AI工具与资源' },
      { key: WebsiteSettings.keywords, value: 'AI导航,AI工具,人工智能,AI资源' },
      { key: WebsiteSettings.logo, value: '/static/logo.png' },
      { key: WebsiteSettings.siteIcp, value: '' },
      { key: WebsiteSettings.siteFooter, value: '© 2024 AI导航. All rights reserved.' },
      { key: WebsiteSettings.allowSubmissions, value: 'true' },
      { key: WebsiteSettings.requireApproval, value: 'true' },
      { key: WebsiteSettings.itemsPerPage, value: '12' },
      { key: WebsiteSettings.adminPassword, value: process.env.ADMIN_PASSWORD || 'admin' },
      { key: WebsiteSettings.siteUrl, value: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000' },
      { key: WebsiteSettings.siteEmail, value: process.env.SITE_EMAIL || 'admin@example.com' },
      { key: WebsiteSettings.siteCopyright, value: '© 2024 AI导航. All rights reserved.' },
      { key: WebsiteSettings.googleAnalytics, value: process.env.GOOGLE_ANALYTICS || '' },
      { key: WebsiteSettings.baiduAnalytics, value: process.env.BAIDU_ANALYTICS || '' },
    ];
    
    console.log('正在初始化设置...');
    await Promise.all(
      requiredSettings.map(async setting => {
        console.log(`处理设置: ${setting.key}`);
        return prisma.setting.upsert({
          where: { key: setting.key },
          update: { value: setting.value },
          create: setting,
        });
      })
    );
    console.log('设置初始化完成');
  } catch (error) {
    console.error('设置初始化失败:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('开始数据库初始化过程...');
    await importCSVData();
    await initializeSettings();
    console.log('数据库初始化过程完成');
    process.exit(0);
  } catch (error) {
    console.error('初始化过程失败:', error);
    process.exit(1);
  }
}

main();

module.exports = {
  initializeData,
  initializeSettings
}; 