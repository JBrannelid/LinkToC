# Equilog Frontend

> Digital stable management platform built with React JS (Frontend) and ASP.NET (Backend).

## Overview
Equilog is a comprehensive digital stable management platform that helps users and horse facilities manage horses, members, schedules, and daily operations. The frontend provides an intuitive interface for stable owners, administrators, and members to collaborate effectively.

## Technology Stack

### Core Framework
- **React 19.0.0** - Modern React with latest features and performance improvements
- **Vite 6.2.0** - Lightning-fast build tool and development server
- **React Router 7.5.1** - Client-side routing and navigation

### Styling & UI
- **Tailwind CSS 4.0.17** - Utility-first CSS framework for consistent design
- **SVG Components** - Inline SVG paths in JSX components for scalable icons

### State Management & Forms
- **React Hook Form 7.56.0** - Performant forms with minimal re-renders
- **React Context API** - Application state management (Auth, App contexts)
- **Custom Hooks** - Reusable stateful logic

### HTTP & Authentication
- **Axios 1.8.4** - HTTP client with interceptors and error handling
- **JWT Decode 4.0.0** - JWT token parsing and validation
- **Session Storage** - Token management and user sessions

### File Management
- **Azure Storage Blob 12.27.0** - Direct cloud storage integration
- **UUID 11.1.0** - Unique identifiers for file naming

### Date & Time
- **date-fns 4.1.0** - Modular date manipulation with english locale support

### Development Tools
- **Terser 5.39.0** - JavaScript minification for production
- **Vite Plugin Compression** - Gzip and Brotli compression
- **ESLint 9.21.0** 

## Architecture

### Frontend-Backend Communication
- **ASP.NET Backend** - RESTful API providing business logic and data management
- **Azure Blob Storage** - Direct integration for image and file storage
- **JWT Authentication** - Secure token-based authentication flow

### Image Storage Flow
1. User selects/uploads an image through React Dropzone
2. Frontend requests SAS (Shared Access Signature) URL from ASP.NET backend
3. File is uploaded directly to Azure Blob Storage using Azure SDK
4. Backend updates database with blob reference
5. Images are served directly from Azure CDN for optimal performance

### Project Structure

```
src/
├── api/                    # API services and HTTP client configuration
│   ├── services/          # Domain-specific API services
│   ├── config/           # Axios configuration and interceptors
│   └── utils/            # API utility functions
├── assets/               # Static assets (fonts, images, icons)
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (buttons, cards, etc.)
│   ├── forms/           # Form components and builders
│   ├── layout/          # Layout and navigation components
│   └── [feature]/       # Feature-specific components
├── context/             # React Context providers
├── hooks/               # Custom React hooks
├── pages/               # Page-level components
├── routes/              # Routing configuration
├── utils/               # Utility functions and helpers
└── testing/             # Mock data and test utilities
```

### Environment Setup

Create `.env` file with required variables:
```env
VITE_API_BASE_URL=your-api-endpoint
VITE_AZURE_STORAGE_URL=your-blob-storage-url
```

## Development Guidelines

### Code Quality Standards
- Follow React best practices and hooks patterns
- Implement proper error boundaries and loading states
- Use TypeScript-style PropTypes for component validation
- Maintain single responsibility principle for components
- Leverage existing patterns and utilities

### API Integration
- All HTTP requests through Axios services in `src/api/services/`
- Centralized error handling via Axios interceptors
- Consistent response formatting and error states
- JWT token management through session storage

### Styling Guidelines
- Utility-first approach with Tailwind CSS
- CSS variables for theming in `src/index.css`
- Responsive design with mobile-first approach
- Consistent spacing and color usage

## Build & Deployment

### Build Optimizations
- **Code Splitting** - Automatic chunking for React core, forms, and UI components
- **Compression** - Gzip and Brotli compression for assets
- **Tree Shaking** - Dead code elimination
- **Minification** - Terser minification with console removal
- **Asset Optimization** - Optimized font loading and static assets

### Performance Features
- Lazy loading for route components
- Optimized bundle chunking strategy
- CDN-delivered images through Azure Blob Storage
- Efficient re-rendering with React Hook Form
- Memoized components and hooks where appropriate

## Key Features
- **Multi-tenant Stable Management** - Support for multiple stables per user
- **Role-based Access Control** - Different permissions for owners, admins, and members
- **Real-time Calendar** - Scheduling and event management
- **Horse Profiles** - Comprehensive horse information and tracking
- **Member Management** - User profiles and stable memberships
- **File Upload System** - Direct Azure Blob Storage integration
- **Responsive Design** - Mobile-first approach with desktop optimization
- **Offline-Ready** - Service worker support for offline functionality

## Browser Support

- Modern browsers with ES2020+ support
- Mobile browsers (iOS Safari, Android Chrome)
- Progressive enhancement for older browsers

# Copyright © [Equilog], [2025]
### All rights reserved.
### This code is proprietary and confidential.
### No part of this code may be copied, modified, distributed, or used in any form without express written permission from the copyright holder