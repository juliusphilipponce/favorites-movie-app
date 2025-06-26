'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import UserDropdown from '@/components/ui/UserDropdown'

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="flex items-center space-x-4">
        <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse"></div>
      </div>
    )
  }

  if (session) {
    return <UserDropdown />
  }

  return (
    <div className="flex items-center space-x-4">
      <Link
        href="/auth/signin"
        className="text-sm text-gray-300 hover:text-blue-400 transition-colors"
      >
        Sign in
      </Link>
      <Link
        href="/auth/signup"
        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Sign up
      </Link>
    </div>
  )
}
