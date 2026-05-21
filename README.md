# 🩺 CapMinds – Appointment Scheduler

> **A Premium, Fully-Responsive Clinic & Practice Management Interface**
>
> 🚀 **Live Deployment URL:** [capminds-appointment-scheduler.web.app](https://capminds-appointment-scheduler.web.app/)

---

## 📖 Overview

**CapMinds – Appointment Scheduler** is a high-fidelity, interactive, and aesthetically refined scheduling web application designed for medical clinics and healthcare practices. Built on top of clean semantic **HTML5**, modern layout architectures with **CSS3 Custom Properties (CSS variables)**, and rich client-side logic with **ES6+ Javascript**, the application delivers a premium, smooth user experience similar to modern desktop calendar tools. 

To ensure instant operational usability, it implements robust client-side storage via **HTML5 LocalStorage** and automatically generates fallback seed data for immediate demonstration on first load.

---

## ✨ Key Features

The scheduler is divided into two primary, unified interfaces managed dynamically via a side navigation bar:

### 📅 1. Interactive Calendar View
*   **Dynamic Month Grid:** Renders a clean 35-day grid adapting automatically to the first day of the selected month, highlighting the current date.
*   **Month Selection Controls:** Seamlessly navigate between months using next (`›`), previous (`‹`), and `Today` buttons, or quickly jump to a specific month using the integrated drop-down select element.
*   **Appointment Event Chips:** Scheduled appointments are rendered as color-coded, inline badge chips showing the patient's name, booking status, and time. Hovering displays a detailed HTML tooltip.
*   **Quick Actions Menu:** Each event card contains embedded action triggers for quick management:
    *   📝 **Edit:** Pre-populates the modal for rapid changes.
    *   🗑️ **Delete:** Removes the appointment with safe user-confirmation.
    *   📄 **View:** Opens a read-only details card.
*   **Empty Cell Click-to-Schedule:** Clicking on any calendar cell instantly opens the booking form with that specific date pre-filled.

### 📊 2. Practice Dashboard View
*   **Consolidated Details Table:** A highly-readable tabular view displaying patient name, attending doctor, hospital branch, specialty area, chosen date, and precise time window.
*   **Multi-Criteria Real-Time Filters:**
    *   **Patient Search:** Immediate client-side matching.
    *   **Doctor Search:** Rapid sorting by attending specialist.
    *   **Date Range Selector:** Set `From` and `To` filters to narrow down schedules.
*   **Responsive Scrolling:** Supports overflow containers for perfect table readability on smaller viewports.

### 📝 3. Seamless Scheduling Form & Modals
*   **Visual Form Validation:** Complete client-side form checking. Empty required fields display a subtle red border transition and custom error prompts.
*   **Flexible Inputs:** Select from pre-configured hospital branches (e.g., *Salus Center*, *Ultracare*, *St. Mary's*) and specialties (e.g., *Dermatology*, *Cardiology*, *Neurology*, *Pediatrics*).
*   **Interactive Design:** Features modern, floating-style custom inputs with inline icons for excellent visual hierarchy.

### 🔔 4. UX and Micro-Interactions
*   **Fluid Toast Alerts:** Provides elegant confirmation messages (booked, updated, deleted) that slide into view and auto-dismiss after 3 seconds.
*   **Premium Animations:** The scheduling modal loads with a smooth `modalIn` zoom-fade animation accompanied by a modern `backdrop-filter: blur(2px)` overlay.
*   **Responsive Tri-State Sidebar:**
    1.  *Expanded Desktop:* Fully visible labels and icons.
    2.  *Collapsed Desktop:* Minimizes to an icon-only strip maximizing screen real estate.
    3.  *Mobile Draw Overlay:* Standard drawer toggle button on mobile, sliding in with an overlay backdrop.

---

## 🎨 Design System & Aesthetics

The application avoids standard browser defaults and generic styling. The UI utilizes a modern design token system driven by **CSS Variables** defined in `styles.css`:

```css
:root {
  --red: #d62b2b;              /* Brand Highlights */
  --blue: #1a6ef5;             /* Primary Accent Color (Buttons, Focus) */
  --blue-light: #e8f0fe;       /* Soft Highlights (Active States, Hovers) */
  --green: #22c55e;            /* Success States (Appt Chips, Save Actions) */
  --green-light: #dcfce7;      /* Success Badges */
  --red-del: #ef4444;          /* Destructive/Delete Actions & Errors */
  --text: #1e293b;             /* Sleek Slate Main Text */
  --text-muted: #64748b;       /* Slate Muted Text */
  --border: #e2e8f0;           /* Soft UI Dividers */
  --bg: #f1f5f9;               /* Soft Page Background */
  --white: #ffffff;
  --shadow: 0 4px 24px rgba(0, 0, 0, 0.08); /* Premium depth shadow */
  --radius: 12px;              /* Consistent rounded aesthetics */
}
```

*   **Typography:** The application imports and uses **DM Sans** (for clean body text and numeric displays) and **Playfair Display / Open Sans** (for branding structures).
*   **Micro-animations:** Hover transitions (`transition: background 0.15s, transform 0.1s`) on buttons, inputs, and list entries provide high-fidelity interactive feedback.

---

## 🛠️ Technology Stack

*   **HTML5:** Semantic architecture (`<header>`, `<aside>`, `<main>`) for optimal SEO and structure.
*   **CSS3:** Flexbox and Grid layouts, Custom Variables, media query breakpoints, modal scale animations, and backdrop blur.
*   **Vanilla JS (ES6+):** Pure DOM manipulation, localStorage management, data seeding, dynamic filters, and calendar generation.
*   **Firebase Hosting:** Deployed on standard, global CDN architecture.

---

## 📁 File Structure

```bash
Capminds_project/
├── .firebase/             # Firebase configuration cache
├── image/                 # Brand assets
│   └── capminds_logo.png  # CapMinds Favicon & Branding Logo
├── .firebaserc            # Firebase project targeting parameters
├── 404.html               # Default Firebase 404 handler
├── app.js                 # Unified state management, logic, and rendering engine
├── firebase.json          # Firebase deployment directory mappings
├── index.html             # HTML5 Structural Entry point and modal structure
├── styles.css             # Main styling, layout system, and responsive rules
└── README.md              # Documentation (This file)
```

---

## 🚀 Local Development Setup

To run the project locally on your machine, follow these steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed if you plan on serving via standard HTTP servers, or you can run any simple static server extension.

### 1. Clone or Open the Directory
Open your terminal and navigate to the project directory:
```bash
cd Capminds_project
```

### 2. Run a Local Development Server
For a smooth experience, you can serve the project using `npx`:
```bash
# Using 'serve' package
npx serve .

# Alternatively, if you have Python installed:
python -m http.server 8000
```
Open your browser and navigate to `http://localhost:3000` (or `http://localhost:8000`).

---

## 🌐 Deployment Configuration

The application is configured to run on **Firebase Hosting**. The configuration details are outlined below:

### `firebase.json`
Specifies that the root folder contains the public static assets:
```json
{
  "hosting": {
    "public": ".",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ]
  }
}
```

### `.firebaserc`
Targets the default live Firebase app instance:
```json
{
  "projects": {
    "default": "capminds-appointment-scheduler"
  }
}
```

### How to Deploy Updates
If you have the [Firebase CLI](https://firebase.google.com/docs/cli) installed, you can easily deploy modifications using:
```bash
# Login to your Google / Firebase Account
firebase login

# Deploy your public files to Firebase Hosting
firebase deploy --only hosting
```

---

## 🔒 State Management & Data Flow

1.  **Initialization:** The script calls `loadData()` to parse `'capminds_appointments'` from `localStorage`.
2.  **Seeding:** If no items exist, `seedData()` populates the state with mock records (scheduled for 2 and 5 days from today) to allow immediate viewing.
3.  **UI Updates:** Modifying state triggers `saveData()` followed by page-specific rendering (`renderCalendar()` and `renderDashboard()`).
4.  **Date/Time calculations:** 
    *   Date display format conversion is done via pure JS (`formatDisplayDate`).
    *   End times are automatically calculated by adding a standard 15-minute appointment duration to the start time (`formatTimeEnd`).

---

Developed with ❤️ for **CapMinds**. 
*For any queries, please visit the deployment URL or inspect [app.js](file:///c:/Users/indep/OneDrive/Documents/development/Capminds_project/app.js) and [styles.css](file:///c:/Users/indep/OneDrive/Documents/development/Capminds_project/styles.css) for implementation specifics.*
