"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeData = initializeData;
exports.initializeSettings = initializeSettings;
var prisma = require('../db/db').prisma; // 修改路径，确保正确导入
var constraint_1 = require("../constraint");
var defaultCategories = [
    { name: 'AI 聊天', slug: 'ai-chat' },
    { name: 'AI 绘画', slug: 'ai-art' },
    { name: 'AI 写作', slug: 'ai-writing' },
    { name: 'AI 编程', slug: 'ai-coding' },
    { name: 'AI 工具', slug: 'ai-tools' },
    { name: '大语言模型', slug: 'llm' },
];
var defaultWebsites = [
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
        url: 'https://yuanbao.tencent.com/chat/naQivTmsDa',
        description: '豆包',
        category_slug: 'ai-coding',
        thumbnail: 'https://github.com/favicon.ico',
        status: 'approved',
    }
];
var defaultFooterLinks = [
    { title: 'GitHub', url: 'https://github.com' }
];
function initializeData() {
    return __awaiter(this, void 0, void 0, function () {
        var categories, categoryMap_1, error_1;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    // 初始化分类
                    return [4 /*yield*/, Promise.all(defaultCategories.map(function (category) {
                            return prisma.category.upsert({
                                where: { slug: category.slug },
                                update: category,
                                create: category,
                            });
                        }))];
                case 1:
                    // 初始化分类
                    _a.sent();
                    return [4 /*yield*/, prisma.category.findMany()];
                case 2:
                    categories = _a.sent();
                    categoryMap_1 = new Map(categories.map(function (c) { return [c.slug, c.id]; }));
                    // 初始化网站
                    return [4 /*yield*/, Promise.all(defaultWebsites.map(function (website) { return __awaiter(_this, void 0, void 0, function () {
                            var category_slug, websiteData, category_id, createData, updateData, existingWebsite;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        category_slug = website.category_slug, websiteData = __rest(website, ["category_slug"]);
                                        category_id = categoryMap_1.get(category_slug);
                                        if (!category_id) return [3 /*break*/, 2];
                                        createData = __assign(__assign({}, websiteData), { category: {
                                                connect: { id: Number(category_id) }
                                            } });
                                        updateData = __assign(__assign({}, websiteData), { category: {
                                                connect: { id: Number(category_id) }
                                            } });
                                        return [4 /*yield*/, prisma.website.findUnique({
                                                where: { url: website.url }
                                            })];
                                    case 1:
                                        existingWebsite = _a.sent();
                                        if (existingWebsite) {
                                            return [2 /*return*/, prisma.website.update({
                                                    where: { id: existingWebsite.id },
                                                    data: updateData
                                                })];
                                        }
                                        else {
                                            return [2 /*return*/, prisma.website.create({
                                                    data: createData
                                                })];
                                        }
                                        _a.label = 2;
                                    case 2: return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 3:
                    // 初始化网站
                    _a.sent();
                    // 初始化页脚链接
                    return [4 /*yield*/, Promise.all(defaultFooterLinks.map(function (link) { return __awaiter(_this, void 0, void 0, function () {
                            var existingLink;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, prisma.footerLink.findUnique({
                                            where: { url: link.url }
                                        })];
                                    case 1:
                                        existingLink = _a.sent();
                                        if (existingLink) {
                                            return [2 /*return*/, prisma.footerLink.update({
                                                    where: { id: existingLink.id },
                                                    data: link
                                                })];
                                        }
                                        else {
                                            return [2 /*return*/, prisma.footerLink.create({
                                                    data: link
                                                })];
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); }))];
                case 4:
                    // 初始化页脚链接
                    _a.sent();
                    console.log('数据初始化完成');
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error('数据初始化失败:', error_1);
                    throw error_1;
                case 6: return [2 /*return*/];
            }
        });
    });
}
function initializeSettings() {
    return __awaiter(this, void 0, void 0, function () {
        var requiredSettings;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    requiredSettings = [
                        { key: constraint_1.WebsiteSettings.title, value: 'AI导航' },
                        { key: constraint_1.WebsiteSettings.description, value: '发现、分享和收藏优质AI工具与资源' },
                        { key: constraint_1.WebsiteSettings.keywords, value: 'AI导航,AI工具,人工智能,AI资源' },
                        { key: constraint_1.WebsiteSettings.logo, value: '/static/logo.png' },
                        { key: constraint_1.WebsiteSettings.siteIcp, value: '' },
                        { key: constraint_1.WebsiteSettings.siteFooter, value: '© 2024 AI导航. All rights reserved.' },
                        { key: constraint_1.WebsiteSettings.allowSubmissions, value: 'true' },
                        { key: constraint_1.WebsiteSettings.requireApproval, value: 'true' },
                        { key: constraint_1.WebsiteSettings.itemsPerPage, value: '12' },
                        { key: constraint_1.WebsiteSettings.adminPassword, value: process.env.ADMIN_PASSWORD || 'admin' },
                        { key: constraint_1.WebsiteSettings.siteUrl, value: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000' },
                        { key: constraint_1.WebsiteSettings.siteEmail, value: process.env.SITE_EMAIL || 'admin@example.com' },
                        { key: constraint_1.WebsiteSettings.siteCopyright, value: '© 2024 AI导航. All rights reserved.' },
                        { key: constraint_1.WebsiteSettings.googleAnalytics, value: process.env.GOOGLE_ANALYTICS || '' },
                        { key: constraint_1.WebsiteSettings.baiduAnalytics, value: process.env.BAIDU_ANALYTICS || '' },
                    ];
                    return [4 /*yield*/, Promise.all(requiredSettings.map(function (setting) {
                            return prisma.setting.upsert({
                                where: { key: setting.key },
                                update: { value: setting.value },
                                create: setting,
                            });
                        }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
module.exports = {
    initializeData: initializeData,
    initializeSettings: initializeSettings
};
