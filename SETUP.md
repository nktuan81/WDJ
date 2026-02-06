# Setup Instructions - Weidaojia Restaurant Website

## Quick Setup

### 1. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Setup Database

```bash
cd server

# Generate Prisma Client
npm run prisma:generate

# Create database and run migrations
npm run prisma:migrate

# OR use db push (faster for development)
npx prisma db push
```

### 3. Seed Database

**Option 1: Using TypeScript (if tsx works)**
```bash
cd server
npm run prisma:seed
```

**Option 2: Using JavaScript (recommended if tsx has issues)**
```bash
cd server
npm run prisma:seed:simple
```

**Option 3: Manual seed**
```bash
cd server
node prisma/seed-simple.js
```

### 4. Start the Application

**Option 1: Run both frontend and backend**
```bash
npm run dev:all
```

**Option 2: Run separately**

Terminal 1 - Frontend:
```bash
npm run dev
```

Terminal 2 - Backend:
```bash
npm run server
```

## Troubleshooting

### Prisma Errors

If you get `PrismaClientInitializationError`:

1. **Check .env file exists:**
   ```bash
   cd server
   cat .env
   ```
   Should show `DATABASE_URL="file:./prisma/dev.db"`

2. **Regenerate Prisma Client:**
   ```bash
   cd server
   npx prisma generate
   ```

3. **Reset database (if needed):**
   ```bash
   cd server
   rm -f prisma/dev.db prisma/dev.db-journal
   npx prisma migrate dev --name init
   ```

### Seed Script Errors

If `tsx` has permission issues, use the JavaScript version:
```bash
cd server
node prisma/seed-simple.js
```

### Database Location

The database file is located at: `server/prisma/dev.db`

Make sure the `.env` file has:
```
DATABASE_URL="file:./prisma/dev.db"
```

## Default Credentials

- **Admin Email:** admin@weidaojia.com
- **Admin Password:** admin123

Access admin panel at: http://localhost:8080/admin/login

## Verify Setup

1. Check database tables:
   ```bash
   cd server
   sqlite3 prisma/dev.db ".tables"
   ```
   Should show: users, reservations, menu_items, discount_codes, blog_posts

2. Check Prisma Client:
   ```bash
   cd server
   npx prisma generate
   ```

3. Test API:
   ```bash
   curl http://localhost:3001/health
   ```
   Should return: `{"status":"ok","message":"Weidaojia API is running"}`
