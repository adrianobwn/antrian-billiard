import React from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Users,
  Trophy,
  Shield,
  Zap,
  CheckCircle,
  Star,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Play
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-surface">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/90 backdrop-blur-md z-50 border-b border-surface-elevated">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🎱</span>
              <span className="text-xl font-bold text-text-primary">
                Antrian Billiard
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                Masuk
              </Link>
              <Link
                to="/login?type=admin"
                className="px-4 py-2 bg-admin-accent text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-text-primary mb-6">
            Selamat Datang di
            <span className="text-customer-primary"> Antrian Billiard</span>
          </h1>
          <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Sistem reservasi meja billiard modern. Pesan meja favorit Anda secara online dan
            nikmati permainan tanpa perlu menunggu.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-customer-primary text-white rounded-lg hover:bg-customer-primary-hover transition-colors text-lg font-semibold"
            >
              Daftar Sekarang
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-surface text-text-primary rounded-lg hover:bg-surface-elevated transition-colors text-lg font-semibold"
            >
              Masuk
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-surface/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-text-primary mb-12">
            Mengapa Memilih Kami?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-background rounded-xl">
              <div className="w-16 h-16 bg-customer-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-customer-primary" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Reservasi Mudah
              </h3>
              <p className="text-text-secondary">
                Pesan meja billiard kapan saja, di mana saja melalui aplikasi web kami.
              </p>
            </div>
            <div className="text-center p-6 bg-background rounded-xl">
              <div className="w-16 h-16 bg-admin-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-admin-accent" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Kelola Efisien
              </h3>
              <p className="text-text-secondary">
                Dashboard admin untuk mengelola meja, reservasi, dan laporan.
              </p>
            </div>
            <div className="text-center p-6 bg-background rounded-xl">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                Real-time Update
              </h3>
              <p className="text-text-secondary">
                Status meja update secara real-time, tidak ada double booking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Table Types */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-text-primary mb-12">
            Jenis Meja
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Standard */}
            <div className="bg-surface rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎱</div>
                  <h3 className="text-2xl font-bold text-white">Standard</h3>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-2 text-text-secondary mb-4">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    Meja standar profesional
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    Ukuran 7ft atau 8ft
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    Aksesori lengkap
                  </li>
                </ul>
                <div className="text-center">
                  <span className="text-3xl font-bold text-customer-primary">
                    Rp 50K
                  </span>
                  <span className="text-text-secondary">/jam</span>
                </div>
              </div>
            </div>

            {/* VIP */}
            <div className="bg-surface rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">⭐</div>
                  <h3 className="text-2xl font-bold text-white">VIP</h3>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-2 text-text-secondary mb-4">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                    Meja premium dengan design khusus
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                    Sofa nyaman untuk penonton
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-purple-500 mr-2 flex-shrink-0 mt-0.5" />
                    Layanan concierge
                  </li>
                </ul>
                <div className="text-center">
                  <span className="text-3xl font-bold text-admin-accent">
                    Rp 100K
                  </span>
                  <span className="text-text-secondary">/jam</span>
                </div>
              </div>
            </div>

            {/* VVIP */}
            <div className="bg-surface rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gradient-to-br from-yellow-600 to-yellow-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">👑</div>
                  <h3 className="text-2xl font-bold text-white">VVIP</h3>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-2 text-text-secondary mb-4">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                    Ruangan pribadi eksklusif
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                    Entertainment system lengkap
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" />
                    F&B service khusus
                  </li>
                </ul>
                <div className="text-center">
                  <span className="text-3xl font-bold text-yellow-600">
                    Rp 200K
                  </span>
                  <span className="text-text-secondary">/jam</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-surface/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-text-primary mb-12">
            Cara Kerja
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-customer-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Daftar Akun
              </h3>
              <p className="text-text-secondary">
                Buat akun gratis dalam hitungan menit
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-customer-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Pilih Meja
              </h3>
              <p className="text-text-secondary">
                Lihat ketersediaan dan pilih meja favorit Anda
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-customer-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Reservasi
              </h3>
              <p className="text-text-secondary">
                Tentukan waktu dan lama permainan
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-customer-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">4</span>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Main & Bayar
              </h3>
              <p className="text-text-secondary">
                Datang tepat waktu dan nikmati permainan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Promotions */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-text-primary mb-12">
            Promo Menarik
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-customer-primary to-customer-primary-dark p-1 rounded-xl">
              <div className="bg-background p-6 rounded-xl">
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  Happy Hour Discount
                </h3>
                <p className="text-text-secondary mb-4">
                  Diskon 30% untuk main hari Senin - Jumat, jam 10:00 - 17:00
                </p>
                <div className="flex items-center text-customer-primary font-semibold">
                  <Trophy className="w-5 h-5 mr-2" />
                  Hemat hingga 30%
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-admin-accent to-orange-600 p-1 rounded-xl">
              <div className="bg-background p-6 rounded-xl">
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  Member Get Member
                </h3>
                <p className="text-text-secondary mb-4">
                  Ajak teman dan dapatkan bonus main gratis
                </p>
                <div className="flex items-center text-admin-accent font-semibold">
                  <Users className="w-5 h-5 mr-2" />
                  Bonus 1 jam
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-surface/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center text-text-primary mb-12">
            Testimoni Pelanggan
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-customer-primary rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl font-bold text-white">A</span>
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">Andi Pratama</h4>
                  <div className="flex text-yellow-500">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-text-secondary italic">
                "Sangat mudah reservasi meja billiard di sini. Tinggal buka aplikasi,
                pilih meja, dan datang tepat waktu. Tidak perlu antri lagi!"
              </p>
            </div>
            <div className="bg-background p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-admin-accent rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl font-bold text-white">S</span>
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">Sarah Wijaya</h4>
                  <div className="flex text-yellow-500">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-text-secondary italic">
                "Meja VIP sangat nyaman dan mewah. Pelayanan staff juga ramah.
                Cocok untuk acara bisnis atau gathering."
              </p>
            </div>
            <div className="bg-background p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-xl font-bold text-white">B</span>
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary">Budi Santoso</h4>
                  <div className="flex text-yellow-500">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-text-secondary italic">
                "Sistem reservasinya sangat membantu. Bisa lihat semua meja yang tersedia
                dan langsung booking dari handphone."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-text-primary mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-surface p-6 rounded-xl">
              <h3 className="font-semibold text-text-primary mb-2">
                Bagaimana cara memesan meja?
              </h3>
              <p className="text-text-secondary">
                Anda bisa memesan melalui website kami atau aplikasi mobile. Pilih jenis meja,
                tanggal, dan waktu yang diinginkan, lalu selesaikan pembayaran.
              </p>
            </div>
            <div className="bg-surface p-6 rounded-xl">
              <h3 className="font-semibold text-text-primary mb-2">
                Apakah ada deposit untuk reservasi?
              </h3>
              <p className="text-text-secondary">
                Ya, kami meminta deposit 20% dari total biaya untuk konfirmasi reservasi Anda.
              </p>
            </div>
            <div className="bg-surface p-6 rounded-xl">
              <h3 className="font-semibold text-text-primary mb-2">
                Berapa lama waktu reservasi?
              </h3>
              <p className="text-text-secondary">
                Minimum 1 jam dan maksimal 8 jam. Untuk durasi lebih dari 4 jam,
                tersedia diskon khusus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 px-4 bg-surface">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            Hubungi Kami
          </h2>
          <p className="text-text-secondary mb-8">
            Ada pertanyaan? Jangan ragu untuk menghubungi kami
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-6">
              <Phone className="w-8 h-8 text-customer-primary mb-4" />
              <h3 className="font-semibold text-text-primary">Telepon</h3>
              <p className="text-text-secondary">+62 21 1234 5678</p>
            </div>
            <div className="flex flex-col items-center p-6">
              <Mail className="w-8 h-8 text-customer-primary mb-4" />
              <h3 className="font-semibold text-text-primary">Email</h3>
              <p className="text-text-secondary">info@antrianbilliard.com</p>
            </div>
            <div className="flex flex-col items-center p-6">
              <MapPin className="w-8 h-8 text-customer-primary mb-4" />
              <h3 className="font-semibold text-text-primary">Lokasi</h3>
              <p className="text-text-secondary">Jl. Sudirman No. 123, Jakarta</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-customer-primary to-customer-primary-dark">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Siap untuk Bermain?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Bergabung dengan ribuan pemain billiard lainnya
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-4 bg-white text-customer-primary rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold"
          >
            Daftar Sekarang
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-background border-t border-surface-elevated">
        <div className="container mx-auto text-center">
          <p className="text-text-secondary">
            © 2024 Antrian Billiard. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;