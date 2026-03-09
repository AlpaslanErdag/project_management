# Proje Yönetim Sistemi (Project Management System)

Bu proje, ekiplerin projelerini, görevlerini ve süreçlerini verimli bir şekilde yönetebilmeleri için tasarlanmış modern bir web uygulamasıdır.

> **Not:** Bu proje [Lovable](https://lovable.dev/) tarafından yapay zeka yardımıyla hızlı ve ölçeklenebilir bir şekilde oluşturulmuştur.

## 🚀 Teknolojiler

Bu uygulama aşağıdaki modern teknolojiler kullanılarak geliştirilmiştir:

- **Frontend:** [React](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Backend/Database:** [Supabase](https://supabase.com/) (PostgreSQL & Auth)
- **State Management:** TanStack Query (React Query)

## ✨ Özellikler

- **Görev Takibi:** Proje bazlı görev oluşturma, düzenleme ve durum takibi.
- **Kullanıcı Yetkilendirme:** Supabase Auth ile güvenli giriş ve kayıt işlemleri.
- **Veritabanı Entegrasyonu:** Gerçek zamanlı veri senkronizasyonu.
- **Modern Arayüz:** Kullanıcı dostu, responsive ve hızlı UI bileşenleri.

## 🛠️ Kurulum ve Çalıştırma

Projeyi yerel ortamınızda çalıştırmak için aşağıdaki adımları izleyin:

1. **Depoyu Klonlayın:**
   ```bash
   git clone [https://github.com/AlpaslanErdag/project_management.git](https://github.com/AlpaslanErdag/project_management.git)
   cd project_management

2. **Bağımlılıkları Yükleyin:**
npm install
# veya
bun install

3. **Çevresel Değişkenleri Ayarlayın:**
.env dosyanızı oluşturun ve Supabase bilgilerinizi ekleyin:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

4. **Geliştirme Sunucusunu Başlatın:**
npm run dev
