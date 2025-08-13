# Admin Control Panel - E-commerce Platform

A modern, responsive admin dashboard built with React, TypeScript, and Material-UI for managing products in an e-commerce platform.

## 🚀 Features

### Authentication & Security
- **JWT-based authentication** with automatic token refresh
- **Protected routes** - unauthorized users cannot access dashboard
- **Form validation** using Zod schema validation
- **Secure token storage** in localStorage with automatic cleanup

### Product Management
- **DataGrid table** with pagination, search, and sorting
- **CRUD operations** - Create, Read, Update, Delete products
- **Advanced search** functionality across product name and description
- **Product categories** with validation
- **Stock management** with low-stock indicators
- **Responsive design** optimized for desktop and mobile

### Dashboard Features
- **Responsive sidebar** navigation with mobile drawer
- **Professional dark theme** with gold accent colors
- **Loading states** and error handling throughout the app
- **Modern UI/UX** with smooth animations and transitions

## 🛠 Tech Stack

- **Frontend**: React 19 + TypeScript
- **UI Library**: Material-UI (MUI) v7 + Tailwind CSS
- **State Management**: React Context API
- **Form Handling**: React Hook Form + Zod validation
- **HTTP Client**: Axios with interceptors
- **Mock API**: MSW
- **Build Tool**: Vite
- **Code Quality**: ESLint + TypeScript strict mode

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd auth-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open http://localhost:5173 in your browser
   - Use the demo credentials provided on the login page

### Demo Credentials
- **Email**: admin@example.com
- **Password**: password123

## 🏗 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── dashboard/      # Dashboard layout components
│   ├── products/       # Product management components
│   └── ui/             # Common UI components
├── contexts/           # React Context providers
├── hooks/              # Custom React hooks
├── mocks/              # MSW mock API handlers
├── pages/              # Page components
├── services/           # API services and utilities
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and validation schemas
└── theme/              # MUI theme configuration
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🎨 Design Decisions

### Architecture Choices

1. **Component-First Architecture**: Modular components with clear separation of concerns
2. **TypeScript Integration**: Strong typing for better developer experience and bug prevention
3. **Context API**: Lightweight state management for authentication and user data
4. **Custom Hooks**: Reusable logic for products and authentication management

### UI/UX Decisions

1. **Dark Theme**: Professional look suitable for admin interfaces
2. **Gold Accent Colors**: Distinctive branding that stands out
3. **Responsive Design**: Mobile-first approach with collapsible sidebar
4. **Loading States**: Clear feedback for all async operations

### Technical Decisions

1. **MSW for Mocking**: Realistic API simulation without backend dependency
2. **Axios Interceptors**: Automatic token refresh and error handling
3. **Zod Validation**: Type-safe form validation with great DX
4. **MUI + Tailwind**: Combining component library with utility classes

### Security Considerations

1. **JWT Token Management**: Secure storage with automatic refresh
2. **Route Protection**: Prevents unauthorized access to protected pages
3. **Input Validation**: Client-side validation for all forms
4. **Error Handling**: Graceful handling of API errors and network issues

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- **Desktop** (1200px+): Full sidebar and expanded layout
- **Tablet** (768px-1199px): Collapsible sidebar
- **Mobile** (320px-767px): Drawer navigation and stacked forms

## 🔍 Key Features Demonstration

### Authentication Flow
1. Login with validation and error handling
2. Automatic redirect to dashboard on success
3. Protected route access control
4. Token refresh on API calls

### Product Management
1. **View Products**: Paginated table with search and sort
2. **Add Product**: Modal form with validation
3. **Edit Product**: Pre-filled form with existing data
4. **Delete Product**: Confirmation dialog for safety

### Error Handling
- Network errors with retry suggestions
- Validation errors with field-specific messages
- Authentication errors with automatic redirect
- API errors with user-friendly messages
