# Next-Auth-Template

## Overview

This project is a template for authentication using NextAuth. It includes setting up user authentication, managing sessions, and integrating with various providers.

### Key Features

| Feature 1                        | Feature 2                           | Feature 3                         | Feature 4                     |
| -------------------------------- | ----------------------------------- | --------------------------------- | ----------------------------- |
| Next-auth v5 (Auth.js)           | WebAuthn Passkey                    | Next.js 15 with server actions    | Credentials Provider          |
| OAuth Provider                   | Forgot password functionality       | Email verification                | Two-factor verification (2FA) |
| User roles                       | Login component                     | Register component                | Forgot password component     |
| Verification component           | Error component                     | Login button                      | Logout button                 |
| Role Gate                        | Protect Server Actions              | Protect API Routes                | Change email in Settings page |
| Change password in Settings page | Enable/disable 2FA in Settings page | Change user role in Settings page |                               |

### Technologies

| Technology 1 | Technology 2 | Technology 3    | Technology 4      |
| ------------ | ------------ | --------------- | ----------------- |
| Auth.js      | Resend       | ShadcnUI        | Clerk             |
| WebAuthn     | PostgreSQL   | Prisma          | Bcrypt            |
| JWT          | TailwindCSS  | React Hook Form | Zod               |
| Next.js      | Typescript   | Node.js         | Middleware config |

## Getting Started

**Prerequisites Before you begin, ensure you have met the following requirements:**

- **Node.js**: Install Node.js from [nodejs.org](https://nodejs.org/)
- **npm**: Install npm from [npmjs.com](https://www.npmjs.com/)
- **Git**: Install Git from [git-scm.com](https://git-scm.com/)

**Follow the setup instructions to get your Next-Auth-Template up and running.**

1. Clone the repository:

```bash
git clone https://github.com/yourusername/Next-Auth-Template.git
cd Next-Auth-Template
```

2. Install Dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

> 💡 **Hint**: Open [http://localhost:3000](http://localhost:3000) with your browser
> to see the result.

### Project Structure

```bash
├── .next                     # Build output directory created by Next.js (do not modify)
├── actions                   # Directory containing server action files
│   ├── login.ts              # Logic for handling user login
│   └── register.ts           # Logic for handling user registration
├── app                       # Main application directory
│   ├── api                   # API routes
│   │   └── auth              # Authentication-related API routes
│   │       └── {...nextauth}
│   │           └── route.ts  # NextAuth route handler
│   ├── (protected)           # Protected pages
│   │   └── settings
│   │       └── page.tsx      # Settings page component
│   ├── auth                  # Authentication pages
│   │   ├── login
│   │   │   └── page.tsx      # Login page component
│   │   ├── register
│   │   │   └── page.tsx      # Registration page component
│   │   └── layout.tsx        # Layout component for authentication pages
│   ├── favicon.ico           # Favicon for the application
│   ├── globals.css           # Global styles for the application
│   ├── layout.tsx            # Main layout component
│   └── page.tsx              # Main page component
├── components                # Directory containing reusable components
│   ├── auth                  # Authentication-related components
│   │   ├── back-button.tsx   # Back button component
│   │   ├── card-wrapper.tsx  # Card wrapper component
│   │   ├── header.tsx        # Header component
│   │   ├── login-button.tsx  # Login button component
│   │   ├── login-form.tsx    # Login form component
│   │   ├── register-form.tsx # Registration form component
│   │   └── social.tsx        # Social login buttons component
│   ├── ui                    # Directory containing ShadcnUI components
│   ├── form-error.tsx        # Form error display component
│   └── form-success.tsx      # Form success display component
├── data                      # Directory for data models
│   └── user.ts               # Functions to fetch user data from the database
├── lib                       # Library and utility functions
│   ├── db.ts                 # Database connection and setup using PrismaClient
│   └── utils.ts              # General utility functions
├── node_modules              # Directory for npm packages (do not modify)
├── prisma                    # Prisma schema and configuration
│   └── schema.prisma         # Prisma schema definition
├── public                    # Static assets
│   └── images                # Image assets
├── schemas                   # Directory for validation schemas
│   └── index.ts              # Validation schemas entry point
├── .env                      # Environment variables
├── .gitignore                # Files and directories to be ignored by git
├── auth.config.ts            # Authentication configuration
├── auth.ts                   # Authentication logic
├── components.json           # Configuration for components (optional)
├── eslint.config.mjs         # ESLint configuration
├── middleware.ts             # Middleware functions
├── next-auth.d.ts            # TypeScript type declarations for NextAut
├── next-env.d.ts             # TypeScript environment declarations for Next.js
├── next-config.ts            # Next.js configuration
├── package-lock.json         # Exact versions of npm dependencies
├── package.json              # Project metadata and npm dependencies
├── postcss.config.mjs        # PostCSS configuration
├── README.md                 # Project documentation
├── routes.ts                 # Defines public and authentication-related routes
├── tailwind.config.ts        # Tailwind CSS configuration
└── tailwind.json             # Tailwind CSS settings (optional)
```

### Dev Commands

```bash
npx prisma studio             # Open Prisma Studio GUI
npx prisma generate           # Generate Prisma Client based on your schema
npx prisma db push            # Push the Prisma schema state to the database
npx prisma migrate reset      # Reset the database by applying all migrations from scratch
```

> 💡 **Hint**: After running `npx prisma migrate reset`, you should run
> `npx prisma db push` to ensure that your schema changes are correctly
> applied to the database.

### Setup .env file

    DATABASE_URL=your_database_url

    DIRECT_URL=your_direct_url

    AUTH_SECRET=your_auth_token

    AUTH_GOOGLE_ID=your_auth_google_id
    AUTH_GOOGLE_SECRET=your_auth_google_secret

    AUTH_FACEBOOK_ID=your_auth_facebook_id
    AUTH_FACEBOOK_SECRET=your_auth_facebook_secret

    RESEND_API_KEY=your_resend_api_key

    NEXT_PUBLIC_APP_URL=your_public_app_url

## Code Documentation

`This project implements a robust authentication system with multi-layered validation. It includes credentials validation on the frontend, backend, and middleware using zod to ensure a more secure user authentication.`

### Credentials Validation

This application performs credentials validation at three different levels:

1.  **Frontend Validation**:

    - Located in the `LoginForm` component, where user inputs are validated using the `LoginSchema` before being submitted.

>     import { LoginForm } from "@/components/LoginForm";
>
>     const onSubmit = (values: z.infer<typeof LoginSchema>) => {
>       setError("");
>       setSuccess("");
>
>       startTransition(() => {
>         login(values).then((data) => {
>           if (data) {
>             setError(data.error);
>             setSuccess(data.success);
>           } else {
>             setError("An unexpected error occurred. Please try again.");
>           }
>         });
>       });
>     };

2.  **API Validation**:

    - The backend performs a second layer of validation using the same schema before processing the login attempt.

>     import { login } from "@/auth";
>
>     export const login = async (values: z.infer<typeof LoginSchema>) => {
>       const validatedFields = LoginSchema.safeParse(values);
>
>       if (!validatedFields.success) {
>         return { error: "Invalid fields!" };
>       }
>
>       const { email, password } = validatedFields.data;
>
>       try {
>         await signIn("credentials", {
>           email,
>           password,
>           redirectTo: DEFAULT_LOGIN_REDIRECT,
>         });
>       } catch (error) {
>         if (error instanceof AuthError) {
>           switch (error.type) {
>             case "CredentialsSignin":
>               return { error: "Invalid credentials!" };
>             default:
>               return { error: "Oops! Something went wrong!" };
>           }
>         }
>         throw error;
>       }
>     };

3.  **Middleware Validation**:

    - Middleware ensures users are authenticated before accessing protected routes, and redirects unauthenticated users to the login page. The actual validation logic is imported from `auth.config`.

>     Credentials({
>       async authorize(credentials) {
>         const validatedFields = LoginSchema.safeParse(credentials);
>
>         if (validatedFields.success) {
>           const { email, password } = validatedFields.data;
>
>           const user = await getUserByEmail(email);
>           if (!user || !user.password) return null; // if user registered with social
>
>           const passwordMatch = await bcrypt.compare(password, user.password);
>
>           if (passwordMatch) return user;
>         }
>
>         return null;
>       },
>     }),
