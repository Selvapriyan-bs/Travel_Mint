# TravelMint - Travel Booking Portal

## Software Requirements Specification (SRS)

### Version 1.0

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Architecture](#2-system-architecture)
3. [Technology Stack](#3-technology-stack)
4. [Features Overview](#4-features-overview)
5. [Page-Wise Functional Requirements](#5-page-wise-functional-requirements)
6. [Component Architecture](#6-component-architecture)
7. [API Integration](#7-api-integration)
8. [Authentication & Authorization](#8-authentication--authorization)
9. [Payment Integration](#9-payment-integration)
10. [Routing](#10-routing)
11. [Styling & Design System](#11-styling--design-system)
12. [Data Flow](#12-data-flow)
13. [Non-Functional Requirements](#13-non-functional-requirements)
14. [Installation & Setup](#14-installation--setup)
15. [Available Scripts](#15-available-scripts)

---

## 1. Introduction

### 1.1 Purpose

TravelMint is a modern, responsive travel booking portal that allows users to browse travel packages, view detailed itineraries, book trips with online payment, read travel blogs, and manage their bookings. The application also provides an administrative dashboard for managing packages, bookings, blog posts, and contact inquiries.

### 1.2 Scope

The system is a **single-page application (SPA)** frontend built with React that consumes REST APIs from a remote Node.js/Express/MongoDB backend hosted at `https://trip-agent-backend.onrender.com`. It covers the complete travel booking lifecycle — from discovery and search to booking, payment, and post-booking management.

### 1.3 Definitions & Acronyms

| Term | Definition |
|------|------------|
| SPA | Single Page Application |
| SRS | Software Requirements Specification |
| API | Application Programming Interface |
| CRUD | Create, Read, Update, Delete |
| OTP | One-Time Password |
| MERN | MongoDB, Express, React, Node.js |
| MUI | Material-UI (Material Design components) |

---

## 2. System Architecture

TravelMint follows a **client-server architecture** with a decoupled frontend and backend:

```
┌──────────────────────────────────────────────────┐
│                 Client (Browser)                 │
│  ┌───────────────────────────────────────────┐   │
│  │         TravelMint React SPA              │   │
│  │  ┌─────────┐ ┌──────────┐ ┌───────────┐   │   │
│  │  │  Pages  │ │Components│ │  Routing  │   │   │
│  │  └────┬────┘ └────┬─────┘ └─────┬─────┘   │   │
│  │       │           │             │         │   │
│  │  ┌────▼───────────▼─────────────▼─────┐   │   │
│  │  │          Axios HTTP Client         │   │   │
│  │  └────────────────┬───────────────────┘   │   │
│  └───────────────────┼───────────────────────┘   │
│                      │ HTTPS                     │
└──────────────────────┼───────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────┐
│           Backend API (Render Hosted)            │
│  ┌───────────────────────────────────────────┐   │
│  │      Node.js + Express + MongoDB          │   │
│  │  ┌────────┐ ┌────────────┐ ┌──────────┐   │   │
│  │  │ Routes │ │Controllers │ │  Models  │   │   │
│  │  └────────┘ └────────────┘ └──────────┘   │   │
│  └───────────────────────────────────────────┘   │
└──────────────────────────────────────────────────┘
```

The frontend is deployed as a static build to any web server, while the backend runs independently on Render.

---

## 3. Technology Stack

### 3.1 Frontend (This Repository)

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.6 | UI Library |
| React Router DOM | 7.16.0 | Client-side routing |
| Axios | 1.17.0 | HTTP client for API calls |
| Material-UI (MUI) | 9.0.1 | Component library & design system |
| FontAwesome | 7.2.0 | Icon library |
| Bootstrap | 5.3.8 | Utility CSS framework |
| Lucide React | 1.17.0 | Icon components |
| Styled Components | 6.4.2 | CSS-in-JS styling |
| React Hot Toast | 2.6.0 | Toast notifications |
| Emotion | 11.x | CSS-in-JS engine |
| React Scripts | 5.0.1 | Build tooling (CRA) |

### 3.2 Backend (External Hosted Service)

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express | Web framework |
| MongoDB | Database |
| Mongoose | ODM |

### 3.3 Payment Gateway

| Service | Type | Key |
|---------|------|-----|
| Razorpay | Test Mode | `rzp_test_T0DZh4Na6BlOyI` |

---

## 4. Features Overview

### 4.1 User-Facing Features

- Browse travel packages with rich UI
- Advanced package search with filters (country, price range, duration)
- Day-by-day itinerary view for each package
- Online booking with interactive calendar
- Razorpay payment integration
- User registration and login
- Password reset via OTP (Forgot Password flow)
- User dashboard with booking history, reward points, and loyalty tiers
- Blog system with category filters and search
- Contact form with FAQ accordion
- Static informational pages (About, Privacy Policy, Terms of Service)

### 4.2 Admin Features

- Dashboard with statistics (total bookings, revenue, destinations, new bookings)
- CRUD management for travel packages
- CRUD management for blog posts
- Booking status management (assign agent, booked, contacted, on-trip, done)
- Contact message viewing and management

---

## 5. Page-Wise Functional Requirements

### 5.1 Homepage (`/`)

| Feature | Description |
|---------|-------------|
| Hero Section | Full-screen background video (`homepage_vid.mp4`) with tagline and CTA buttons |
| Stats Counter | Animated counters: 10k+ Travelers, 50+ Destinations, 4.9 Rating, 12+ Years |
| Summer Sale Banner | Promotional banner with countdown timer |
| Trending Destinations | Carousel grid of packages fetched from `/api/package` |
| Travel Styles | Category cards (Adventure, Cultural, Beach, Wildlife, etc.) |
| Limited-Time Deals | Countdown-timed deal cards with discounted prices |
| Why TravelMint | Feature highlight section (handpicked hotels, expert guides, 24/7 support) |
| Trusted Partners | Logo showcase of partner brands |
| Testimonials | Customer review carousel |
| Blog Preview | Latest 3 blog posts from `/api/blog` |
| Live Booking Feed | Scrolling ticker of recent bookings |

### 5.2 Destination (`/destination`)

| Feature | Description |
|---------|-------------|
| Hero Banner | Section header with background image |
| Package Grid | Responsive grid displaying all packages from `/api/package` |
| Package Card | Image, title, location, duration, rating, price per package |

### 5.3 Search (`/search`)

| Feature | Description |
|---------|-------------|
| Sidebar Filters | Keyword search, country checkboxes, price range, duration |
| Price Ranges | Under ₹35k, ₹35k–₹50k, ₹50k–₹65k, ₹65k+ |
| Duration Filters | 1–5 days, 6–8 days, 9+ days |
| Sort Options | Most Popular, Price: Low to High, Price: High to Low, Highest Rated |
| Reset Filters | One-click filter reset |
| Result Grid | Filtered and sorted package cards |

### 5.4 Package Details (`/package/:id`)

| Feature | Description |
|---------|-------------|
| Hero Section | Large package image with overlay |
| Summary Bar | Destination name, country, duration, star rating, price |
| Day-by-Day Itinerary | Tab/accordion selector showing hotel, start/end points, activities per day |
| Book Now CTA | Button navigating to booking page with package context |

### 5.5 Booking (`/booking`)

| Feature | Description |
|---------|-------------|
| Calendar Picker | Month navigation, quick-select chips (Weekend, Next Week, This Month) |
| Passenger Form | Full name, email, phone, address fields |
| Trip Summary Sidebar | Package image, details, price breakdown, total |
| Payment Gateway | Razorpay checkout integration in INR |
| Booking Confirmation | POST to `/api/booking/add` after successful payment |

### 5.6 Login (`/login`)

| Feature | Description |
|---------|-------------|
| Email & Password Form | Input fields with validation |
| Remember Me | Checkbox to persist session |
| Forgot Password Link | Navigates to `/forgot-password` |
| Register Link | Navigates to `/register` |
| Session Storage | Credentials stored in `localStorage` under key `RegistrationData` |

### 5.7 Register (`/register`)

| Feature | Description |
|---------|-------------|
| Registration Form | Full name, email, password (min 8 chars) |
| Terms Agreement | Checkbox for accepting terms |
| Role Assignment | User registered with `role: "user"` (admin role is pre-seeded in backend) |
| API Call | POST to `/api/user/signup` |

### 5.8 Forgot Password (`/forgot-password`)

| Feature | Description |
|---------|-------------|
| Step 1 | Enter email, receive OTP via `/api/user/forgot-password` |
| Step 2 | Enter OTP + new password + confirm password |
| Password Reset | POST to `/api/user/reset-password` |

### 5.9 User Dashboard (`/dashboard`)

| Feature | Description |
|---------|-------------|
| Login Guard | Lock screen overlay if user is not authenticated |
| Welcome Hero | Greeting with user name |
| Stats Cards | Active Itineraries, Reward Points, Trips Completed |
| Booking History Table | Package name, destination, date, status, actions |
| Account Info Section | User details display |
| Recommended Journeys | Sidebar with suggested packages |

### 5.10 Admin Dashboard (`/admin`)

| Feature | Description |
|---------|-------------|
| Sidebar Navigation | Dashboard, Bookings, Destinations, Blog Posts, Messages, View Website, Logout |
| Dashboard Stats | Total Bookings, Revenue (₹), Total Destinations, New Bookings This Month |
| Recent Bookings Table | User, package, date, status, actions |
| Bookings Management | CRUD table with status dropdown (Assign Agent, Booked, Contacted, On Trip, Done) |
| Destinations Management | Modal-based CRUD for packages (image URL, title, description, country, duration, price, rating, reviews, days array with hotel/location/activities) |
| Blog Management | Modal-based CRUD for blog posts (image, title, excerpt, category, author, content) |
| Messages Management | View and manage contact form submissions |
| Delete Confirmation | Modal confirmation before deletion |

### 5.11 Blog (`/blog`)

| Feature | Description |
|---------|-------------|
| Category Filters | All, Guides, Culture, Dining |
| Search Bar | Keyword search across blog posts |
| Featured Post | Hero card highlighting most recent post |
| Article Grid | Paginated card grid with image, title, excerpt, date |

### 5.12 Blog Detail (`/blog/:id`)

| Feature         | Description                                                               |
|-----------------|---------------------------------------------------------------------------|
| Hero Section    | Blog image with title overlay                                             |
| Article Content | Rich text content area (generates sample lorem content if empty from API) |
| Back Navigation | Link to return to blog listing                                            |

### 5.13 About (`/about`)

| Feature       | Description                                                |
|---------------|------------------------------------------------------------|
| Company Story | Narrative about the agency's founding                      |
| Core Values   | Value cards (Trust, Innovation, Sustainability, Community) |
| Statistics    | 15k+ Travelers, 250+ Guides, 4.92 Rating                   |
| Team Section  | Founder/co-founder profiles                                |

### 5.14 Contact (`/contact`)

| Feature       | Description                                                  |
|---------------|--------------------------------------------------------------|
| Contact Form  | Name, email, phone, subject, message fields                  |
| Agency Info   | Phone, email, physical address display                       |
| Embedded Map  | Location map iframe                                          |
| FAQ Accordion | 4 questions covering booking, cancellation, payment, contact |

### 5.15 Privacy Policy (`/privacy`)

| Feature | Description |
|---------|-------------|
| Static Content | 8 sections covering data collection, usage, cookies, rights, etc. |

### 5.16 Terms of Service (`/terms`)

| Feature | Description |
|---------|-------------|
| Static Content | 8 sections covering acceptance, bookings, payments, cancellations, liability, etc. |

---

## 6. Component Architecture

### 6.1 Shared Components

| Component | File | Description |
|-----------|------|-------------|
| Navbar | `src/Components/Navbar.jsx` | Responsive navigation with auth-aware links; shows admin link for admin users; hamburger menu on mobile |
| Footer | `src/Components/Footer.jsx` | Multi-section footer with newsletter signup, quick links, social media icons, contact info |
| ScrollToTop | `src/Components/ScrollToTop.jsx` | Scrolls window to top on every route change |
| SnackbarProvider | `src/Components/SnackbarProvider.jsx` | MUI Snackbar context provider for global toast notifications |

### 6.2 Component Tree

```
<App>
  <SnackbarProvider>
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <AppRoutes>
        <Homepage />
        <Destination />
        <Search />
        <PackageDetails />
        <Booking />
        <Login />
        <Register />
        <ForgotPassword />
        <UserDashboard />
        <Admin />
        <Blog />
        <BlogDetail />
        <About />
        <Contact />
        <Privacy />
        <Terms />
      </AppRoutes>
      <Footer />
    </BrowserRouter>
  </SnackbarProvider>
</App>
```

---

## 7. API Integration

### 7.1 Base URL

```
https://trip-agent-backend.onrender.com
```

All API calls are made via **Axios** with hardcoded base URLs within each component.

### 7.2 Endpoints

| Endpoint                    | Method | Description            | Used In                              |
|-----------------------------|--------|------------------------|--------------------------------------|
| `/api/package`              | GET    | Fetch all packages     | Homepage, Destination, Search, Admin |
| `/api/package/:id`          | GET    | Fetch single package   | PackageDetails, Booking              |
| `/api/package/post`         | POST   | Create new package     | Admin                                |
| `/api/package/:id`          | PUT    | Update package         | Admin                                |
| `/api/package/:id`          | DELETE | Delete package         | Admin                                |
| `/api/blog`                 | GET    | Fetch all blog posts   | Blog, Admin                          |
| `/api/blog/:id`             | GET    | Fetch single blog post | BlogDetail                           |
| `/api/blog/post`            | POST   | Create blog post       | Admin                                |
| `/api/blog/:id`             | PUT    | Update blog post       | Admin                                |
| `/api/blog/:id`             | DELETE | Delete blog post       | Admin                                |
| `/api/booking`              | GET    | Fetch all bookings     | Footer, Admin, UserDashboard         |
| `/api/booking/add`          | POST   | Create booking         | Booking                              |
| `/api/booking/:id`          | PUT    | Update booking status  | Admin                                |
| `/api/user/login`           | POST   | User login             | Login                                |
| `/api/user/signup`          | POST   | User registration      | Register                             |
| `/api/user/forgot-password` | POST   | Send OTP               | ForgotPassword                       |
| `/api/user/reset-password`  | POST   | Reset password         | ForgotPassword                       |
| `/api/contact`              | POST   | Submit contact form    | Contact                              |

### 7.3 Response Handling

API responses are normalized within each component to handle both:
- Array responses (direct array)
- Object-wrapped responses (`response.data.data` pattern)

Fallback/empty-state data is displayed when API calls fail or return no results.

---

## 8. Authentication & Authorization

### 8.1 Session Management

- **Storage Mechanism:** `localStorage` (key: `RegistrationData`)
- **Data Stored:** `{ name, email, role, password? }`
- **Auth Check:** Each page checks `localStorage` on mount and maintains a `useState` variable
- **Login Action:** POST credentials to `/api/user/login`, store response in localStorage
- **Logout Action:** Clear `RegistrationData` from localStorage and reset component state
- **No JWT or HTTP-only cookies** are used in this frontend implementation

### 8.2 Role-Based Access

| Role    | Access                                               |
|---------|------------------------------------------------------|
| `admin` | Admin dashboard, CRUD operations, all user features  |
| `user`  | Browse, search, book, dashboard, blog, contact       |
│---------│------------------------------------------------------│

### 8.3 Protected Areas

- `/admin` — Accessible only when `role === "admin"`
- `/dashboard` — Shows login guard overlay when not authenticated

---

## 9. Payment Integration

### 9.1 Payment Gateway

- **Provider:** Razorpay
- **Mode:** Test (key: `rzp_test_T0DZh4Na6BlOyI`)
- **Currency:** INR
- **Integration:** Razorpay checkout script loaded from `https://checkout.razorpay.com/v1/checkout.js`

### 9.2 Payment Flow

```
1. User fills booking form (date, passenger details)
2. System calculates total (package price + GST + convenience fee)
3. User clicks "Proceed to Pay"
4. Razorpay checkout modal opens
5. User completes payment (UPI, card, netbanking, wallet)
6. On success → POST booking data to /api/booking/add
7. User redirected with success notification
```

---

## 10. Routing

### 10.1 Route Table

All routes defined in `src/Routers/AppRoutes.jsx`:

| Path             | Component      | Auth Required | Role Required |
|------------------|----------------|---------------|---------------|
| `/`              | Homepage       | No            | —             |
| `/destination`   | Destination    | No            | —             |
| `/search`        | Search         | No            | —             |
| `/package/:id`   | PackageDetails | No            | —             |
| `/booking`       | Booking        | No            | —             |
| `/login`         | Login          | No            | —             |
| `/register`      | Register       | No            | —             |
| `/forgotpassword`| ForgotPassword | No            | —             |
| `/dashboard`     | UserDashboard  | Yes           | User          |
| `/admin`         | Admin          | Yes           | Admin         |
| `/blog/:id`      | BlogDetail     | No            | —             |
| `/blog`          | Blog           | No            | —             |
| `/about`         | About          | No            | —             |
| `/contact`       | Contact        | No            | —             |
| `/privacy`       | Privacy        | No            | —             |
| `/terms`         | Terms          | No            | —             |

---

## 11. Styling & Design System

### 11.1 CSS Architecture

| File                         | Lines | Purpose                                           |
|------------------------------|-------|---------------------------------------------------|
| `src/App.css`                | ~3440 | Complete design system with CSS custom properties |
| `src/Assets/Css/Admin.css`   | 501   | Admin modal and portal styles                     |
| `src/Assets/Css/Contact.css` | 167   | Contact page-specific styles                      |

### 11.2 Design Tokens

CSS Custom Properties defined in `:root`:

```css
--primary: #2563eb;
--primary-dark: #1d4ed8;
--secondary: #f59e0b;
--accent: #10b981;
--bg-primary: #ffffff;
--bg-secondary: #f8fafc;
--text-primary: #1e293b;
--text-secondary: #64748b;
--glass-bg: rgba(255, 255, 255, 0.1);
--glass-border: rgba(255, 255, 255, 0.2);
--glass-blur: blur(10px);
--shadow-sm, --shadow-md, --shadow-lg, --shadow-xl;
--radius-sm, --radius-md, --radius-lg, --radius-xl;
```

### 11.3 Themes

| Theme           | Context      | Key Characteristics                                             |
|-----------------|--------------|-----------------------------------------------------------------|
| Light (Default) | Public pages | White backgrounds, blue primary, glassmorphism effects          |
| Dark            | Admin panel  | Dark backgrounds, adjusted contrast, separate `:root` overrides |

### 11.4 UI Effects

- Glassmorphism (backdrop blur, semi-transparent backgrounds)
- Gradient text effects
- Animated counters
- Countdown timers
- Hover scale transitions
- Shadow elevation on interaction

---

## 12. Data Flow

### 12.1 Request Lifecycle

```
User Action → Component State Update → Axios API Call → 
Backend Response → State Update → Re-render UI
```

### 12.2 Booking Data Flow

```
Search Package → View Details → Click Book Now →
Select Date → Fill Passenger Details → Razorpay Payment →
POST Booking to Backend → Confirmation UI
```

### 12.3 Admin Data Flow

```
Admin Login → Dashboard Load (GET stats/bookings) →
Select Entity (Package/Blog/Booking/Message) →
CRUD Operation → API Call → Refresh Data
```

---

## 13. Non-Functional Requirements

| Requirement     |            Description                                                                                    |
|-----------------|-----------------------------------------------------------------------------------------------------------│
| Responsiveness  | Mobile-first responsive design; works on all screen sizes                                                 |
| Performance     | Static build with code splitting; lazy load where applicable                                              |
| Accessibility   | Semantic HTML, ARIA labels, keyboard navigation                                                           |
| Browser Support | Modern browsers (Chrome, Firefox, Safari, Edge)                                                           |
| Error Handling  | Toast notifications for errors; fallback UI for failed API calls                                          |
| Security        | Client-side validation; no sensitive data in localStorage (note: production should use HTTP-only cookies) |

---

## 14. Installation & Setup

### 14.1 Prerequisites

- Node.js (v16 or higher)
- npm (v8 or higher)

### 14.2 Installation

```bash
git clone <repository-url>
cd basic1
npm install
```

### 14.3 Development

```bash
npm start
```

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### 14.4 Production Build

```bash
npm run build
```

Creates an optimized production build in the `build/` folder.

### 14.5 Run Tests

```bash
npm test
```

Launches the test runner in interactive watch mode.

---

## 15. Available Scripts

| Script | Command         |Description                                 |
|--------|-----------------|--------------------------------------------|
| Start  | `npm start`     | Run development server on port 3000        |
| Build  | `npm run build` | Create production build in `build/`        |
| Test   | `npm test`      | Run test suite                             |
| Eject  | `npm run eject` | Eject from Create React App (irreversible) |

---

## Project Structure

```
basic1/
├── public/                    # Static assets
│   ├── index.html            # HTML entry point
│   ├── homepage_vid.mp4      # Hero background video
│   ├── favicon.ico           # Browser tab icon
│   ├── manifest.json         # PWA manifest
│   └── robots.txt            # Crawler rules
├── src/                      # Application source code
│   ├── index.js              # React entry point
│   ├── index.css             # Global CSS reset
│   ├── App.js                # Root component with router
│   ├── App.css               # Complete design system (~3440 lines)
│   ├── App.test.js           # App component test
│   ├── reportWebVitals.js    # Performance measurement
│   ├── setupTests.js         # Test configuration
│   ├── script.js             # Legacy/fallback JS interactions
│   ├── logo.svg              # App logo
│   ├── Assets/
│   │   ├── Css/
│   │   │   ├── Admin.css     # Admin panel styles (501 lines)
│   │   │   └── Contact.css   # Contact page styles (167 lines)
│   ├── Components/
│   │   ├── Navbar.jsx        # Navigation bar
│   │   ├── Footer.jsx        # Footer with newsletter & links
│   │   ├── ScrollToTop.jsx   # Auto scroll-to-top on route change
│   │   └── SnackbarProvider.jsx  # Toast notification context
│   ├── Routers/
│   │   └── AppRoutes.jsx     # All route definitions
│   └── *.jsx                 # Page components (16 pages)
│       ├── Homepage.jsx
│       ├── About.jsx
│       ├── Admin.jsx
│       ├── Blog.jsx
│       ├── BlogDetail.jsx
│       ├── Booking.jsx
│       ├── Contact.jsx
│       ├── Destination.jsx
│       ├── ForgotPassword.jsx
│       ├── Login.jsx
│       ├── PackageDetails.jsx
│       ├── Privacy.jsx
│       ├── Register.jsx
│       ├── Search.jsx
│       ├── Terms.jsx
│       └── UserDashboard.jsx
└── build/                    # Production build output
```

---

## API Endpoint Summary

```
BASE: https://trip-agent-backend.onrender.com

GET    /api/package          → All packages
GET    /api/package/:id      → Single package
POST   /api/package/post     → Create package (Admin)
PUT    /api/package/:id      → Update package (Admin)
DELETE /api/package/:id      → Delete package (Admin)

GET    /api/blog             → All blog posts
GET    /api/blog/:id         → Single blog post
POST   /api/blog/post        → Create blog post (Admin)
PUT    /api/blog/:id         → Update blog post (Admin)
DELETE /api/blog/:id         → Delete blog post (Admin)

GET    /api/booking          → All bookings (Admin)
POST   /api/booking/add      → Create booking
PUT    /api/booking/:id      → Update booking status (Admin)

POST   /api/user/login       → User login
POST   /api/user/signup      → User registration
POST   /api/user/forgot-password  → Send password reset OTP
POST   /api/user/reset-password   → Reset password with OTP

POST   /api/contact          → Submit contact form
```

---

*Document generated from codebase analysis. TravelMint — Your Gateway to Extraordinary Journeys.*
