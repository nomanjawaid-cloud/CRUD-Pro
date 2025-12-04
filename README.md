<<<<<<< HEAD
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
=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> 5b153432a8cf93555228965e03da156b44a753a8
