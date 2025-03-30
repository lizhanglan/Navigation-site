"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
var client_1 = require("@prisma/client");
// 创建一个类型安全的全局对象来存储 Prisma 实例
var globalForPrisma = global;
// 导出 Prisma 实例:
// - 如果全局已存在实例则复用
// - 否则创建新实例
exports.prisma = (_a = globalForPrisma.prisma) !== null && _a !== void 0 ? _a : new client_1.PrismaClient();
// 在开发环境中将实例保存到全局对象
// 这样可以防止热重载时创建多个数据库连接
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = exports.prisma;
}
