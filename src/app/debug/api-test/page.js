/**
 * API Test Page - Test TMDB API connection
 */

"use client";

import { useState } from 'react';

export default function ApiTestPage() {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testApiKey = async () => {
    setLoading(true);
    setTestResult(null);

    try {
      const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
      const baseUrl = process.env.NEXT_PUBLIC_TMDB_BASE_URL || "https://api.themoviedb.org/3";
      
      console.log('Testing with API Key:', apiKey ? `${apiKey.substring(0, 8)}...` : 'NOT SET');
      console.log('Base URL:', baseUrl);

      // Test with a simple API call
      const testUrl = `${baseUrl}/movie/popular?api_key=${apiKey}&page=1`;
      console.log('Test URL:', testUrl);

      const response = await fetch(testUrl);
      const data = await response.json();

      if (response.ok) {
        setTestResult({
          success: true,
          status: response.status,
          message: 'API key is working!',
          sampleData: {
            totalResults: data.total_results,
            totalPages: data.total_pages,
            firstMovie: data.results[0] ? {
              title: data.results[0].title,
              release_date: data.results[0].release_date,
              vote_average: data.results[0].vote_average
            } : null
          }
        });
      } else {
        setTestResult({
          success: false,
          status: response.status,
          message: data.status_message || 'API request failed',
          error: data
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        status: 'Network Error',
        message: error.message,
        error: error
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          TMDB API Test
        </h1>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">Environment Variables</h2>
          <div className="space-y-2 mb-6">
            <div className="text-gray-300">
              <strong>API Key:</strong> {process.env.NEXT_PUBLIC_TMDB_API_KEY ? 
                `${process.env.NEXT_PUBLIC_TMDB_API_KEY.substring(0, 8)}...` : 
                <span className="text-red-400">NOT SET</span>
              }
            </div>
            <div className="text-gray-300">
              <strong>Base URL:</strong> {process.env.NEXT_PUBLIC_TMDB_BASE_URL || "https://api.themoviedb.org/3"}
            </div>
            <div className="text-gray-300">
              <strong>Min Vote Count:</strong> {process.env.NEXT_PUBLIC_TMDB_MIN_VOTE_COUNT || 100}
            </div>
            <div className="text-gray-300">
              <strong>Min Rating:</strong> {process.env.NEXT_PUBLIC_TMDB_MIN_RATING || 6.0}
            </div>
            <div className="text-gray-300">
              <strong>Strict Date Filter:</strong> {process.env.NEXT_PUBLIC_TMDB_USE_STRICT_DATE_FILTER || 'false'}
            </div>
          </div>

          <button
            onClick={testApiKey}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test API Connection'}
          </button>

          {testResult && (
            <div className={`mt-6 p-4 rounded-lg ${
              testResult.success ? 'bg-green-900/20 border border-green-500/30' : 'bg-red-900/20 border border-red-500/30'
            }`}>
              <h3 className={`text-lg font-semibold mb-2 ${
                testResult.success ? 'text-green-400' : 'text-red-400'
              }`}>
                {testResult.success ? '✅ Success' : '❌ Failed'}
              </h3>
              <p className="text-gray-300 mb-2">
                <strong>Status:</strong> {testResult.status}
              </p>
              <p className="text-gray-300 mb-4">
                <strong>Message:</strong> {testResult.message}
              </p>

              {testResult.success && testResult.sampleData && (
                <div className="bg-gray-700 p-3 rounded">
                  <h4 className="text-white font-medium mb-2">Sample Data:</h4>
                  <pre className="text-gray-300 text-sm overflow-auto">
                    {JSON.stringify(testResult.sampleData, null, 2)}
                  </pre>
                </div>
              )}

              {!testResult.success && (
                <div className="bg-gray-700 p-3 rounded">
                  <h4 className="text-white font-medium mb-2">Error Details:</h4>
                  <pre className="text-gray-300 text-sm overflow-auto">
                    {JSON.stringify(testResult.error, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">How to Get a TMDB API Key</h2>
          <ol className="text-gray-300 space-y-2">
            <li>1. Go to <a href="https://www.themoviedb.org/signup" target="_blank" className="text-blue-400 hover:underline">TMDB Signup</a></li>
            <li>2. Create an account and verify your email</li>
            <li>3. Go to <a href="https://www.themoviedb.org/settings/api" target="_blank" className="text-blue-400 hover:underline">API Settings</a></li>
            <li>4. Request an API key (choose "Developer" option)</li>
            <li>5. Fill out the application form</li>
            <li>6. Copy your API key and update the .env file</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
