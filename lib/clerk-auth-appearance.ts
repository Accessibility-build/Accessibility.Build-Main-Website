import type { Appearance } from "@clerk/types"

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

const authFocus = "focus-visible:!outline-none focus-visible:!ring-2 focus-visible:!ring-blue-700 focus-visible:!ring-offset-2 dark:focus-visible:!ring-blue-300 dark:focus-visible:!ring-offset-slate-950"
const authLink = `!font-medium !text-blue-700 !underline !underline-offset-4 hover:!text-blue-800 dark:!text-blue-300 dark:hover:!text-blue-200 ${authFocus}`
const authField = `!min-h-12 !rounded-lg !border !border-slate-500 !bg-white !text-base !text-slate-950 !shadow-none placeholder:!text-slate-500 aria-[invalid=true]:!border-red-700 dark:!border-slate-500 dark:!bg-slate-950 dark:!text-white dark:placeholder:!text-slate-400 dark:aria-[invalid=true]:!border-red-300 ${authFocus}`

/** Only the standalone sign-in/up forms use these overrides; profiles keep the site theme. */
export const clerkEmbeddedAuthAppearance = {
  ...clerkThemeAppearance,
  elements: {
    ...clerkThemeAppearance.elements,
    rootBox: '!w-full !min-w-0 !max-w-full',
    cardBox: '!w-full !min-w-0 !max-w-full !overflow-visible !rounded-none !border-0 !bg-transparent !shadow-none',
    card: '!w-full !min-w-0 !max-w-full !rounded-none !border-0 !bg-transparent !p-0 !shadow-none',
    header: '!gap-0 !text-left',
    // Keep these visible: Clerk also uses them for verification, recovery, and MFA.
    headerTitle: '!text-left !text-3xl !font-semibold !tracking-tight !text-slate-950 dark:!text-white',
    headerSubtitle: '!mt-2 !text-left !text-sm !leading-6 !text-slate-600 dark:!text-slate-400',
    main: '!gap-6',
    form: '!gap-5',
    formFieldLabel: '!text-sm !font-medium !text-slate-800 dark:!text-slate-200',
    formFieldInput: authField,
    formFieldInputShowPasswordButton: `!min-h-11 !min-w-11 !text-slate-600 dark:!text-slate-300 ${authFocus}`,
    formFieldAction: `!inline-flex !min-h-11 !items-center ${authLink}`,
    formButtonPrimary: `!min-h-12 !rounded-lg !bg-blue-700 !text-base !font-semibold !normal-case !text-white !shadow-none hover:!bg-blue-800 dark:!bg-blue-400 dark:!text-slate-950 dark:hover:!bg-blue-300 ${authFocus}`,
    socialButtonsBlockButton: `!min-h-12 !rounded-lg !border !border-slate-500 !bg-white !text-slate-950 !shadow-none hover:!bg-slate-50 dark:!border-slate-500 dark:!bg-slate-950 dark:!text-white dark:hover:!bg-slate-900 ${authFocus}`,
    socialButtonsBlockButtonText: '!text-sm !font-medium !text-slate-950 dark:!text-white',
    socialButtonsIconButton: `!min-h-12 !min-w-12 !rounded-lg !border-slate-500 !bg-white !shadow-none hover:!bg-slate-50 dark:!border-slate-500 dark:!bg-slate-950 dark:hover:!bg-slate-900 ${authFocus}`,
    dividerLine: '!bg-slate-200 dark:!bg-slate-800',
    dividerText: '!text-sm !text-slate-600 dark:!text-slate-400',
    footer: '!rounded-none !border-0 !bg-transparent !bg-none !px-0 !pb-0 !pt-5',
    footerAction: '!justify-start !gap-1.5',
    footerActionText: '!text-sm !text-slate-600 dark:!text-slate-400',
    footerActionLink: `!inline-flex !min-h-11 !items-center !text-sm ${authLink}`,
    identityPreviewText: '!text-sm !text-slate-800 dark:!text-slate-200',
    identityPreviewEditButton: `!min-h-11 !min-w-11 ${authLink}`,
    formResendCodeLink: `!inline-flex !min-h-11 !items-center ${authLink}`,
    otpCodeFieldInput: `${authField} !w-10 !min-w-0 !px-0 !text-center`,
    otpCodeFieldInputs: '!gap-2',
    formFieldErrorText: '!text-sm !text-red-700 dark:!text-red-300',
    alertText: '!text-sm !leading-6 !text-slate-800 dark:!text-slate-200',
    backLink: `!inline-flex !min-h-11 !items-center ${authLink}`,
  },
} as const satisfies Appearance
