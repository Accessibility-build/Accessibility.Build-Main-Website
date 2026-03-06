export const clerkThemeAppearance = {
  variables: {
    colorPrimary: 'hsl(var(--primary))',
    colorBackground: 'hsl(var(--background))',
    colorInputBackground: 'hsl(var(--background))',
    colorInputText: 'hsl(var(--foreground))',
    colorText: 'hsl(var(--foreground))',
    colorTextSecondary: 'hsl(var(--muted-foreground))',
    colorNeutral: 'hsl(var(--muted))',
    colorDanger: 'hsl(var(--destructive))',
    borderRadius: '0.75rem',
    fontFamily: 'var(--font-sans)',
  },
  elements: {
    card: 'bg-background text-foreground shadow-none border border-border',
    formFieldLabel: 'text-foreground',
    formFieldInput: 'bg-background text-foreground border border-input',
    formButtonPrimary: 'bg-primary hover:bg-primary/90 text-primary-foreground',
    footerActionText: 'text-muted-foreground',
    footerActionLink: 'text-primary hover:text-primary/80',
    socialButtonsBlockButton:
      'bg-background text-foreground border border-input hover:bg-accent hover:text-accent-foreground',
    socialButtonsBlockButtonText: 'text-foreground',
    identityPreviewText: 'text-foreground',
    identityPreviewEditButton: 'text-primary hover:text-primary/80',
    formResendCodeLink: 'text-primary hover:text-primary/80',
    otpCodeFieldInput: 'bg-background text-foreground border border-input',
    alertText: 'text-foreground',
    formFieldErrorText: 'text-destructive',
  },
} as const

export const clerkEmbeddedAuthAppearance = {
  ...clerkThemeAppearance,
  elements: {
    ...clerkThemeAppearance.elements,
    rootBox: 'w-full min-w-0 max-w-full',
    cardBox: 'w-full min-w-0 max-w-full overflow-hidden bg-transparent shadow-none',
    headerTitle: 'hidden',
    headerSubtitle: 'hidden',
  },
} as const
