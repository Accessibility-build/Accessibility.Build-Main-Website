import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { ConnectClient } from './ConnectClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Connect Your Desktop App',
  robots: { index: false, follow: false },
}

export default async function ConnectPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; device?: string }>
}) {
  const sp = await searchParams
  const state = typeof sp.state === 'string' ? sp.state : ''
  const device = typeof sp.device === 'string' ? sp.device : 'Desktop'

  const user = await currentUser()
  if (!user) {
    const back = `/desktop/connect?state=${encodeURIComponent(state)}&device=${encodeURIComponent(device)}`
    redirect(`/sign-in?redirect_url=${encodeURIComponent(back)}`)
  }

  const email = user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress ?? ''
  return <ConnectClient state={state} device={device} email={email} />
}
