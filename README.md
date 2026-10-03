# PhysicsWidgets

[![Deploy to GitHub Pages](https://github.com/OLDRICHPRIKLENK/PhysicsWidgets/actions/workflows/deploy.yml/badge.svg)](https://github.com/OLDRICHPRIKLENK/PhysicsWidgets/actions/workflows/deploy.yml)

A static GitHub Pages viewer for physics visualizations and mathematical widgets generated from analytical equations and physical experiments. Created and maintained by **Oldrich Priklenk**.

Live Website: **[https://OLDRICHPRIKLENK.github.io/PhysicsWidgets](https://OLDRICHPRIKLENK.github.io/PhysicsWidgets)**

---

## 📐 Aesthetics & Architecture

- **1930s Academic Monograph Tone**: Minimalist, austere mathematical instrument aesthetic. Dark graphite drafting paper tones (`#0c0c0d`), subtle coordinate rules, and warm archival ink palettes.
- **Classical Academic Typography**: Thin serif display font (*EB Garamond*) paired with precise monospace notation (*IBM Plex Mono*).
- **Separation of Concerns**: Pure website logic lives in `/src`, while pure physics visualization HTML artifacts live in `/widgets` (mirroring the `AnalyticalPhysics` taxonomy).
- **Sandboxed `<iframe>` Isolation**: Every widget is executed inside an isolated sandbox frame, guaranteeing that computational models and HTML canvases run independently without stylesheet or React state collisions.
- **Mobile Responsive Strict Vertical Alignment**: On phones and narrow screens, widgets follow a strict vertical layout with the visualization canvas frame on top and tunable parameters at the bottom.
- **Dynamic Tree Navigation (`import.meta.glob`)**: Adding any new `.html` file under `/widgets` automatically discovers it and builds the nested sidebar hierarchy at build time.
- **Shareable Hash Routing**: Built with `HashRouter` (`/#/Geometries/cyllinder`) for zero 404 routing errors on static GitHub Pages.

---

## 📁 Directory Structure

```text
PhysicsWidgets/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions auto-deploy pipeline
├── public/                     # Static assets
├── widgets/                    # Pure HTML/JS physics widgets (mirrors AnalyticalPhysics)
│   ├── Geometries/
│   │   ├── cyllinder.html      # Interactive quaternion superquadrics manifold
│   │   └── future_visualisation.html # 4D tesseract hypercube projection
│   ├── EMFields/
│   │   └── stub.html           # Oscillating dipole electric field visualizer
│   └── Relativity/
│       ├── lorentz_boost.html  # Spacetime light cone & Lorentz boost
│       └── stub.html           # Unresolved field theoretical inquiry stub
├── src/
│   ├── components/             # Reusable UI components (DRY / SRP)
│   │   ├── AboutSection.tsx    # Academic about archive & curator line
│   │   ├── CosmicBackground.tsx # Subtle Cartesian drafting coordinate grid
│   │   ├── Footer.tsx          # Minimalist colophon footer
│   │   ├── FractalCanvas.tsx   # Monochromatic Julia set etching
│   │   ├── GithubIcon.tsx      # SVG GitHub brand icon
│   │   ├── HeroSection.tsx     # Welcome plate with embedded cylinder widget
│   │   ├── Navbar.tsx          # Minimalist academic masthead
│   │   ├── Sidebar.tsx         # Table of contents drawer with search
│   │   ├── SidebarTree.tsx     # Hierarchical collapsible folder tree
│   │   └── WidgetIframe.tsx    # Sandboxed isolated iframe renderer
│   ├── pages/
│   │   ├── HomePage.tsx        # Hero plate + About section + Colophon
│   │   ├── ViewerPage.tsx      # Dedicated apparatus workbench
│   │   └── NotFoundPage.tsx    # Technical 404 plate
│   ├── types/
│   │   └── widget.ts           # TypeScript interfaces for widgets & trees
│   ├── utils/
│   │   ├── widgetRegistry.ts   # Dynamic glob discovery, tree builder & routing
│   │   └── widgetRegistry.test.ts # Comprehensive unit tests
│   ├── App.tsx                 # HashRouter & global layout
│   ├── index.css               # Tailwind & academic styling rules
│   └── main.tsx                # React root mount
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 How to Add a New Widget

1. Place your self-contained `.html` widget inside `/widgets/<Category>/<your_widget>.html`.
   For example:
   ```bash
   widgets/QuantumMechanics/harmonic_oscillator.html
   ```
2. Include a `<title>` tag and optional `<meta name="description">` inside your HTML:
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <title>Quantum Harmonic Oscillator</title>
     <meta name="description" content="Wavefunction probability densities in 1D potential well.">
   </head>
   <body>
     <!-- Your HTML + JS simulation code here -->
   </body>
   </html>
   ```
3. Run `npm run build` or push to GitHub `main`/`master` branch.
   - Vite scans `/widgets` automatically.
   - The sidebar table of contents and search will update dynamically.
   - Your widget will be accessible at:
     ```text
     https://OLDRICHPRIKLENK.github.io/PhysicsWidgets/#/QuantumMechanics/harmonic_oscillator
     ```

---

## 🛠️ Development & Testing

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

### Run Automated Unit & Component Tests
```bash
npm test
```

### Build for Production
```bash
npm run build
```

---

## 📜 Deployment Workflow

The project includes an automated GitHub Actions pipeline in `.github/workflows/deploy.yml`:
1. **Triggered on push** to `main` or `master`.
2. **Runs test suite** (`npm test`) to guarantee stability.
3. **Builds static bundle** (`npm run build`).
4. **Deploys** directly to GitHub Pages.
