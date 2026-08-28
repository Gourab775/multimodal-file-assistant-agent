# Multimodal File Workspace

Live Demo: https://gourab775.github.io/multimodal-file-assistant-agent

Category: File Processing & Document Automation

Stack: Next.js 16 · React 19 · TypeScript · Python · Workflow Engine · Tailwind CSS

## Overview

Multimodal File Workspace is a full-stack platform for automated document processing that analyzes uploaded files — images, PDFs, CSVs, Word, Excel, and text — and executes interactive operations via secure sandbox execution. The system auto-detects file types, loads specialized processing modules, runs Python and shell commands inside an isolated sandbox, and delivers generated outputs back to the user. A dual service architecture exposes both sandbox capabilities (code interpreter, commands, file I/O) and custom workspace tools (action suggestions, file delivery) through Platform Services.

Designed for enterprise document workflows, the platform combines a Next.js frontend with session-aware service orchestration to handle complex, multi-file transformations at scale.

## Features

- **Automated File-Type Skills** — Dynamically loads file-type-specific instruction sets (image, CSV, PDF, Word, Excel, text) to tailor system prompts and available operations per upload.
- **Secure Sandbox Execution** — Executes Python (Pillow, pandas, matplotlib, pdfplumber, python-docx) and shell commands (ffprobe, ffmpeg) in an isolated sandbox with automatic credential injection.
- **Interactive Action Cards** — Presents clickable action suggestions via custom tools; processed files are delivered as base64-downloadable links through a dedicated delivery module.
- **Session File Persistence** — Uploaded files persist across follow-up requests within the same workspace via an in-process cache that re-uploads to the sandbox on every turn.
- **Bilingual & Streaming UX** — Full Chinese/English interface with locale-aware outputs and real-time SSE streaming of text deltas, tool activity, and file results.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript 5.6 |
| Styling | Tailwind CSS 3.4, clsx, tailwind-merge |
| Backend Services | Python, Workflow Engine, Platform Services |
| Runtime | EdgeOne Makers, Cloud Functions (TypeScript/Node) |
| Execution | Sandbox (code interpreter, shell, file I/O) |
| Utilities | marked, zod, Jest |

## Project Structure

```
multimodal-file-assistant-agent/
├── services/                         # Service orchestration — formerly agents/
│   ├── chat/
│   │   ├── index.ts                  # POST /chat — session mgmt, file upload, SSE loop
│   │   ├── _skills.ts                # Dynamic prompt builder per file type
│   │   ├── _templates.ts             # PDF generation templates (CJK support)
│   │   └── _tools.ts                 # Shell quoting, fallback inlining, default actions
│   ├── stop/
│   │   └── index.ts                  # POST /stop — abort active run
│   ├── _model.ts                     # Model name resolution, gateway env mapping
│   └── _shared.ts                    # SSE helpers, logger
├── cloud-functions/
│   ├── health/
│   │   └── index.ts                  # GET /health — liveness probe
│   └── _logger.ts                    # Shared cloud-function logger
├── app/                              # Next.js App Router frontend
├── lib/
│   └── i18n.tsx                      # Chinese / English translations
├── edgeone.json                      # Deployment config (framework: workflow)
└── package.json
```

> `services/` hosts all workflow service modules. Environment variables follow the `SERVICE_*` convention — `SERVICE_* (alias for AI_GATEWAY_* for backward compat)` where applicable.

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+ (for sandbox operations: Pillow, pandas, etc.)

### Installation

```bash
npm install
cp .env.example .env
```

Configure `.env`:

```bash
SERVICE_API_KEY=your_service_key
SERVICE_BASE_URL=https://your-gateway-base-url.example.com/v1
# Optional: SERVICE_MODEL=@makers/deepseek-v4-flash
# SERVICE_* (alias for AI_GATEWAY_* for backward compat)
```

### Development

```bash
npm run dev
# Or with EdgeOne runtime
edgeone makers dev
```

Open `http://localhost:3000` for the frontend. The local observability dashboard is available at `http://localhost:8088/service-metrics` when running with the platform runtime.

### Build

```bash
npm run build
npm start
```

Build outputs to `.next/` per Next.js conventions.

## Deployment

### EdgeOne Makers

`edgeone.json` is configured with `framework: workflow` and `services` directory. Connect the repository — build command `npm run build`, output directory `.next`, framework `workflow`. Sticky routing ensures files and sandbox state remain available across follow-up messages within the same conversation.

### GitHub Pages (Frontend Preview)

This project uses Next.js; for a static export preview:

```bash
npm run build
# Configure next.config.mjs for export if needed, then deploy out/ to Pages
```

Live demo at `https://gourab775.github.io/multimodal-file-assistant-agent`.

### Custom Hosting

Deploy the Next.js frontend to Vercel/Netlify/Cloudflare Pages and host `services/` plus `cloud-functions/` on a Node/Python runtime with `SERVICE_*` variables configured.

## Customization

- **File-Type Skills** — Extend `services/chat/_skills.ts` to add new file categories or tailor prompts per format (e.g., add audio/video handlers).
- **Templates & Tools** — Modify `services/chat/_templates.ts` for PDF layouts (CJK font support) and `services/chat/_tools.ts` for shell quoting or fallback inlining behavior.
- **Sandbox Capabilities** — Add Python packages or shell utilities to the sandbox image and expose new operations via the custom tools service.
- **Frontend & i18n** — Update `app/` routes and `lib/i18n.tsx` to adjust UI flows, action card designs, or add languages.
- **Health & Logging** — Customize `cloud-functions/health/index.ts` and shared logger modules for monitoring integration.

## License

MIT
