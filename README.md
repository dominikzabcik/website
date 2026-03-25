<div align="center">

# 🌐 Dominik Žabčík — Personal Website

**A modern, animated portfolio built with Next.js, TypeScript & Tailwind CSS**

[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/dominik-%C5%BEab%C4%8D%C3%ADk-a1857433a)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/dominikzabcik)
[![NFCtron](https://img.shields.io/badge/NFCtron-00D4AA?style=for-the-badge&logo=nfc&logoColor=white)](https://nfctron.com)

</div>

---

## 🚀 About This Project

This is my personal portfolio website showcasing my work as a **22-year-old Full Stack TypeScript Engineer & CISO at NFCtron**. Built with modern web technologies and featuring smooth animations, glassmorphism effects, and real-time data integration.

### ✨ Features

- 🎨 **Modern Design** — Glassmorphism UI with gradient orbs and animated backgrounds
- ⚡ **Live Spotify** — Currently playing via Spotify Web API (when configured)
- 🗺️ **Interactive Map** — Apple Maps integration showing Prague location
- 📱 **Fully Responsive** — Optimized for all devices
- 🌓 **Dark Mode** — Automatic dark/light theme switching
- 🎭 **Smooth Animations** — Framer Motion powered transitions
- 📧 **Contact Form** — With Cloudflare Turnstile protection
- ⚡ **Fast Performance** — Next.js 15 with static generation

---

## 🛠️ Tech Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.14 | React framework with SSR/SSG |
| **React** | 19.2.4 | UI library |
| **TypeScript** | 5.9.3 | Type-safe development |
| **Tailwind CSS** | 3.4.19 | Utility-first styling |

### Animation & UI
- **Framer Motion** — Smooth animations and transitions
- **React Hot Toast** — Toast notifications
- **React Icons** — Icon library

### Data & APIs
- **Spotify Web API** — “Now playing” on the homepage (optional `SPOTIFY_*` env)
- **Apple MapKit** — Static map snapshots

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/dominikzabcik/website.git
cd website

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Run development server
bun run dev
```

### Environment Variables

Create a `.env` file with the following:

```env
# Apple MapKit (for map snapshots)
APPLE_TEAM_ID=your_team_id
APPLE_KEY_ID=your_key_id
APPLE_PRIV_KEY=your_private_key

# Discord Webhook (for contact form)
DISCORD_WEBHOOK=https://discord.com/api/webhooks/...

# Cloudflare Turnstile
TURNSTILE_SECRET_KEY=your_secret_key

# Optional: Mapbox, Vercel KV — see .env.example
```

---

## 🏗️ Build & Deploy

```bash
# Build for production
bun run build

# Start production server
bun run start
```

---

## 🎨 Customization

### Updating Personal Info

Edit these files to customize:

- **`src/utils/constants.ts`** — Age, Discord ID, location
- **`src/pages/index.tsx`** — Main content, links, bio
- **`src/pages/_app.tsx`** — Meta tags, page title
- **`src/components/time.tsx`** — Timezone settings

### Styling

- **Tailwind config** — `tailwind.config.js`
- **Global styles** — `src/globals.css`
- **Theme colors** — Custom gradients in component files

---

## 🙏 Credits & Attribution

This website was originally based on the amazing work of:

### Original Creator
- **[Alistair Smith (@alii)](https://github.com/alii)** — Original website design and concept
  - Repository: [`alii/website`](https://github.com/alii/website)

### Additional Inspiration
- **[Ana Arsonist](https://github.com/AnaArsonist)** — For open sourcing her website design elements
  - Repository: [`AnaArsonist/anahoward.me`](https://github.com/AnaArsonist/anahoward.me)

---

## 📄 License

This project is open source under the [Apache-2.0 License](LICENSE).

If you use this as a template, please:
1. ⭐ Star the original repository [`alii/website`](https://github.com/alii/website)
2. 📝 Keep attribution credits in your README
3. 🎨 Make it your own with unique content and styling

---

## 🎯 About Me

I'm **Dominik Žabčík**, a 22-year-old Full Stack TypeScript engineer from Prague, Czech Republic.

### What I Do
- 🔐 **CISO at NFCtron** — Leading security and backend development
- 💳 **Payment Systems** — Building PCI-compliant payment infrastructure
- 🎪 **Event Tech** — Cashless payments for events across Europe
- 🛠️ **Full Stack** — From database design to frontend animations

### Current Focus
- 🔥 Building secure, scalable microservices
- 🚀 Optimizing high-throughput payment processing
- 🔒 PCI-DSS compliance & security architecture
- 📊 Real-time event management systems

> **💼 Hiring?** Check out [NFCtron careers](https://www.nfctron.com/cs/kariera) — we're always looking for exceptional people!

---

<div align="center">

**Built with ❤️ in Prague, Czech Republic**

© 2026 Dominik Žabčík

</div>
