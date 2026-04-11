"use client"

import React from 'react'
import SignUpForm from '../components/SignUpForm'
import CustomButton from '@/shared/components/custom/CustomButton'
import { signIn } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'

const SignUpPage = () => {
  return (
     <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-200 px-4">
      <section
        className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 space-y-6"
        aria-labelledby="signin-heading"
      >
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 id="signin-heading" className="text-2xl font-semibold">
            Welcome Back 👋
          </h1>
          <p className="text-sm text-gray-500">
            Sign in to continue to{" "}
            <span className="font-medium">Mystry Message</span>
          </p>
        </header>

        {/* Social Login */}
        <section aria-label="Social login">
          <CustomButton
            onClick={() => signIn("google",{
              redirect:false,
              callbackUrl: "/dashboard",
            })}
            leftIcon={<FcGoogle size={20} />}
            fullWidth
            loading={false}
            className="hover:bg-slate-100"
            variant="outline"
          >
            Continue with Google
          </CustomButton>
        </section>

        {/* Divider */}
        <div className="flex items-center gap-3" aria-hidden="true">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Form Section */}
        <section aria-label="Email and password sign in">
          <SignUpForm />
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500">
          <p>
            Don’t have an account?{" "}
            <a
              href="/sign-up"
              className="text-black font-medium hover:underline"
            >
              Sign up
            </a>
          </p>
        </footer>
      </section>
    </main>
  )
}

export default SignUpPage