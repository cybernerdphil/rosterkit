# RosterKit — Setup Guide

**Version:** 1.0.0  
**Built by:** ProductivityByPhil  
**Bundle ID:** com.philvieyra.rosterkit

---

## Folder structure

```
RosterKit/
├── index.html              ← Main PWA (both modes — deploy this)
├── manifest.json           ← PWA manifest
├── service-worker.js       ← Offline caching
├── manager.html            ← Manager mode standalone reference
├── staff-availability.html ← Staff form standalone reference
├── assets/
│   ├── icon-192.png        ← Replace with final icon before launch
│   ├── icon-512.png        ← Replace with final icon before launch
│   ├── screenshot-staff.png    ← Replace with real screenshots
│   └── screenshot-manager.png  ← Replace with real screenshots
└── SETUP.md                ← This file
```

---

## Local testing

Open `index.html` directly in Safari on Mac — the PWA will work in the browser without a server. Service worker requires HTTPS to register, so for full offline testing use GitHub Pages or a local HTTPS server.

```bash
# Quick local HTTPS server (requires Node.js)
npx serve . --ssl
```

---

## GitHub Pages deployment (required for Capacitor)

Capacitor's WKWebView requires HTTPS. GitHub Pages provides this for free.

1. Create a repo: `github.com/[username]/rosterkit-pwa`
2. Push all files in this folder to the `main` branch
3. Go to repo Settings → Pages → Source: `main` branch, `/ (root)`
4. Your PWA is live at: `https://[username].github.io/rosterkit-pwa/`

---

## Capacitor — iOS App Store build

```bash
# 1. Install Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/ios

# 2. Initialise
npx cap init "RosterKit" com.philvieyra.rosterkit

# 3. Set webDir in capacitor.config.json:
#    "webDir": "." (or point to this folder)

# 4. Add iOS platform
npx cap add ios

# 5. Copy web assets
npx cap copy

# 6. Open in Xcode
npx cap open ios
```

**In Xcode:**
- Target → Signing & Capabilities → select Apple Developer Team
- Enable Automatically manage signing
- Set version: 1.0.0, build: 1
- Minimum deployment target: iOS 16
- Product → Archive → Validate → Distribute (App Store Connect)

**Mac App Store:**
- Target → General → Deployment Info → check "Mac (Designed for iPad)"

---

## IAP setup

Product ID: `com.philvieyra.rosterkit.unlock`  
Type: Non-Consumable  
Price: Set in App Store Connect (target ~$12.99–$14.99 AUD)

Install Capacitor IAP plugin before Xcode build:
```bash
npm install @capacitor-community/in-app-purchases
npx cap sync
```

Then replace the `purchasePro()` stub in `manager.html` with the real plugin call.

---

## Assets to replace before submission

| File | Required size | Notes |
|---|---|---|
| `assets/icon-192.png` | 192×192 | No alpha, no rounded corners |
| `assets/icon-512.png` | 512×512 | No alpha, maskable |
| App Store icon | 1024×1024 | Upload in App Store Connect |
| `assets/screenshot-staff.png` | 1290×2796 | iPhone 15 Pro Max |
| `assets/screenshot-manager.png` | 1290×2796 | iPhone 15 Pro Max |

---

## Privacy policy

Required before App Store submission. Host a simple page covering:
- Data stored locally only (localStorage)
- No server transmission except email (user-initiated)
- iCloud backup optional and user-controlled
- No third-party analytics or tracking

---

## Industry variants rollout

Once RosterKit is approved, roll out one industry variant per week:

| Week | Variant | Bundle ID |
|---|---|---|
| 1 | Hospitality Roster | com.philvieyra.rosterkit.hospitality |
| 2 | Security Roster | com.philvieyra.rosterkit.security |
| 3 | Retail Roster | com.philvieyra.rosterkit.retail |
| 4 | PT / Fitness Roster | com.philvieyra.rosterkit.pt |

Each variant: reskin colours, pre-seed jobs/roles, update copy, new bundle ID, new App Store record.

---

*ProductivityByPhil — RosterKit v1.0.0*
