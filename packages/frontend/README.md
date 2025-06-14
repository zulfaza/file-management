# Windows Explorer Web Frontend

A modern file explorer web application built with Vue 3, TypeScript, and Tailwind CSS. Features include file management, authentication with Supabase, and integration with the backend API.

## Features

- **Authentication**: Email/password authentication with Supabase Auth
- **File Management**: Browse, upload, delete, and organize files and folders
- **File Upload**: Drag-and-drop file upload with progress tracking
- **Search**: Real-time file search functionality
- **Responsive Design**: Modern UI that works on desktop and mobile
- **Type Safety**: Full TypeScript support
- **State Management**: Pinia for reactive state management

## Tech Stack

- **Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Authentication**: Supabase Auth
- **Build Tool**: Vite
- **Icons**: Lucide Vue

## Setup

1. **Install dependencies**:

   ```bash
   bun install
   ```

2. **Environment Variables**:
   Create a `.env` file in the root directory:

   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here

   # API Configuration
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

3. **Start development server**:
   ```bash
   bun run dev
   ```

## Supabase Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com)
2. **Enable Email Auth** in Authentication > Settings
3. **Get your project URL and anon key** from Settings > API
4. **Update your environment variables** with the Supabase credentials

## Project Structure

```
src/
├── components/          # Vue components
│   ├── AuthLogin.vue   # Login form
│   ├── AuthSignup.vue  # Signup form
│   ├── FileExplorer.vue # Main file explorer
│   └── FileIcon.vue    # File type icons
├── lib/                # External library configurations
│   └── supabase.ts     # Supabase client setup
├── services/           # API services
│   └── api.ts          # Backend API integration
├── stores/             # Pinia stores
│   ├── auth.ts         # Authentication state
│   └── files.ts        # File system state
├── views/              # Page components
│   └── AuthView.vue    # Authentication page
└── router/             # Vue Router configuration
    └── index.ts        # Route definitions
```

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run type-check` - Run TypeScript type checking
- `bun run lint` - Run ESLint
- `bun run format` - Format code with Prettier

## Authentication Flow

1. **Sign Up**: Users can create accounts with email and password
2. **Sign In**: Existing users can sign in with their credentials
3. **Session Management**: Automatic session persistence and renewal
4. **Protected Routes**: File explorer requires authentication
5. **Sign Out**: Users can sign out and return to auth page

## File Operations

- **Browse Files**: Navigate through folders with breadcrumb navigation
- **Upload Files**: Drag-and-drop or click to upload files
- **Create Folders**: Create new folders in the current directory
- **Delete Files**: Remove files and folders with confirmation
- **Search Files**: Search across all files and folders
- **File Icons**: Visual indicators for different file types

## API Integration

The frontend communicates with the backend API for all file operations:

- File listing and navigation
- File upload to Supabase Storage
- File creation and deletion
- Search functionality
- User authentication

## Development

### Adding New Features

1. **Components**: Create new Vue components in `src/components/`
2. **Stores**: Add new Pinia stores in `src/stores/`
3. **Services**: Extend API services in `src/services/`
4. **Routes**: Add new routes in `src/router/index.ts`

### Styling

The application uses Tailwind CSS for styling. Custom styles can be added to:

- Component-specific classes in the template
- Global styles in `src/assets/main.css`
- Tailwind configuration in `tailwind.config.js`

### TypeScript

All components and services are written in TypeScript for better type safety and developer experience. Types are defined in:

- Component props and emits
- API service interfaces
- Store state and actions

## Deployment

1. **Build the application**:

   ```bash
   bun run build
   ```

2. **Deploy the `dist` folder** to your hosting provider

3. **Set environment variables** in your hosting platform

## Contributing

1. Follow the existing code style and patterns
2. Add TypeScript types for new features
3. Test authentication and file operations
4. Ensure responsive design works on all screen sizes
