'use client'

import { useAuth, useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function Page() {
  const { signUp, errors, fetchStatus } = useSignUp()
  const { isSignedIn } = useAuth()
  const router = useRouter()

  if (!signUp) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    )
  }

  const handleSubmit = async (formData: FormData) => {
    const emailAddress = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await signUp.password({
      emailAddress,
      password,
    })

    if (error) {
      console.error(JSON.stringify(error, null, 2))
      return
    }

    await signUp.verifications.sendEmailCode()
  }

  const handleVerify = async (formData: FormData) => {
    const code = formData.get('code') as string

    await signUp.verifications.verifyEmailCode({ code })

    if (signUp.status === 'complete') {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return

          const url = decorateUrl('/')
          if (url.startsWith('http')) {
            window.location.href = url
          } else {
            router.push(url)
          }
        },
      })
    } else {
      console.error('Sign-up attempt not complete:', signUp)
    }
  }

  if (signUp.status === 'complete' ) return null

  const isVerifying =
    signUp.status === 'missing_requirements' &&
    signUp.unverifiedFields.includes('email_address') &&
    signUp.missingFields.length === 0

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md">

        {/* 🔹 VERIFY UI */}
        {isVerifying ? (
          <>
            <h1 className="text-2xl font-semibold text-center mb-6">
              Verify Your Email
            </h1>

            <form action={handleVerify} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Verification Code
                </label>
                <input
                  name="code"
                  type="text"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter code"
                />
                {errors?.fields?.code && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fields.code.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={fetchStatus === 'fetching'}
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
              >
                {fetchStatus === 'fetching' ? 'Verifying...' : 'Verify'}
              </button>
            </form>

            <button
              onClick={() => signUp.verifications.sendEmailCode()}
              className="w-full mt-4 text-sm text-blue-600 hover:underline"
            >
              Resend Code
            </button>
          </>
        ) : (
          <>
            {/* 🔹 SIGNUP UI */}
            <h1 className="text-2xl font-semibold text-center mb-6">
              Create Account
            </h1>

            <form action={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter your email"
                />
                {errors?.fields?.emailAddress && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fields.emailAddress.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter password"
                />
                {errors?.fields?.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fields.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={fetchStatus === 'fetching'}
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
              >
                {fetchStatus === 'fetching' ? 'Processing...' : 'Sign Up'}
              </button>
            </form>

            {/* Debug errors */}
            {errors && (
              <pre className="text-xs text-gray-500 mt-4 overflow-auto">
                {JSON.stringify(errors, null, 2)}
              </pre>
            )}

            <div id="clerk-captcha" className="mt-4" />
          </>
        )}
      </div>
    </div>
  )
}