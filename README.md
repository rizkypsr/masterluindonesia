# Master Lu Indonesia - Website Keagamaan

## 🚀 Project Overview

Master Lu Indonesia adalah platform pembelajaran digital yang menyediakan koleksi lengkap audio dharma, buku, paritta, dan materi edukasi Buddha. Website ini dirancang untuk memudahkan umat Buddha dalam mengakses berbagai konten spiritual dan edukatif dalam satu platform yang terintegrasi.

## ✨ Features

- **Audio Dharma**: Koleksi audio ceramah dan pengajaran dharma dari berbagai guru spiritual
- **Perpustakaan Digital**: Akses ke berbagai buku dan teks keagamaan Buddha
- **Paritta**: Kumpulan paritta (doa-doa perlindungan) dalam format audio dan teks
- **Materi Edukasi**: Konten pembelajaran tentang ajaran Buddha yang terstruktur
- **Pencarian Cerdas**: Fitur pencarian yang memudahkan menemukan konten spesifik
- **Bookmark Manager**: Simpan dan kelola konten favorit
- **AI Voice Guide**: Panduan suara berbasis AI untuk pengalaman yang lebih interaktif
- **Community Playlists**: Playlist yang dibuat dan dibagikan oleh komunitas
- **Responsive Design**: Tampilan yang optimal di berbagai perangkat
- **Dark Mode Support**: Dukungan tema gelap untuk kenyamanan mata
- **Progressive Web App**: Dapat diakses seperti aplikasi mobile

## 🛠️ Tech Stack

### Frontend
- **Nuxt 4** - Full-stack Vue.js framework
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Nuxt UI** - Modern UI components for Nuxt

### State Management & Utils
- **Pinia** - Vue state management
- **VueUse** - Collection of Vue composition utilities
- **Better Auth** - Authentication solution

### Integrations & APIs
- **ElevenLabs** - AI voice synthesis
- **Firebase Storage** - Cloud storage for media files
- **Google OAuth** - Authentication provider

### Development Tools
- **Nuxt Icon** - Icon management
- **Nuxt Image** - Image optimization
- **Nuxt Ripple** - Material design ripple effects

## 📁 Project Structure

```
app/
├── assets/          # Static assets (CSS, images)
├── components/      # Vue components
├── composables/     # Vue composables
├── layouts/         # Layout components
├── lib/            # Utility libraries
├── pages/          # Application pages
│   ├── audio/      # Audio content pages
│   ├── books/      # Book collection pages
│   ├── paritta/    # Paritta pages
│   ├── edukasi/    # Educational content
│   ├── video/      # Video content
│   └── ...
├── plugins/        # Nuxt plugins
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Installation

1. Clone repository
```bash
git clone [repository-url]
cd masterlu
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env
```

4. Configure environment variables di `.env`:
```env
NUXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NUXT_PUBLIC_API_BASE_URL=your_api_base_url
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Generate static site
npm run generate

# Preview production build
npm run preview

# Analyze bundle
npm run analyze
```

## 🌐 Deployment

Project ini dikonfigurasi untuk deployment dengan:
- **Preset**: Node.js server
- **Static Generation**: Halaman edukasi dan tentang di-prerender
- **Caching Strategy**: Optimized untuk performa maksimal
- **PWA Ready**: Siap untuk instalasi sebagai aplikasi

## 📱 Features Detail

### Tabs Utama
- **Terbaru**: Konten terbaru yang ditambahkan
- **Paritta**: Koleksi paritta lengkap
- **Unduh**: Konten yang dapat diunduh
- **Edukasi**: Materi pembelajaran terstruktur
- **Tentang**: Informasi tentang platform
- **Contact**: Informasi kontak dan dukungan

### Fitur Lanjutan
- **Scroll Position Memory**: Mengingat posisi scroll saat navigasi
- **Keep Alive Components**: Optimasi performa dengan component caching
- **Lazy Loading**: Pemuatan konten yang efisien
- **Offline Support**: Dukungan akses offline untuk konten tertentu

## 🤝 Contributing

Kontribusi sangat diterima! Silakan:
1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📄 License

Project ini dilisensikan di bawah [MIT License](LICENSE).

## 📞 Support

Untuk dukungan dan pertanyaan:
- Website: [masterluindonesia.com](https://masterluindonesia.com)
- Email: [contact information]

---

*Dibuat dengan ❤️ untuk komunitas Buddha Indonesia*