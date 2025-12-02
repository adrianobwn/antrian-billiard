# Struktur Folder - Sistem Antrian Billiard

## Struktur Direktori

```
antrian-billiard/
├── app/
│   ├── Console/
│   │   └── Kernel.php
│   ├── Exceptions/
│   │   └── Handler.php
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/
│   │   │   │   └── AuthController.php          # Autentikasi Customer & Admin
│   │   │   ├── Admin/
│   │   │   │   ├── DashboardController.php     # Dashboard & Reports Admin
│   │   │   │   ├── ReservationController.php   # Manajemen Reservasi Admin
│   │   │   │   ├── TableController.php         # Manajemen Meja
│   │   │   │   ├── TableTypeController.php     # Manajemen Tipe Meja
│   │   │   │   └── PromoController.php         # Manajemen Promo
│   │   │   ├── Customer/
│   │   │   │   ├── DashboardController.php     # Dashboard Customer
│   │   │   │   └── ReservationController.php   # Reservasi Customer
│   │   │   └── Controller.php
│   │   ├── Kernel.php
│   │   └── Middleware/
│   ├── Models/
│   │   ├── ActivityLog.php                     # Log Aktivitas
│   │   ├── Admin.php                           # Model Admin
│   │   ├── Customer.php                        # Model Customer
│   │   ├── Payment.php                         # Model Pembayaran
│   │   ├── Promo.php                           # Model Promo
│   │   ├── Reservation.php                     # Model Reservasi
│   │   ├── Table.php                           # Model Meja
│   │   ├── TableType.php                       # Model Tipe Meja
│   │   └── VReservationFull.php               # View Reservasi Full
│   └── Providers/
│       ├── AppServiceProvider.php
│       ├── EventServiceProvider.php
│       └── RouteServiceProvider.php
├── bootstrap/
│   ├── app.php
│   └── cache/
├── config/
│   ├── app.php
│   ├── auth.php                                # Konfigurasi Multi-Auth
│   └── services.php
├── database/
│   ├── migrations/
│   │   ├── 2024_12_02_000001_create_customers_table.php
│   │   ├── 2024_12_02_000002_create_admins_table.php
│   │   ├── 2024_12_02_000003_create_table_types_table.php
│   │   ├── 2024_12_02_000004_create_tables_table.php
│   │   ├── 2024_12_02_000005_create_promos_table.php
│   │   ├── 2024_12_02_000006_create_reservations_table.php
│   │   ├── 2024_12_02_000007_create_payments_table.php
│   │   ├── 2024_12_02_000008_create_activity_logs_table.php
│   │   └── 2024_12_02_000009_create_v_reservation_full_view.php
│   └── seeders/
│       ├── AdminsSeeder.php
│       ├── CustomersSeeder.php
│       ├── DatabaseSeeder.php
│       ├── PaymentsSeeder.php
│       ├── PromosSeeder.php
│       ├── ReservationsSeeder.php
│       ├── TablesSeeder.php
│       └── TableTypesSeeder.php
├── public/
│   └── index.php
├── resources/
│   └── views/
│       ├── admin/                              # Views Admin
│       ├── auth/                               # Views Autentikasi
│       ├── customer/                           # Views Customer
│       └── layouts/                            # Layout Templates
├── routes/
│   ├── api.php
│   ├── console.php
│   └── web.php                                 # Routes Customer & Admin
├── storage/
│   ├── framework/
│   └── logs/
├── ACCOUNTS.md                                 # Dokumentasi Akun Testing
└── README.md

```

## Penjelasan Struktur

### Controllers

#### 1. **Auth Controllers** (`app/Http/Controllers/Auth/`)
- `AuthController.php` - Menangani login, register, logout untuk Customer & Admin

#### 2. **Admin Controllers** (`app/Http/Controllers/Admin/`)
- `DashboardController.php` - Dashboard dan laporan admin
- `ReservationController.php` - Kelola semua reservasi
- `TableController.php` - CRUD meja billiard
- `TableTypeController.php` - CRUD tipe meja
- `PromoController.php` - CRUD promo

#### 3. **Customer Controllers** (`app/Http/Controllers/Customer/`)
- `DashboardController.php` - Dashboard customer
- `ReservationController.php` - Buat, lihat, cancel reservasi & payment

### Models

Semua model menggunakan UUID sebagai primary key dan memiliki relasi yang jelas:
- **Customer** → hasMany Reservations, ActivityLogs
- **Admin** → hasMany Tables, Promos
- **Reservation** → belongsTo Customer, Table, Promo; hasOne Payment
- **Table** → belongsTo TableType, Admin; hasMany Reservations
- **Payment** → belongsTo Reservation

### Database

- **Migrations**: Struktur database terorganisir dengan foreign keys
- **Seeders**: Data testing untuk semua table
- **View**: `v_reservation_full` untuk query kompleks

### Routes

**Customer Routes** (`/customer/*`):
- Authentication: login, register, logout
- Dashboard & reservations management
- Payment processing

**Admin Routes** (`/admin/*`):
- Authentication: login, logout
- Dashboard dengan statistics
- CRUD untuk tables, table types, promos
- Reservation management & status updates

## Best Practices yang Diterapkan

1. ✅ **Separation of Concerns**: Controller terpisah untuk Customer & Admin
2. ✅ **Multi-Authentication**: Guard terpisah (web untuk customer, admin untuk admin)
3. ✅ **Eager Loading**: Menghindari N+1 query problem
4. ✅ **Validation**: Input validation di setiap form submission
5. ✅ **Activity Logging**: Track semua aksi penting customer
6. ✅ **UUID Primary Keys**: Lebih secure dan scalable
7. ✅ **Database View**: Optimize complex queries dengan view
8. ✅ **Defensive Programming**: Handle missing relations di model methods

## Keamanan

- Password di-hash menggunakan bcrypt
- CSRF protection di semua forms
- Route middleware untuk proteksi auth
- UUID untuk mencegah sequential ID guessing
- Input validation di semua endpoints

## Testing Accounts

Lihat file `ACCOUNTS.md` untuk daftar lengkap akun testing.
