'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useFilterStatus } from '@/contexts/MovieFilterContext'

export default function FilterStatusIndicator({ 
  originalCount = 0, 
  filteredCount = 0, 
  className = "",
  showDetails = true,
  compact = false 
}) {
  const { status, isActive } = useFilterStatus()
  const [isExpanded, setIsExpanded] = useState(false)

  if (!isActive) return null

  const hiddenCount = originalCount - filteredCount
  const hasHiddenMovies = hiddenCount > 0

  if (compact) {
    return (
      <div className={`inline-flex items-center space-x-2 text-sm ${className}`}>
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-blue-400">Filtered</span>
        </div>
        {hasHiddenMovies && (
          <span className="text-gray-400">
            ({hiddenCount} hidden)
          </span>
        )}
      </div>
    )
  }

  return (
    <div className={`bg-blue-900/20 border border-blue-700 rounded-lg p-3 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-blue-300 font-medium">Advanced Filtering Active</span>
          </div>
          
          {showDetails && hasHiddenMovies && (
            <div className="text-sm text-gray-300">
              <span className="text-blue-300">{filteredCount}</span> shown, 
              <span className="text-orange-300 ml-1">{hiddenCount}</span> hidden
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {showDetails && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200"
            >
              {isExpanded ? 'Hide Details' : 'Show Details'}
            </button>
          )}
          
          <Link
            href="/settings?tab=movies"
            className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200"
          >
            Settings
          </Link>
        </div>
      </div>

      {showDetails && isExpanded && status.summary && (
        <div className="mt-3 pt-3 border-t border-blue-700/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {status.summary.preferredCount > 0 && (
              <div>
                <span className="text-green-400 font-medium">Preferred Genres:</span>
                <div className="text-gray-300 mt-1">
                  {status.summary.preferredNames.join(', ')}
                </div>
              </div>
            )}
            
            {status.summary.excludedCount > 0 && (
              <div>
                <span className="text-red-400 font-medium">Excluded Genres:</span>
                <div className="text-gray-300 mt-1">
                  {status.summary.excludedNames.join(', ')}
                </div>
              </div>
            )}
          </div>
          
          <div className="mt-3 text-xs text-gray-400">
            These filters apply to all movie lists throughout the application.
          </div>
        </div>
      )}
    </div>
  )
}

// Compact version for use in movie section headers
export function CompactFilterIndicator({ originalCount, filteredCount, className = "" }) {
  return (
    <FilterStatusIndicator
      originalCount={originalCount}
      filteredCount={filteredCount}
      className={className}
      showDetails={false}
      compact={true}
    />
  )
}

// Detailed version for use at the top of pages
export function DetailedFilterIndicator({ originalCount, filteredCount, className = "" }) {
  return (
    <FilterStatusIndicator
      originalCount={originalCount}
      filteredCount={filteredCount}
      className={className}
      showDetails={true}
      compact={false}
    />
  )
}

// Simple badge for navigation or headers
export function FilterBadge({ className = "" }) {
  const { isActive } = useFilterStatus()

  if (!isActive) return null

  return (
    <div className={`inline-flex items-center px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded-full ${className}`}>
      <div className="w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse"></div>
      Filtered
    </div>
  )
}
