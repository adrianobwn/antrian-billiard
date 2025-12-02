# Sistem Antrian Billiard

Sistem manajemen reservasi meja billiard berbasis web menggunakan Laravel 12 dengan multi-authentication untuk Customer dan Admin.

## 🚀 Fitur

### Customer
- ✅ Register & Login
- ✅ Dashboard dengan recent reservations
- ✅ Booking meja billiard
- ✅ Lihat history reservations
- ✅ Gunakan promo code
- ✅ Proses pembayaran
- ✅ Cancel reservasi
- ✅ Activity logging

### Admin
- ✅ Login dashboard
- ✅ Manajemen Meja (CRUD)
- ✅ Manajemen Tipe Meja (CRUD)
- ✅ Manajemen Promo (CRUD)
- ✅ Kelola Reservasi
- ✅ Update status reservasi
- ✅ Laporan & statistik

## 📋 Requirements

- PHP 8.4+
- MySQL 8.0+
- Composer
- Laravel 12.40+

## 🛠️ Instalasi

1. **Clone repository**
```bash
git clone https://github.com/adrianobwn/antrian-billiard.git
cd antrian-billiard
```

2. **Install dependencies**
```bash
composer install
```

3. **Setup environment**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Konfigurasi database** di `.env`
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=antrian_billiard
DB_USERNAME=root
DB_PASSWORD=
```

5. **Migrasi dan Seeding**
```bash
php artisan migrate:fresh --seed
```

6. **Jalankan server**
```bash
php artisan serve
```

Aplikasi akan berjalan di `http://127.0.0.1:8000`

## 👥 Akun Testing

### Customer Accounts
Email: `budi.santoso@email.com` | Password: `password`  
Email: `siti.nurhaliza@email.com` | Password: `password`

**URL Login**: `http://127.0.0.1:8000/customer/login`

### Admin Accounts
Email: `admin@antrianbilliard.com` | Password: `admin123`  
Email: `manager@antrianbilliard.com` | Password: `manager123`

**URL Login**: `http://127.0.0.1:8000/admin/login`

📝 *Lihat file `ACCOUNTS.md` untuk daftar lengkap akun testing.*

## 📁 Struktur Folder

```
app/
├── Http/Controllers/
│   ├── Auth/AuthController.php         # Multi-auth (Customer & Admin)
│   ├── Admin/                          # Admin Controllers
│   │   ├── DashboardController.php
│   │   ├── ReservationController.php
│   │   ├── TableController.php
│   │   ├── TableTypeController.php
│   │   └── PromoController.php
│   └── Customer/                       # Customer Controllers
│       ├── DashboardController.php
│       └── ReservationController.php
├── Models/                             # Eloquent Models
│   ├── Customer.php
│   ├── Admin.php
│   ├── Reservation.php
│   ├── Table.php
│   ├── TableType.php
│   ├── Promo.php
│   ├── Payment.php
│   └── ActivityLog.php
```

📝 *Lihat file `STRUCTURE.md` untuk dokumentasi lengkap struktur folder.*

## 🔐 Multi-Authentication

Aplikasi menggunakan 2 guard berbeda:
- **`web`** guard untuk Customer (table: `customers`)
- **`admin`** guard untuk Admin (table: `admins`)

Konfigurasi: `config/auth.php`

## 📊 Database Schema

- **customers** - Data customer
- **admins** - Data admin dengan role
- **tables** - Meja billiard
- **table_types** - Tipe meja (Standard, VIP, VVIP)
- **reservations** - Data reservasi
- **payments** - Pembayaran
- **promos** - Kode promo
- **activity_logs** - Log aktivitas customer
- **v_reservation_full** - View untuk query kompleks

## 🧪 Testing

```bash
# Test routes
php artisan route:list --path=customer
php artisan route:list --path=admin

# Clear cache
php artisan cache:clear
php artisan view:clear
php artisan config:clear
```

## 🔧 Troubleshooting

**Problem**: Error "credentials do not match"  
**Solution**: Pastikan menggunakan URL login yang benar (customer vs admin)

**Problem**: Error "Attempt to read property on string"  
**Solution**: Pastikan eager loading relasi di controller

**Problem**: Migration error  
**Solution**: `php artisan migrate:fresh --seed`

## 📝 License

Open source - Free to use

## 👨‍💻 Author

**Iyan Project** - Sistem Antrian Billiard

---

⭐ Star repo ini jika bermanfaat!
