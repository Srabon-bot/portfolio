# Architecture Overview & System Design

This document details the architecture, design choices, data flows, and security measures of Shahriar Srabon's MERN Full-Stack Developer Portfolio.

---

## 1. System Topology

```
                  ┌──────────────────────────────────────────┐
                  │                 CLIENT                   │
                  │   Next.js 16 (App Router, Turbopack)     │
                  │      Hosted on Vercel Edge/Serverless    │
                  └─────────────┬───────────────────▲────────┘
                                │                   │
                        REST API Calls         JSON / SSR
                                │                   │
                  ┌─────────────▼───────────────────┴────────┐
                  │              EXPRESS API                 │
                  │   Node.js, Express, Helmet, Rate Limit   │
                  │            Hosted on Render              │
                  └─────────────┬────────────────────────────┘
                                │
                         Mongoose ODM
                                │
                  ┌─────────────▼────────────────────────────┐
                  │             DATABASE                     │
                  │        MongoDB Atlas Cluster             │
                  └──────────────────────────────────────────┘
```

---

## 2. Technology Stack & Justification

| Layer | Technology | Justification |
|-------|------------|---------------|
| **Frontend** | Next.js 16 + React 19 + TypeScript | Server Components allow zero-JS initial render and instant SEO indexing. Client boundaries handle Framer Motion interactivity. |
| **Styling** | Tailwind CSS v4 | Modular design tokens (`--color-bg`, `--color-surface`, `--color-accent`) matching the warm ink + amber "terminal" aesthetic. |
| **Backend** | Express 4 + Node.js + TypeScript | High-performance, lightweight REST API with clear separation of concerns (routes, middleware, models). |
| **Database** | MongoDB Atlas + Mongoose | Flexible document model for structured case studies, dynamic project ordering, and nested tech stacks. |
| **Auth** | JWT + bcryptjs | Secure admin access via httpOnly cookies or Authorization Bearer tokens. Password hashes never returned. |
| **Storage** | Cloudinary CDN | High-performance image and resume PDF delivery with automated optimization and transformation. |

---

## 3. Data Models (Mongoose)

1. **Admin**: `{ email, passwordHash, timestamps }`
2. **Profile** (Singleton): `{ name, displayName, role, tagline, avatarUrl, photoUrl, location, email, linkedin, github, aboutParagraphs[], currently, resumeUrl }`
3. **Skill**: `{ name, category: 'frontend' | 'backend' | 'tools' | 'ml-data', icon?, order }`
4. **Project**: `{ slug, title, tagline, problem, description, role, features[], stack[], liveUrl, repoUrl, coverImage, screenshots[], setupInstructions, improvements, type, featured, order, status, source, linkStatus }`
5. **Message**: `{ name, email, message, read, ipHash, createdAt }`

---

## 4. Security & Performance Measures

- **Helmet**: Secures HTTP response headers against clickjacking, XSS, and MIME-sniffing.
- **Strict CORS**: Whitelists frontend origin (`CLIENT_ORIGIN`), supports secure credential sharing.
- **Rate Limiting**:
  - Contact Form: 5 requests per 15 minutes per IP.
  - Admin Login: 10 attempts per 15 minutes per IP.
- **Honeypot Anti-Spam**: Contact form contains a hidden input (`website`). Submissions with content are silently accepted without database insertion.
- **Cold-Start Resilience**: The frontend implements seed-data fallback if the free-tier backend is spinning up, ensuring 100% uptime perception.
