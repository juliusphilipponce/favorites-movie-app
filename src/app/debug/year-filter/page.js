/**
 * Debug page for testing year filter functionality
 */

"use client";

import YearFilterDebug from '@/components/debug/YearFilterDebug';

export default function YearFilterDebugPage() {
  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Year Filter Debug Page
        </h1>
        <YearFilterDebug />
      </div>
    </div>
  );
}
