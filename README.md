# Alldare Web Frontend

Modern Angular implementation of the Alldare web platform.

## Features
- **Modern Angular Architecture:** Uses Standalone Components and Signals for reactive state management.
- **SSO Integration:** PKCE-based OIDC flow for secure authentication.
- **Hydrated Feed:** Personalized subscription-based content feed.
- **Tailwind CSS:** Responsive, utility-first styling.

## Tech Stack
- **Framework:** Angular 19+
- **State Management:** Angular Signals & RxJS
- **Styling:** Tailwind CSS 4.0
- **HTTP Client:** Angular HttpClient with Interceptors

## Local Development
1. `npm install`
2. `npm run start`

## Production Build
The project is designed to be built as a static export and served via the API Gateway.
`npm run build` generates the output in `dist/alldare-frontend/browser`.
