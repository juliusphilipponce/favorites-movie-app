"use client";

export default function About() {
  return (
    <div className="w-full max-w-none md:max-w-6xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">About MovieApp</h1>
      <p className="text-gray-400 text-lg leading-relaxed">
        Welcome to MovieApp, your one-stop destination for all things movies!
        Whether you're a casual moviegoer or a dedicated cinephile, we have
        something for everyone.
      </p>
      <p className="text-gray-400 text-lg leading-relaxed mt-6">
        Our mission is to provide you with the most comprehensive movie database
        on the web. We offer detailed information on thousands of films, including
        ratings, reviews, and cast and crew details. Whether you're looking for
        the latest blockbusters or classic cinema, we've got you covered.
      </p>
      <p className="text-gray-400 text-lg leading-relaxed mt-6">
        At MovieApp, we believe that movies have the power to inspire, entertain,
        and educate. Our goal is to make it easy for you to discover new movies,
        stay up-to-date on the latest releases, and connect with fellow movie
        lovers from around the world.
      </p>
    </div>
  );
}