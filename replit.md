# La Buena Restaurant - Full Stack Application

## Overview

La Buena is a modern restaurant website and management system built for a Portuguese-Mozambican restaurant in Maputo. The application combines a customer-facing website with order management capabilities, featuring a comprehensive menu system, reservation functionality, and shopping cart integration.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with custom coffee/terracotta color palette
- **UI Components**: Radix UI primitives with shadcn/ui components
- **State Management**: React Context for cart state, TanStack Query for server state
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints
- **Development**: tsx for TypeScript execution in development
- **Production**: esbuild for server bundling

### Database Layer
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema**: Shared schema definitions between client and server
- **Migrations**: Drizzle Kit for schema management

## Key Components

### Data Models
- **Users**: Authentication system with username/password
- **Menu Items**: Product catalog with categories, pricing, and availability
- **Reservations**: Table booking system with customer details and status tracking
- **Orders**: Order management with customer info, items, and delivery options

### Frontend Features
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Menu Display**: Category-based menu with search functionality
- **Shopping Cart**: Persistent cart with localStorage integration
- **Reservation System**: Form-based table booking
- **Order Placement**: Complete checkout flow with multiple order types

### Backend Services
- **Menu API**: CRUD operations for menu items and categories
- **Reservation API**: Booking creation and management
- **Order API**: Order processing and status tracking
- **Storage Layer**: Abstracted storage interface with in-memory implementation

## Data Flow

1. **Menu Loading**: Client fetches menu data via TanStack Query, displays categorized items
2. **Cart Management**: Items added to React Context state, persisted to localStorage
3. **Order Submission**: Cart contents and customer details sent to server API
4. **Reservation Flow**: Form data validated with Zod schemas before API submission
5. **Real-time Updates**: Query invalidation triggers UI updates after mutations

## External Dependencies

### UI/UX Libraries
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **React Icons**: Additional icons (WhatsApp)
- **Class Variance Authority**: Component variant management

### Development Tools
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling
- **PostCSS**: CSS processing
- **ESLint/Prettier**: Code quality (inferred from setup)

### Data Management
- **TanStack Query**: Server state synchronization
- **React Hook Form**: Form handling
- **Zod**: Runtime type validation
- **date-fns**: Date manipulation utilities

## Deployment Strategy

The application is configured for Replit deployment with:

- **Development**: `npm run dev` - tsx server with Vite HMR
- **Build Process**: Vite builds client assets, esbuild bundles server
- **Production**: Node.js serves bundled server with static assets
- **Database**: PostgreSQL integration via environment variables
- **Port Configuration**: Express server on port 5000, proxied to port 80

The build outputs client assets to `dist/public` and server bundle to `dist/index.js`, enabling a single-process deployment with static file serving.

## Changelog

Changelog:
- June 19, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.