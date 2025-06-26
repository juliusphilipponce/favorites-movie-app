'use client'

import { useSession, signIn, signOut, getProviders } from 'next-auth/react'
import { useState, useEffect } from 'react'

export default function TestOAuth() {
  const { data: session, status } = useSession()
  const [providers, setProviders] = useState({})

  useEffect(() => {
    const loadProviders = async () => {
      const res = await getProviders()
      setProviders(res || {})
    }
    loadProviders()
  }, [])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            OAuth Test Page
          </h1>

          {session ? (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-green-800 mb-4">
                  ✅ Successfully Signed In!
                </h2>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> {session.user?.name || 'Not provided'}</p>
                  <p><strong>Email:</strong> {session.user?.email || 'Not provided'}</p>
                  <p><strong>User ID:</strong> {session.user?.id || 'Not provided'}</p>
                  {session.user?.image && (
                    <div className="mt-4">
                      <p><strong>Profile Image:</strong></p>
                      <img 
                        src={session.user.image} 
                        alt="Profile" 
                        className="w-16 h-16 rounded-full mt-2"
                      />
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => signOut()}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-blue-800 mb-4">
                  🔐 Not Signed In
                </h2>
                <p className="text-blue-700">
                  Test your OAuth providers by signing in below.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Available Providers:</h3>
                
                {Object.keys(providers).length === 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800">
                      ⚠️ No OAuth providers configured. Check your environment variables.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Object.values(providers).map((provider) => (
                      <div key={provider.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{provider.name}</h4>
                          <p className="text-sm text-gray-500">Provider ID: {provider.id}</p>
                        </div>
                        <button
                          onClick={() => signIn(provider.id)}
                          className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                            provider.id === 'google'
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : provider.id === 'github'
                              ? 'bg-gray-900 hover:bg-gray-800 text-white'
                              : 'bg-gray-600 hover:bg-gray-700 text-white'
                          }`}
                        >
                          Sign in with {provider.name}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Environment Check:</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Google:</span>{' '}
                    <span className={providers.google ? 'text-green-600' : 'text-red-600'}>
                      {providers.google ? '✅ Configured' : '❌ Not configured'}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">GitHub:</span>{' '}
                    <span className={providers.github ? 'text-green-600' : 'text-red-600'}>
                      {providers.github ? '✅ Configured' : '❌ Not configured'}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">Credentials:</span>{' '}
                    <span className={providers.credentials ? 'text-green-600' : 'text-red-600'}>
                      {providers.credentials ? '✅ Available' : '❌ Not available'}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-center space-x-4">
              <a
                href="/"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Home
              </a>
              <a
                href="/auth/signin"
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Go to Sign In Page
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
