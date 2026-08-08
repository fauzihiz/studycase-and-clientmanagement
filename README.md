# Case Study & Client Management System

A lightweight, web-based tool designed for freelance web developers and digital marketers to log client assets, track SEO/analytics growth metrics, and automatically transform work history into high-converting portfolio case studies.

Built as a Progressive Web App (PWA) for seamless mobile updates on the field.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, React Server Components)
- **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL, Row Level Security, Object Storage)
- **Styling & UI:** [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **PWA Integration:** `@ducanh2912/next-pwa`
- **Data Visualization:** `react-compare-slider` & `recharts`

---

## ✨ Features Breakdown

1. **Client & Project Hub:** Centralized database replacing messy manual file folders.
2. **Growth Metrics Tracker:** Log *Before vs After* metrics (Traffic, Google Search Console, Google Business Profile leads).
3. **Asset Vault:** Upload wireframes, redesign screenshots, testimonials, and SEO reports.
4. **Interactive Before/After Slider:** Visual showcase for website redesigns.
5. **One-Click Case Study Generator:** Instantly generate clean, shareable dynamic portfolio links for prospective clients.
6. **Mobile-First PWA:** Upload client photos and notes directly from your mobile phone.

---

## 🚀 Development Roadmap & Progress Tracker

### Phase 1: Project Setup & Architecture
- [x] Initialize Next.js project with Tailwind CSS & TypeScript
- [x] Install and configure `shadcn/ui`
- [x] Setup Supabase project and define PostgreSQL Schema (`schema.sql`)
- [x] Configure Row Level Security (RLS) policies for multi-tenant data isolation

### Phase 2: Authentication & Core Dashboard
- [x] Implement Supabase Auth (Email / Magic Link / OAuth)
- [x] Build Dashboard Layout (Responsive Navbar, Sidebar, and Dark Mode)
- [x] Create CRUD operations for **Clients**
- [ ] Create CRUD operations for **Projects & Briefs**

### Phase 3: Media & Metrics Logging
- [ ] Setup Supabase Storage Buckets for project screenshots and documents
- [ ] Build Asset Upload Component (Before/After images, GBP proof)
- [ ] Build Metrics Form (Traffic, Keywords, Conversion tracking)
- [ ] Integrate Interactive Before/After Visual Slider (`react-compare-slider`)

### Phase 4: Public Case Study & Pitching Engine
- [ ] Design Public Dynamic Route (`/case-study/[slug]`)
- [ ] Build SEO-friendly Case Study Showcase Page
- [ ] Add Password Protection / Secret Link Share Option for prospective clients
- [ ] Export Case Study summary to PDF / Image capability (Optional)

### Phase 5: PWA Integration & Polishing
- [ ] Configure Service Worker & Web App Manifest via `@ducanh2912/next-pwa`
- [ ] Test Mobile Responsiveness and Camera Upload Flow
- [ ] Setup Registration Locking (`ADMIN_EMAIL` check / Signup Toggle)
- [ ] Prepare Final `schema.sql` and `.env.example` for open-source deployment

---

## 🚦 Getting Started (Local Development)

### 1. Prerequisites
Ensure you have Node.js (v18+) and npm/pnpm installed.

### 2. Clone the Repository
```bash
git clone [https://github.com/your-username/studycase-and-clientmanagement.git](https://github.com/your-username/studycase-and-clientmanagement.git)
cd studycase-and-clientmanagement
