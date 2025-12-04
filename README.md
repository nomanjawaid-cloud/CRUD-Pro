# CRUD Management System

A comprehensive Next.js application with authentication, user management, and post management features built with TypeScript, Tailwind CSS, and mock APIs.

## Features

### Authentication
- **Register**: Create new accounts with first name, last name, email, password, and confirm password validation
- **Login**: Secure login with email and password
- **Session Management**: Persistent authentication with localStorage

### User Management
- **CRUD Operations**: Create, read, update, and delete users
- **Advanced Filtering**: Filter by name, email, status, and date range
- **User Dropdown API**: Get active users for dropdown selections
- **Form Validation**: Comprehensive validation with Zod schemas

### Post Management
- **CRUD Operations**: Create, read, update, and delete posts
- **Rich Content**: Support for titles, descriptions, images, and status
- **Advanced Filtering**: Filter by creator, title, status, and date range
- **User Association**: Link posts to users via user ID

### Technical Features
- **Next.js 16** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Hook Form** with Zod validation
- **Mock API** system with realistic delays
- **Responsive Design** with mobile-first approach
- **Component Architecture** with reusable components

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints (Mock)

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user info
- `POST /auth/logout` - User logout

### Users
- `GET /users` - Get all users (with filters)
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `GET /users/dropdown` - Get active users for dropdown

### Posts
- `GET /posts` - Get all posts (with filters)
- `GET /posts/:id` - Get post by ID
- `POST /posts` - Create new post
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post

## Demo Accounts

### Login Credentials
- **Email**: `john@example.com`
- **Password**: `password123`

### Available Users
1. John Doe (john@example.com) - Active
2. Jane Smith (jane@example.com) - Active

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── auth/              # Authentication pages
│   │   ├── login/         # Login page
│   │   └── register/      # Registration page
│   ├── dashboard/         # Dashboard page
│   ├── users/             # User management page
│   ├── posts/             # Post management page
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── Navigation.tsx     # Main navigation
│   ├── DashboardLayout.tsx # Dashboard layout wrapper
│   ├── Table.tsx          # Data table component
│   └── Modal.tsx          # Modal dialog component
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Authentication context
├── lib/                   # Utility functions and API calls
│   ├── auth.ts           # Authentication API functions
│   ├── users.ts          # User management API functions
│   ├── posts.ts          # Post management API functions
│   └── mockData.ts       # Mock data and helper functions
└── types/                # TypeScript type definitions
    └── index.ts          # All type definitions
```

## Technologies Used

- **Frontend Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **State Management**: React Context API
- **Mock API**: In-memory data with simulated delays

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run Biome linter

## Features Overview

### Authentication System
- Secure registration and login
- Form validation and error handling
- Persistent sessions with localStorage
- Protected routes

### User Management
- Complete CRUD operations
- Advanced filtering and search
- Modal-based forms for create/edit
- Status management (active/inactive)
- User dropdown for post creation

### Post Management
- Rich post creation with images
- Author association
- Status workflow (draft/published/archived)
- Advanced filtering by multiple criteria

### UI/UX Features
- Responsive design for all screen sizes
- Loading states and error handling
- Confirmation dialogs for destructive actions
- Toast notifications for user feedback
- Clean, modern interface with Tailwind CSS

This project demonstrates a complete full-stack application structure with modern React patterns, comprehensive error handling, and production-ready code organization.
