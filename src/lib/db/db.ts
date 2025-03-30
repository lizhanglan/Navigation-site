import { PrismaClient } from '@prisma/client';

// 声明全局类型，使 prisma 在全局范围内可用
declare global {
  var prisma: PrismaClient | undefined;
}

// 创建一个类型安全的全局对象来存储 Prisma 实例
const globalForPrisma = global as { prisma?: PrismaClient };

// 导出 Prisma 实例:
// - 如果全局已存在实例则复用
// - 否则创建新实例
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

// 在开发环境中将实例保存到全局对象
// 这样可以防止热重载时创建多个数据库连接
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}