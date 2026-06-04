You are an expert in TypeScript, Angular, Nginx/OpenResty, and scalable web application development. You write functional, maintainable, performant, and accessible code following modern best practices.

## Project Context
This repository is the **Central Entrypoint** for the Alldare platform. It contains:
1.  **Angular Frontend:** A high-performance reactive web application.
2.  **API Gateway:** An OpenResty (Nginx + Lua) layer for routing, SSL termination, and edge security.

## TypeScript Best Practices

- Use strict type checking.
- Prefer type inference when the type is obvious.
- Avoid the `any` type; use `unknown` when type is uncertain.

## Angular Best Practices

- **Versions:** This project uses Angular v21+.
- **Components:** Always use standalone components over NgModules.
- **Rule:** Must NOT set `standalone: true` inside Angular decorators. It is the default in the current version.
- **State:** Use **Signals** for state management and reactive logic.
- **Performance:** Set `changeDetection: ChangeDetectionStrategy.OnPush` in the `@Component` decorator.
- **Routing:** Implement lazy loading for feature routes.
- **Host Bindings:** Do NOT use `@HostBinding` or `@HostListener`. Use the `host` object in the `@Component` decorator instead.
- **Images:** Use `NgOptimizedImage` for all static assets (note: does not work for inline base64).

### Components & UI
- **Single Responsibility:** Keep components small and focused.
- **API:** Use `input()` and `output()` functions instead of decorators.
- **Derived State:** Use `computed()` for all derived values.
- **Structure:** Strictly separate templates and styles into their own files (`.html` and `.scss`). 
  - **Exception:** The global `src/styles.css` is a plain CSS file for Tailwind v3 compatibility.
- **Design:** Assume mobile-first, responsive design using Tailwind CSS v3.
- **Tailwind Version:** This project uses **Tailwind CSS v3.4.19**. Do NOT attempt to use v4 features yet.
- **Perceived Performance:** Prioritize skeleton loaders during async operations.
- **Forms:** Prefer Reactive forms over Template-driven ones.

## Gateway & Edge Standards (OpenResty)

- **Config Location:** All gateway logic resides in the `gateway/` directory.
- **Security:** JWT signatures MUST be verified at the gateway using Lua (`verify_jwt.lua`) before being forwarded.
- **Identity:** On successful verification, inject `X-User-ID` and `X-User-Roles` headers for downstream services.
- **Upstreams:** Use Nginx variables for service URLs to prevent startup crashes if a backend is unreachable.
- **HTTPS:** Redirect all port 80 traffic to 443 with a 301 status.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

## State Management (Signals)

- Use signals for local component state.
- Keep state transformations pure and predictable.
- Do NOT use `mutate` on signals; use `update` or `set`.

## Templates

- Use native control flow (`@if`, `@for`, `@switch`) instead of legacy directives.
- Use the `async` pipe to handle observables.
- Do not assume globals like `new Date()` are available in templates.

## Services

- Design services around a single responsibility.
- Use `providedIn: 'root'` for singleton services.
- Use the `inject()` function instead of constructor injection.
