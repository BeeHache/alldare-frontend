# Alldare Central Entrypoint (Gateway & Frontend)

This repository serves as the unified entrypoint for the Alldare web platform, housing both the **Angular Web Frontend** and the **OpenResty API Gateway**.

## Features
- **Consolidated Architecture:** Grouped edge routing and user interface for simpler deployment.
- **Modern Angular:** Reactive implementation using Signals and Standalone Components (Angular v21+).
- **Edge Security:** JWT validation and identity enrichment performed at the gateway layer using Lua.
- **SSL Termination:** Integrated HTTPS support and automatic redirection.
- **Tailwind CSS:** Responsive, utility-first styling (v3.4.19).

## Project Structure
- `/src`: Angular source code.
- `/gateway`: OpenResty configuration, Lua scripts, and SSL certificates.
- `Dockerfile`: Multi-stage build (Angular Build -> OpenResty Bundle).

## Local Development
1. `npm install`
2. `npm run start` (Frontend only, for development)

## Deployment
The project is built as a single container image using the root `Dockerfile`.
```bash
docker build -t alldare-frontend .
```
This image serves the static Angular assets and acts as the reverse proxy for all backend microservices.

## Technical Stack
- **Framework:** Angular v21+
- **Gateway:** OpenResty (Nginx + Lua)
- **Styling:** Tailwind CSS v3.4.19
- **Build Tool:** Angular CLI / Esbuild
