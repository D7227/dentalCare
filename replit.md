# Dental Lab Management System

## Overview

This is a full-stack dental lab management system built with React, Express.js, and PostgreSQL. The system manages dental orders, patients, appointments, billing, and team collaboration with a modern, responsive interface.

## System Architecture

The application follows a modern full-stack JavaScript architecture with:

- **Frontend**: React with TypeScript, using Vite for development
- **Backend**: Express.js with TypeScript for API server
- **Database**: PostgreSQL with Drizzle ORM
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for frontend, esbuild for backend

## Key Components

### Frontend Architecture
- **Component Structure**: Modular React components organized by feature
- **UI System**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Routing**: wouter for client-side routing
- **Forms**: React Hook Form with Zod validation
- **File Uploads**: Custom file upload components with drag-and-drop support

### Backend Architecture
- **API Design**: RESTful endpoints following REST conventions
- **Database Layer**: Drizzle ORM with PostgreSQL for type-safe database operations
- **Session Management**: Express sessions with PostgreSQL session store
- **File Handling**: Server-side file upload and storage management
- **Environment Configuration**: Environment variables for database and app config

### Database Schema
The database includes core entities:
- **Users**: Authentication and user management
- **Patients**: Patient demographic information
- **Orders**: Core dental lab orders with comprehensive tracking
- **Tooth Groups**: Specific tooth selections for each order
- **Team Members**: Clinic staff and lab technician management
- **Chat System**: Order-specific communication threads
- **Billing**: Payment tracking and financial management

## Data Flow

1. **Order Creation Flow**:
   - Multi-step wizard for order placement
   - Patient information collection
   - Tooth selection and restoration details
   - File uploads and documentation
   - Real-time validation and error handling

2. **Order Processing Flow**:
   - Status tracking through workflow stages
   - Team collaboration via integrated chat
   - File management and documentation
   - Quality assurance checkpoints

3. **Communication Flow**:
   - Real-time chat system for order discussions
   - Notification system for status updates
   - Email integration for external communications

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18+ with TypeScript support
- **UI Library**: Radix UI primitives with shadcn/ui component system
- **Database**: PostgreSQL with Drizzle ORM
- **HTTP Client**: Fetch API with TanStack Query for caching

### Development Tools
- **Build System**: Vite for frontend development and building
- **Code Bundling**: esbuild for production server builds
- **TypeScript**: Full TypeScript support across frontend and backend
- **PostCSS**: CSS processing with Tailwind CSS

### Authentication & Session Management
- **Sessions**: Express sessions with connect-pg-simple for PostgreSQL storage
- **Security**: Environment-based session secrets and secure cookie handling

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite dev server with HMR for frontend development
- **Database**: Local PostgreSQL instance or cloud database (Neon/Supabase)
- **Environment**: Node.js 20+ with TypeScript compilation

### Production Deployment
- **Build Process**: 
  - Frontend: Vite build to static assets
  - Backend: esbuild bundle for Node.js server
- **Database**: PostgreSQL with connection pooling
- **Server**: Express.js server serving API and static files
- **Port Configuration**: Configurable port with default 5000

### Replit Configuration
- **Modules**: Node.js 20, web server, PostgreSQL 16
- **Deployment**: Autoscale deployment target
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`

## Changelog

```
Changelog:
- June 18, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```