# Sử dụng Node.js phiên bản 18
FROM node:18

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy file cấu hình và cài đặt thư viện
COPY package.json package-lock.json ./
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Mở cổng 3001 cho frontend
EXPOSE 3001

# Chạy ứng dụng Node.js
CMD ["node", "server.js"]