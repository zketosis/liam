# Storybook for Liam App (Next.js)

This directory contains the configuration for Storybook, a tool for developing UI components in isolation. This setup is specifically configured for a Next.js project.

## Running Storybook

To start Storybook locally, run:

```bash
cd frontend/apps/app
pnpm storybook
# or
cd frontend/apps/app
npx storybook dev -p 6006
```

This will start Storybook on port 6006. You can access it at http://localhost:6006.

## Building Storybook

To build a static version of Storybook, run:

```bash
cd frontend/apps/app
pnpm build-storybook
# or
cd frontend/apps/app
npx storybook build
```

This will create a static build in the `storybook-static` directory.

## Creating Stories

### File Location

Stories should be placed alongside the components they document. For example:

- Component: `components/Button.tsx`
- Story: `components/Button.stories.tsx`

### Basic Story Structure

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { YourComponent } from "./YourComponent";

const meta: Meta<typeof YourComponent> = {
  title: "Category/YourComponent",
  component: YourComponent,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    // Define controls for your component props
  },
};

export default meta;
type Story = StoryObj<typeof YourComponent>;

export const Default: Story = {
  args: {
    // Default props
  },
};

// Additional variants
export const Variant: Story = {
  args: {
    // Variant props
  },
};
```

### Using UI Components

To use components from the `@liam-hq/ui` package:

```tsx
import { Button } from "@liam-hq/ui";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  // ...
};
```

## Configuration

- `main.ts`: Main configuration file for Storybook
- `preview.ts`: Preview configuration for stories
- `preview-head.html`: For including global styles

### Next.js Specific Configuration

This Storybook setup includes specific configurations for Next.js:

1. **Framework**: Uses `@storybook/nextjs` adapter for Next.js compatibility
2. **Path Aliases**: Supports Next.js path aliases (e.g., `@/components`)
3. **Image Handling**: Properly handles Next.js Image component
4. **CSS Modules**: Supports CSS modules used in Next.js components
5. **API Mocking**: Includes configuration for mocking API calls in stories

## Best Practices

1. Use the `autodocs` tag to automatically generate documentation
2. Provide meaningful descriptions in `argTypes`
3. Create multiple story variants to showcase different states and use cases
4. Use the `actions` addon to log events
5. Test components in different viewports using the viewport addon
