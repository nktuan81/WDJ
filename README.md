# Weidaojia 味道佳 - Chinese Restaurant Website

A modern, multilingual restaurant website with interactive menu system, cultural blog, combo builder, and admin panel.

## Features

### Frontend
- **Five Elements Menu** - Interactive menu based on Wu Xing (五行) philosophy with mood/state selector
- **Cultural Blog** - Stories behind dishes with graphic novel style
- **Combo Builder** - Virtual lazy susan with tea pairing recommendations
- **Daily Fortune** - Fortune cookie with discount codes (one per day)
- **Table Reservations** - Online booking system
- **Multilingual Support** - German, English, and Chinese

### Backend
- **RESTful API** - Node.js/Express with TypeScript
- **Database** - SQLite with Prisma ORM
- **Authentication** - JWT-based admin authentication
- **Admin Panel** - Manage reservations, menu, discounts, and blog posts

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- shadcn/ui components

### Backend
- Node.js + Express
- TypeScript
- Prisma ORM
- SQLite
- JWT Authentication
- Zod Validation

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd weidaojia1
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Setup backend**
   ```bash
   npm run setup:server
   ```
   This will:
   - Install server dependencies
   - Generate Prisma client
   - Run database migrations
   - Seed initial data (admin user, sample menu items, discount codes)

4. **Configure environment variables**
   
   Frontend (`.env`):
   ```env
   VITE_API_URL=http://localhost:3001
   ```
   
   Backend (`server/.env`):
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-secret-key-change-in-production"
   JWT_EXPIRES_IN="7d"
   PORT=3001
   NODE_ENV="development"
   FRONTEND_URL="http://localhost:8080"
   ```

### Running the Application

**Option 1: Run both frontend and backend together**
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

The application will be available at:
- Frontend: http://localhost:8080
- Backend API: http://localhost:3001

### Default Admin Credentials

- Email: `admin@weidaojia.com`
- Password: `admin123`

Access admin panel at: http://localhost:8080/admin/login

## Project Structure

```
weidaojia1/
├── src/                    # Frontend source
│   ├── components/         # React components
│   │   ├── Admin/         # Admin components
│   │   └── ui/            # shadcn/ui components
│   ├── contexts/          # React contexts
│   ├── lib/               # Utilities and API client
│   ├── pages/             # Page components
│   └── App.tsx            # Main app component
├── server/                 # Backend source
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   └── utils/         # Utilities
│   └── prisma/
│       ├── schema.prisma  # Database schema
│       └── seed.ts        # Seed script
└── public/                 # Static assets
```

## API Endpoints

### Public Endpoints
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:element` - Get menu by element (metal, wood, water, fire, earth)
- `GET /api/blog` - Get published blog posts
- `GET /api/blog/:id` - Get blog post by ID
- `POST /api/reservations` - Create reservation
- `GET /api/discount/:code` - Validate discount code
- `POST /api/fortune` - Draw daily fortune

### Admin Endpoints (JWT required)
- `POST /api/auth/login` - Admin login
- `GET /api/admin/reservations` - Get all reservations
- `PUT /api/admin/reservations/:id` - Update reservation
- `DELETE /api/admin/reservations/:id` - Delete reservation
- `GET /api/admin/menu` - Get all menu items
- `POST /api/admin/menu` - Create menu item
- `PUT /api/admin/menu/:id` - Update menu item
- `DELETE /api/admin/menu/:id` - Delete menu item
- Similar endpoints for discounts and blog posts

## Development

### Database Management

```bash
# Generate Prisma client
cd server && npm run prisma:generate

# Run migrations
cd server && npm run prisma:migrate

# Open Prisma Studio (database GUI)
cd server && npm run prisma:studio

# Seed database
cd server && npm run prisma:seed
```

### Building for Production

```bash
# Build frontend
npm run build

# Build backend
npm run server:build

# Start production server
npm run server:start
```

## Features in Detail

### Five Elements Menu
- Select mood (energy, cool, balance, focus, relax) or physical state (tired, stressed, hungry, thirsty, normal)
- System suggests dishes based on Wu Xing element mapping
- Dynamic color themes based on selected element
- Fetches menu from API

### Combo Builder
- Input number of guests
- System calculates recommended number of dishes
- Tea pairing recommendations based on selected dishes
- Discount code application
- Saves combo to localStorage

### Daily Fortune
- One fortune per day (tracked via localStorage)
- Returns fortune message and discount code
- Discount codes validated via API
- Saves discount code for later use

### Admin Panel
- Dashboard with statistics
- Manage reservations (view, update status, delete)
- Manage menu items (CRUD operations)
- Manage discount codes (CRUD operations)
- Manage blog posts (CRUD operations)

## License

Private project - All rights reserved

## Notes

- The website uses a creative design inspired by Chinese culture
- All components are responsive and mobile-optimized
- The backend uses SQLite for simplicity (can be easily switched to PostgreSQL)
- Admin authentication uses JWT tokens stored in localStorage
