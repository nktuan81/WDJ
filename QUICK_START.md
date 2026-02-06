# Quick Start Guide - Weidaojia Restaurant Website

## ⚠️ Lỗi "vite: command not found"

Lỗi này xảy ra vì **dependencies chưa được cài đặt**. Hãy làm theo các bước sau:

## Bước 1: Cài đặt Dependencies

### Frontend Dependencies
```bash
cd /Users/test/Downloads/weidaojia1
npm install
```

### Backend Dependencies (nếu chưa cài)
```bash
cd /Users/test/Downloads/weidaojia1/server
npm install
```

## Bước 2: Kiểm tra cài đặt

Sau khi `npm install` xong, kiểm tra:
```bash
# Kiểm tra vite đã được cài
ls node_modules/.bin/vite

# Hoặc
npx vite --version
```

## Bước 3: Chạy ứng dụng

### Cách 1: Chạy Frontend và Backend riêng biệt

**Terminal 1 - Backend:**
```bash
cd /Users/test/Downloads/weidaojia1/server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd /Users/test/Downloads/weidaojia1
npm run dev
```

### Cách 2: Chạy cả hai cùng lúc (cần cài concurrently)

```bash
# Cài concurrently (nếu chưa có)
npm install concurrently --save-dev

# Chạy cả hai
npm run dev:all
```

## Bước 4: Truy cập ứng dụng

- **Frontend:** http://localhost:8080
- **Backend API:** http://localhost:3001
- **Admin Panel:** http://localhost:8080/admin/login
  - Email: `admin@weidaojia.com`
  - Password: `admin123`

## Troubleshooting

### Nếu vẫn lỗi "command not found"

1. **Kiểm tra Node.js đã cài:**
   ```bash
   node --version
   npm --version
   ```

2. **Xóa và cài lại:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Kiểm tra PATH:**
   ```bash
   echo $PATH
   which node
   which npm
   ```

### Nếu lỗi network khi npm install

- Kiểm tra kết nối internet
- Thử dùng npm registry khác:
  ```bash
  npm config set registry https://registry.npmjs.org/
  ```

### Nếu lỗi permission

```bash
sudo npm install
```

## Kiểm tra Database đã seed chưa

```bash
cd server
node prisma/seed-simple.js
```

Nếu thấy:
```
✅ Created admin user: admin@weidaojia.com
✅ Created 7 menu items
✅ Created 2 discount codes
✨ Seeding completed!
```

Thì database đã sẵn sàng!

## Lệnh hữu ích

```bash
# Xem database
cd server
npm run prisma:studio

# Test API
curl http://localhost:3001/health
curl http://localhost:3001/api/menu

# Build production
npm run build
cd server && npm run build
```
