import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-900 border-t border-gray-700 mt-auto">
            <div className="w-full max-w-none md:max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    {/* Left side - Copyright */}
                    <div>
                        <p className="text-gray-400 text-sm">
                            © 2025 All rights reserved
                        </p>
                    </div>

                    {/* Right side - Quick Links */}
                    <div>
                        <div className="flex items-center space-x-1">
                            <div className="flex space-x-6">
                                <Link href="/" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm">
                                    Home
                                </Link>
                                <Link href="/movies" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm">
                                    Movies
                                </Link>
                                <Link href="/favorites" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm">
                                    Favorites
                                </Link>
                                <Link href="/about" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm">
                                    About
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}