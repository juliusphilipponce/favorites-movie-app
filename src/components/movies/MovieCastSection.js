/**
 * Movie Cast Section Component
 * Displays the cast members with their photos, names, and character names
 */

"use client";

import Image from 'next/image';
import { useState } from 'react';
import { getImageUrl } from '@/lib/api/tmdb';

function CastMember({ actor }) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group">
      {/* Actor Photo */}
      <div className="relative aspect-[2/3] bg-gray-700">
        {!imageError && actor.profile_path ? (
          <Image
            src={getImageUrl(actor.profile_path, 'w185')}
            alt={actor.name}
            fill
            className="object-cover"
            onError={handleImageError}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-700">
            <div className="text-center text-gray-400">
              <div className="text-4xl mb-2">👤</div>
              <p className="text-xs px-2">No Photo</p>
            </div>
          </div>
        )}
      </div>

      {/* Actor Info */}
      <div className="p-4">
        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors duration-200">
          {actor.name}
        </h3>
        
        {actor.character && (
          <p className="text-gray-400 text-xs line-clamp-2">
            as {actor.character}
          </p>
        )}
      </div>
    </div>
  );
}

export default function MovieCastSection({ cast = [] }) {
  // Limit to top 8 cast members for clean layout
  const displayCast = cast.slice(0, 8);

  if (!displayCast.length) {
    return null;
  }

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Cast</h2>
        {cast.length > 8 && (
          <span className="text-gray-400 text-sm">
            Showing {displayCast.length} of {cast.length} cast members
          </span>
        )}
      </div>

      {/* Cast Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-6">
        {displayCast.map((actor) => (
          <CastMember key={actor.id} actor={actor} />
        ))}
      </div>

      {/* Show more indicator */}
      {cast.length > 8 && (
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            {cast.length - 8} more cast members not shown
          </p>
        </div>
      )}
    </section>
  );
}
