# Better Auth UI Registry

A shadcn/ui-compatible registry for better-auth UI components. This registry allows you to easily add authentication components to your project using the shadcn CLI.

## Quick Start

### Install Components

You can install components from this registry using the shadcn CLI:

```bash
# Install a specific component
npx shadcn@latest add --from ./registry.json button

# Install auth components
npx shadcn@latest add --from ./registry.json sign-in-form
npx shadcn@latest add --from ./registry.json user-avatar
npx shadcn@latest add --from ./registry.json password-input

# Install all UI components at once
npx shadcn@latest add --from ./registry.json button card input label form checkbox avatar skeleton dropdown-menu separator
```

### Using a Remote Registry

If you're hosting this registry online, you can reference it directly:

```bash
npx shadcn@latest add --from https://your-domain.com/registry.json sign-in-form
```

## Available Components

### UI Components (registry:ui)
- `button` - A button component with variants
- `card` - Card component with header, content, and footer
- `input` - Input component
- `label` - Label component
- `form` - Form components built on React Hook Form
- `checkbox` - Checkbox component
- `avatar` - Avatar component with fallbacks
- `skeleton` - Skeleton component for loading states
- `dropdown-menu` - Dropdown menu component
- `separator` - Separator component

### Auth Components (registry:component)
- `password-input` - Password input with show/hide toggle
- `user-avatar` - User avatar with fallback support
- `sign-in-form` - Sign-in form component

### Utility Components (registry:lib)
- `utils` - Utility functions (cn, isValidEmail, etc.)

## Requirements

Before using these components, ensure your project has:

1. **shadcn/ui** installed with CSS variables enabled
2. **TailwindCSS** configured
3. **React Hook Form** for form components
4. **Zod** for form validation
5. **Radix UI** primitives
6. **Lucide React** for icons

### Install Dependencies

```bash
# Core dependencies
npm install @radix-ui/react-slot @radix-ui/react-label @radix-ui/react-checkbox @radix-ui/react-avatar @radix-ui/react-dropdown-menu @radix-ui/react-separator

# Form dependencies  
npm install react-hook-form @hookform/resolvers zod

# Utility dependencies
npm install class-variance-authority clsx tailwind-merge lucide-react

# Optional: Better Auth (for full auth functionality)
npm install better-auth
```

## Usage Examples

### Basic Sign-In Form

```tsx
import { SignInForm } from "@/components/auth/forms/sign-in-form"

export function AuthPage() {
  const handleSignIn = async (data) => {
    // Implement your sign-in logic here
    console.log("Sign in data:", data)
  }

  return (
    <div className="max-w-md mx-auto">
      <SignInForm
        onSubmit={handleSignIn}
        usernameEnabled={false}
        rememberMeEnabled={true}
      />
    </div>
  )
}
```

### User Avatar

```tsx
import { UserAvatar } from "@/components/user-avatar"

export function UserProfile() {
  const user = {
    name: "John Doe",
    email: "john@example.com",
    image: "https://example.com/avatar.jpg"
  }

  return (
    <UserAvatar
      user={user}
      size="lg"
      isPending={false}
    />
  )
}
```

### Password Input

```tsx
import { PasswordInput } from "@/components/password-input"

export function PasswordField() {
  return (
    <PasswordInput
      placeholder="Enter your password"
      enableToggle={true}
    />
  )
}
```

## Customization

### Styling

All components use Tailwind CSS classes and follow shadcn/ui conventions. You can customize them by:

1. Modifying the CSS variables in your theme
2. Passing custom `className` props
3. Using the `classNames` prop where available for granular styling

### Component Props

Each component accepts standard React props plus component-specific props. Refer to the TypeScript definitions in each component file for detailed prop information.

## Integration with Better Auth

For full integration with Better Auth, you'll need to:

1. Install Better Auth: `npm install better-auth`
2. Set up the AuthUIProvider context
3. Configure your auth client
4. Use the full-featured components from the original better-auth-ui library

This registry provides simplified, standalone versions that can work independently or be enhanced with Better Auth integration.

## Development

### Adding New Components

1. Create the component file in the appropriate directory
2. Add an entry to `registry.json`
3. Ensure all dependencies are properly declared
4. Test with the shadcn CLI

### Registry Structure

```
registry/
├── lib/           # Utility libraries
├── ui/            # Basic UI components
└── components/    # Complex components
    ├── auth/      # Authentication components
    ├── settings/  # Settings components
    └── organization/ # Organization components
```

## License

MIT License - see the original better-auth-ui project for full license details.

## Contributing

This registry is based on the [better-auth-ui](https://github.com/IncbomDev/better-auth-ui) project. Please refer to the original repository for contribution guidelines.