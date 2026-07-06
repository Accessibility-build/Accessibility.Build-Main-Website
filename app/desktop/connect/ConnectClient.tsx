'use client'

import { useState } from 'react'
import { authorizeDevice } from './actions'

export function ConnectClient({
  state,
  device,
  email,
}: {
  state: string
  device: string
  email: string
}) {
  const [status, setStatus] = useState<'idle' | 'working' | 'done' | 'error'>('idle')
  const [link, setLink] = useState<string | null>(null)

  async function connect() {
    setStatus('working')
    try {
      const url = await authorizeDevice(state, device)
      setLink(url)
      setStatus('done')
      // Hand the token back to the app via its custom URL scheme.
      window.location.href = url
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="text-2xl font-bold tracking-tight">Connect your desktop app</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Authorize <strong>{device}</strong> to use your Accessibility.build account
        (<span className="font-medium">{email}</span>). This links your credits and
        paid features to the app.
      </p>

      {status !== 'done' && (
        <button
          onClick={connect}
          disabled={status === 'working'}
          className="mt-6 inline-flex items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {status === 'working' ? 'Authorizing…' : 'Authorize this device'}
        </button>
      )}

      {status === 'done' && (
        <div className="mt-6 text-sm text-muted-foreground">
          <p>Returning you to the app…</p>
          {link && (
            <p className="mt-2">
              Didn&apos;t switch automatically?{' '}
              <a href={link} className="font-medium text-primary hover:underline">
                Open the app
              </a>
            </p>
          )}
        </div>
      )}

      {status === 'error' && (
        <p className="mt-6 text-sm text-red-600">
          Something went wrong. Please try connecting again from the app.
        </p>
      )}

      <p className="mt-10 text-xs text-muted-foreground">
        You can revoke this device any time from your account settings.
      </p>
    </div>
  )
}
