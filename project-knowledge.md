# Equilog - Project Knowledge Guide

This document serves as a central knowledge repository for Equilog-Frontend project participants. It outlines our technology choices, conventions, and development practices that everyone should follow.

## Technology Stack & Libraries

### Core Libraries

| Library | Purpose | Why We Use It |
|---------|---------|---------------|
| **Axios** | HTTP client | Provides better error handling and automatic JSON transformation |
| **React Hook Form** | Forms | Form state management instead of custom solutions |
| **date-fns** | Date manipulation | Modular approach with build in functions. Locale support for Swedish implementation |
| **Tailwind CSS** | Utility-first CSS | Consistent design and reduces CSS file maintenance |

## Configuration Files

### Global CSS
We use a global CSS file (`src/index.css`) with CSS variables for theming. All global styles and theming variables should be defined here.

## Development Conventions

### Component Structure

- api classes go in `src/api/`
- dynamic assets go in `src/assets/`
- static assets go in `public/assets/`
- Reusable UI components go in `src/components/`
- Custom hooks go in `src/hooks/`
- Stateful and page components go in `src/pages/`
- test file and component go in `src/testing/`
- Utility functions go in `src/utils/`

### Naming Conventions

- Components: PascalCase (e.g., `CalendarEventItem.jsx`)
- Utilities, hooks, file as .js and .json: camelCase (e.g., `calendarUtils.js`)
- All custom hooks MUST follow the React naming convention (start with use) (e.g., `useDateFns.js`)

### Icons lib
- Icons lib for svg icons: https://www.svgrepo.com/vectors/people/

### API Communication

- All API calls should be made through service files in the `src/api/` directory
- Always use Axios for HTTP requests
- Implement proper error handling for all API calls

## Recommended VS Code Extensions

For consistent development experience:

- **Tailwind CSS IntelliSense** - Provides autocomplete for Tailwind classes
- **Prettier** - Code formatting

## Build and Deployment

The project uses Vite for building with specific optimizations:
- Code splitting for React core and icons libary
- Gzip compression for optimized assets 
- Console logs are stripped in production builds