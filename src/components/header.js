"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import AuthButton from "@/components/auth/AuthButton";
import { FilterBadge } from "@/components/ui/FilterStatusIndicator";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileSearchTerm, setMobileSearchTerm] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession();
  const mobileSearchRef = useRef(null);
  const mobileSearchInputRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/movies?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm('');
      setIsMenuOpen(false);
    }
  };

  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (mobileSearchTerm.trim()) {
      router.push(`/movies?search=${encodeURIComponent(mobileSearchTerm.trim())}`);
      setMobileSearchTerm('');
      setIsMobileSearchOpen(false);
      setIsMenuOpen(false);
    }
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
    // Close mobile menu when opening search
    if (!isMobileSearchOpen) {
      setIsMenuOpen(false);
      // Focus the input after the animation completes
      setTimeout(() => {
        mobileSearchInputRef.current?.focus();
      }, 150);
    }
  };

  // Handle click outside to close mobile search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target)) {
        setIsMobileSearchOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsMobileSearchOpen(false);
      }
    };

    if (isMobileSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMobileSearchOpen]);

  return (
    <header className="bg-gray-900/95 backdrop-blur-sm shadow-lg border-b border-gray-700 sticky top-0 z-50">
      <div className="w-full max-w-none md:max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-xl px-3 py-2 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg">
                MovieApp
              </div>
              <FilterBadge />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-800"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-800"
            >
              About
            </Link>
            <Link
              href="/movies"
              className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-800"
            >
              Movies
            </Link>
            {/* Only show Favorites link for authenticated users */}
            {session && (
              <Link
                href="/favorites"
                className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-800"
              >
                Favorites
              </Link>
            )}
          </nav>

          {/* Desktop Search Bar and Authentication */}
          <div className="hidden lg:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search movies..."
                className="w-64 px-4 py-2 pl-10 pr-4 text-sm bg-gray-800 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>

            {/* Authentication Button */}
            <AuthButton />
          </div>

          {/* Tablet/Mobile Search Icon and Authentication */}
          <div className="flex lg:hidden items-center space-x-3">
            {/* Mobile Search Icon */}
            <button
              onClick={toggleMobileSearch}
              className="text-gray-300 hover:text-blue-400 focus:outline-none focus:text-blue-400 p-2 rounded-lg transition-colors duration-200"
              aria-label="Search movies"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Authentication Button */}
            <AuthButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                // Close mobile search when opening menu
                if (!isMenuOpen) {
                  setIsMobileSearchOpen(false);
                }
              }}
              className="text-gray-300 hover:text-blue-400 focus:outline-none focus:text-blue-400 p-2 rounded-lg transition-colors duration-200"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        <div
          ref={mobileSearchRef}
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileSearchOpen
              ? 'max-h-20 opacity-100 border-b border-gray-700'
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 py-3 bg-gray-800/50 backdrop-blur-sm">
            <form onSubmit={handleMobileSearch} className="relative">
              <input
                ref={mobileSearchInputRef}
                type="text"
                value={mobileSearchTerm}
                onChange={(e) => setMobileSearchTerm(e.target.value)}
                placeholder="Search movies..."
                className="w-full px-4 py-2 pl-10 pr-4 text-sm bg-gray-700 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {mobileSearchTerm && (
                <button
                  type="button"
                  onClick={() => setMobileSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors duration-200"
                  aria-label="Clear search"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-900 border-t border-gray-700">
              <Link
                href="/"
                className="block text-gray-300 hover:text-blue-400 hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="block text-gray-300 hover:text-blue-400 hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/movies"
                className="block text-gray-300 hover:text-blue-400 hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Movies
              </Link>
              {/* Only show Favorites and Settings links for authenticated users */}
              {session && (
                <>
                  <Link
                    href="/favorites"
                    className="block text-gray-300 hover:text-blue-400 hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Favorites
                  </Link>
                  <Link
                    href="/settings"
                    className="block text-gray-300 hover:text-blue-400 hover:bg-gray-800 px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Settings
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}