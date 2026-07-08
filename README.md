# RetinaScan AI - Frontend Client

This is the frontend client for RetinaScan AI, built with **React, Vite, and Vanilla CSS**. It implements a high-end, dark-themed medical diagnostic dashboard incorporating glassmorphism, responsive grids, and micro-animations.

---

## Workspace Key Features

*   **Interactive Attributions Layer:** Stacks the original retinal fundus image and the Grad-CAM model overlay absolutely. Mix blend modes are used to isolate hotspots directly over vessel branches.
*   **Blending Opacity Slider:** Binded range sliders allow users to adjust the transparency of the Grad-CAM layer dynamically from 0% (only structural retina) to 100% (full model activation).
*   **Procedural Retina Selector:** Renders 3 preset diagnostic cases (Normal, Moderate, Proliferative) onto canvas objects. Clicking a preset converts it to a file stream and posts it to the backend immediately, bypassing the need for local image assets.
*   **Feature Inspector Panels:** Interactive cards that explain clinical details of target lesions (exudates, hemorrhages, neovascularization, microaneurysms) when queried.
*   **Active Server Health Badges:** Automatically checks backend connectivity via periodic health-checks on `/status`.

---

## Directory Organization

```
frontend/
  ├── package.json              # Vite scripts and dependencies
  ├── index.html                # Entry HTML wrapper
  ├── eslint.config.js          # ESLint rules configuration
  └── src/
       ├── main.jsx             # React entry mount
       ├── App.jsx              # Application state and workspace grids
       ├── styles/
       │    └── index.css       # Design tokens, scrollbars, and keyframes
       └── components/
            ├── ImageUpload.jsx      # Drag-and-drop drop-zone with scanners
            ├── SampleSelector.jsx   # Procedural canvas case generators
            └── PredictionResult.jsx # Blending workstation and inspector cards
```

---

## Commands Reference

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start Vite development server:**
    ```bash
    npm run dev
    ```
    *Loads the workstation at `http://localhost:5173`.*
4.  **Production build compile:**
    ```bash
    npm run build
    ```
    *Compiles optimized bundles to the `dist/` directory.*
5.  **Lint check validation:**
    ```bash
    npm run lint
    ```
    *Validates syntax and structural rules using ESLint.*
