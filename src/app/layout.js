import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import SessionProvider from "@/components/providers/SessionProvider";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { MovieFilterProvider } from "@/contexts/MovieFilterContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Movie App - Discover & Track Movies",
  description: "Discover movies, create watchlists, and track your favorites",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <FavoritesProvider>
            <MovieFilterProvider>
              <Header />
              {children}
              <Footer />
            </MovieFilterProvider>
          </FavoritesProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
