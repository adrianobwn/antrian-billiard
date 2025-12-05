# Billiard Reservation System

Modern web-based billiard table reservation system built with React.js, Node.js/Express, and MariaDB.

## 🚀 Technology Stack

### Frontend
- **React** 18+ with JSX
- **Vite** - Fast build tool
- **React Router** v6 - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icons
- **Recharts** - Data visualization
- **React Hook Form** + **Zod** - Form handling & validation

### Backend
- **Node.js** 18+
- **Express.js** - Web framework
- **Sequelize** - ORM for MariaDB
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Winston** - Logging
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

### Database
- **MariaDB** 10.6+
- UUID primary keys
- Normalized schema design

## ✨ Features

### Customer Portal
- 🔐 User registration and authentication
- 📅 Table reservation booking
- 💰 Promo code application
- 💳 Payment processing
- 📜 Reservation history
- 🔔 Activity logging

### Admin Dashboard
- 🎨 Interactive table status visualization
- 📊 Real-time table availability
- 🛠️ Table & table type management (CRUD)
- 📝 Reservation management
- 🎟️ Promotion management
- 📈 Revenue reports
- 📊 Table performance analytics
- 🎯 Promo effectiveness tracking

## 📋 Requirements

- **Node.js** 18 or higher
- **npm** or**yarn**
- **MariaDB** 10.6+ or **MySQL** 8.0+
- Modern web browser

## 🛠️ Installation

### 1. Clone Repository
```bash
git clone https://github.com/adrianobwn/antrian-billiard.git
cd antrian-billiard
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials
```

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=antrian_billiard_v2
DB_USER=root
DB_PASSWORD=your_password

JWT_SECRET=your-super-secret-key-min-32-characters
```

Run database migrations:
```bash
npm run migrate
npm run seed  # Optional: Load sample data
```

Start backend server:
```bash
npm run dev  # Development mode
npm start    # Production mode
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Configure API URL:
```bash
# .env file already configured
VITE_API_URL=http://localhost:5000/api
```

Start frontend development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🎨 Design Theme

The application features a custom dark theme inspired by billiard aesthetics:

- **Background**: Deep dark blue-black (#0f1419)
- **Customer Theme**: Billiard green (#00a859)
- **Admin Theme**: Slate with orange accents
- **Typography**: Inter font family
- **Components**: Modern glassmorphism and subtle animations

## 📁 Project Structure

```
antrian-billiard/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── models/          # Sequelize models
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   └── utils/           # Utilities
│   ├── logs/                # Application logs
│   ├── .env                 # Environment variables
│   └──server.js            # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   ├── contexts/        # React contexts
│   │   ├── utils/           # Utility functions
│   │   └── styles/          # Global styles
│   └── public/              # Static assets
│
└── database/
    ├── migrations/          # Database migrations
    └── seeders/             # Seed data
```

## 🔐 Authentication

The system uses JWT (JSON Web Tokens) for authentication:

- Tokens expire after 24 hours
- Separate authentication flows for customers and admins
- Token stored in localStorage (client-side)
- Authorization header: `Bearer <token>`

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/customer/register` - Customer registration
- `POST /api/auth/customer/login` - Customer login
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Customer (Requires Auth)
- `GET /api/customer/dashboard` - Dashboard stats
- `GET /api/customer/profile` - Get profile
- `PUT /api/customer/profile` - Update profile

### Reservations
- `GET /api/reservations` - List reservations
- `POST /api/reservations` - Create reservation
- `GET /api/reservations/:id` - Get reservation
- `PUT /api/reservations/:id` - Update reservation
- `DELETE /api/reservations/:id` - Cancel reservation

### Admin (Requires Admin Auth)
- `GET /api/admin/tables` - Manage tables
- `GET /api/admin/promos` - Manage promotions
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/reports/revenue` - Revenue reports

## 👥 Default Accounts

After running seeders, you can use these test accounts:

### Admin
- Email: `admin@antrianbilliard.com`
- Password: `admin123`

### Customer
- Email: `customer@example.com`
- Password: `password`

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend build test
cd frontend
npm run build
npm run preview
```

## 🔧 Development Commands

### Backend
```bash
npm run dev      # Start with nodemon (auto-reload)
npm start        # Start production server
npm run migrate  # Run migrations
npm run seed     # Run seeders
```

### Frontend
```bash
npm run dev      # Start dev server with HMR
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📝 License

Open source - Free to use

## 👨‍💻 Author

**Iyan Project** - Billiard Reservation System Rebuild 2025

---

⭐ Star this repo if you find it helpful!
