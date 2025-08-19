# Social Media Management Platform

## Overview

This is a comprehensive social media management platform built with React, Express, and Ayrshare API integration. The application enables users to manage multiple social media accounts, schedule posts, analyze performance, and collaborate with team members from a unified dashboard. The platform supports major social networks including Facebook, Instagram, LinkedIn, Twitter/X, YouTube, and others through the Ayrshare API.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client is built with React 18 and TypeScript, using a component-based architecture with the following key decisions:

- **Routing**: Uses Wouter for lightweight client-side routing
- **State Management**: React Query (TanStack Query) for server state management and caching
- **UI Framework**: Shadcn/ui components with Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom design tokens for colors (sage, warm-blue, dusty-purple, etc.)
- **Authentication**: Session-based auth integrated with Replit's OIDC system

### Backend Architecture
The server follows a RESTful API pattern with Express.js:

- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth with OpenID Connect (OIDC) integration
- **Session Management**: PostgreSQL-backed sessions with connect-pg-simple
- **API Structure**: Modular route handlers with proper error handling and middleware

### Database Design
The schema includes core entities for social media management:

- **Users**: Stores user profile information from Replit Auth
- **Social Accounts**: Connected social media platform accounts via Ayrshare
- **Posts**: Content scheduling and publishing records
- **Analytics**: Performance metrics and engagement data
- **Content Assets**: Media files and templates
- **Sessions**: Authentication session storage

### Authentication & Authorization
- Replit Auth provides secure OIDC authentication flow
- Session-based authentication with encrypted cookies
- User data synchronized with Replit's user profile system
- Protected API endpoints requiring authentication middleware

## External Dependencies

### Social Media API Integration
- **Ayrshare API**: Primary service for multi-platform social media posting and management
- Supports 13+ social platforms with unified API interface
- Handles content publishing, scheduling, and analytics retrieval

### Database & Hosting
- **Neon Database**: Serverless PostgreSQL database with connection pooling
- **Replit**: Development environment and hosting platform with integrated auth

### UI & Styling Libraries
- **Tailwind CSS**: Utility-first CSS framework with custom color palette
- **Shadcn/ui**: Pre-built accessible component library
- **Radix UI**: Headless UI components for complex interactions
- **Lucide React**: Consistent icon system

### Development Tools
- **Vite**: Fast build tool and development server with HMR
- **TypeScript**: Type safety across frontend and backend
- **Drizzle Kit**: Database migration and schema management
- **ESBuild**: Production build bundling for server code