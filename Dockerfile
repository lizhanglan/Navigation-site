# 使用 Node.js 官方镜像作为基础镜像
FROM node:22-alpine AS builder

# 设置工作目录
WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm ci

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 生产环境镜像
FROM node:22-alpine AS runner

# 设置工作目录
WORKDIR /app

ENV NODE_ENV production

# and other docker env inject
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/.next/server ./.next/server

# 暴露端口
EXPOSE 3000

# 启动命令
CMD  node server.js