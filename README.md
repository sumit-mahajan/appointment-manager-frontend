# Appointment Manager - Frontend

A modern, production-grade React + TypeScript frontend for the Appointment Manager system. Built with Vite, Tailwind CSS, and shadcn/ui for a beautiful and responsive user experience.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Data Fetching**: TanStack Query v5
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Routing**: React Router v6
- **Icons**: Lucide React

## Architecture

This project follows a feature-based architecture with clear separation of concerns:

### Folder Structure

```
src/
├── app/                    # App-level configuration
│   ├── providers/          # Context providers
│   └── router/             # Route configuration
├── features/               # Feature modules
│   ├── auth/               # Authentication
│   └── onboarding/         # Clinic onboarding
├── shared/                 # Shared resources
│   ├── components/         # Common components
│   ├── hooks/              # Global hooks
│   ├── lib/                # Utilities
│   ├── constants/          # App constants
│   └── types/              # Shared types
├── pages/                  # Route pages
└── styles/                 # Global styles
```

### Key Principles

- **Feature-Based**: Each feature is self-contained with its own components, hooks, services, types, and validators
- **Type Safety**: Full TypeScript with strict mode and Zod validation
- **Code Splitting**: Lazy-loaded routes for optimal performance
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: WCAG AA compliant with semantic HTML

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:3000` (or configure `VITE_API_BASE_URL`)

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Features

### Landing Page
- Marketing-style hero section
- Features showcase
- Call-to-action buttons
- Fully responsive design

### Authentication
- Tabbed login/register interface
- Form validation with Zod
- JWT token management
- Automatic redirection based on user state

### Onboarding Wizard
- Multi-step clinic setup flow
- Create new clinic or join existing
- Search functionality with debouncing
- Visual step indicator

### Dashboard
- Overview of clinic activity
- Quick stats cards
- Getting started guide

## Project Structure

### Components Organization

- **UI Components** (`shared/components/ui/`): Reusable shadcn/ui components
- **Layout Components** (`shared/components/layout/`): Navbar, Footer, MainLayout
- **Feature Components** (`features/*/components/`): Feature-specific components

### State Management

- **Server State**: TanStack Query for API data, caching, and synchronization
- **Client State**: Zustand for authentication and UI state
- **Form State**: React Hook Form for form management

### API Integration

- Axios-based API client with interceptors
- Automatic JWT token injection
- Error handling and token refresh logic
- Type-safe responses

## Routes

| Path | Description | Auth Required |
|------|-------------|---------------|
| `/` | Landing page | No |
| `/auth` | Login/Register | No |
| `/onboarding` | Clinic setup wizard | Yes |
| `/dashboard` | Main dashboard | Yes (with clinic) |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000` |

## Key Features Implementation

### Protected Routes
Routes automatically redirect based on authentication and clinic status:
- Unauthenticated users → `/auth`
- Authenticated without clinic → `/onboarding`
- Authenticated with clinic → `/dashboard`

### Form Validation
All forms use Zod schemas for validation:
- Client-side validation with real-time feedback
- Type-safe form data with TypeScript inference
- Reusable schemas across the application

### Error Handling
Comprehensive error handling:
- API errors displayed with user-friendly messages
- Network errors handled gracefully
- 401 errors trigger automatic logout and redirect

### Theme
- Primary color: Green (customizable via CSS variables)
- Light theme optimized for readability
- Consistent spacing and typography

## Development Guidelines

### Adding a New Feature

1. Create feature folder under `src/features/`
2. Add subdirectories: `components/`, `hooks/`, `services/`, `types/`, `validators/`, `store/`
3. Follow existing patterns for consistency

### Component Guidelines

- Use TypeScript interfaces for props
- Extract reusable logic into hooks
- Keep components focused and small
- Use shadcn/ui components for consistency

### State Management

- Use TanStack Query for server state
- Use Zustand for global client state
- Keep state close to where it's used

## Performance Optimizations

- Route-based code splitting with `React.lazy()`
- Debounced search inputs
- TanStack Query caching
- Optimized re-renders with proper memoization

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ features required

## Contributing

1. Follow the existing code structure
2. Use TypeScript strict mode
3. Add proper types for all components and functions
4. Test authentication flow thoroughly
5. Ensure responsive design works on all screen sizes

## License

ISC

## Support

For issues and questions, please create an issue in the repository.
