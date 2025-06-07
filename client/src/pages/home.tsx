import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Book } from "@shared/schema";
import BookCard from "@/components/book-card";
import BookModal from "@/components/book-modal";
import { Button } from "@/components/ui/button";
import logoPath from "@uploads/logo-01.svg";

export default function Home() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const { data: featuredBooks = [], isLoading: featuredLoading } = useQuery<Book[]>({
    queryKey: ["/api/books/featured"],
  });

  const { data: allBooks = [], isLoading: allBooksLoading } = useQuery<Book[]>({
    queryKey: ["/api/books"],
  });

  // Get non-featured books for "Other Books" section
  const otherBooks = allBooks.filter(book => !book.featured);

  return (
    <div className="min-h-screen bg-bookverse-cream text-bookverse-text">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40" style={{ height: '80px' }}>
        <nav className="max-w-6xl mx-auto px-6 h-full flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <img 
              src={logoPath} 
              alt="BookVerse Logo" 
              className="h-16 w-auto"
            />
          </Link>
          <ul className="hidden md:flex space-x-8">
            <li><a href="#home" className="text-gray-600 hover:text-bookverse-text transition-colors">Home</a></li>
            <li><a href="#featured-books" className="text-gray-600 hover:text-bookverse-text transition-colors">Featured Books</a></li>
            <li><a href="#other-books" className="text-gray-600 hover:text-bookverse-text transition-colors">Other Books</a></li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div 
          id="home" 
          className="bg-gradient-to-r from-bookverse-brown to-bookverse-dark-brown flex items-center justify-center text-white text-center relative overflow-hidden rounded-xl"
          style={{
            height: '480px',
            backgroundImage: "url('/images/blurred-woman-reading-book-inside-train.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl"></div>
          <div className="relative z-10 max-w-2xl mx-auto px-6">
            <h1 className="text-5xl font-bold mb-6" style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.7)" }}>
              Discover Your Next Read
            </h1>
            <p className="text-xl mb-8" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.7)" }}>
              Explore thousands of books across all genres and find your perfect literary companion
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Featured Books */}
        <section id="featured-books" className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-bookverse-text">Featured Books</h2>
          {featuredLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden h-[520px] animate-pulse">
                  <div className="h-[420px] bg-gray-300"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                    <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {featuredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onShowDetails={() => setSelectedBook(book)}
                  isFeatured={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No featured books available yet.</p>
              <p className="text-sm">Books marked as featured will appear here.</p>
            </div>
          )}
        </section>

        {/* Other Books */}
        <section id="other-books" className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-bookverse-text">Other Books</h2>
          {allBooksLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden h-72 animate-pulse">
                  <div className="h-44 bg-gray-300"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-300 rounded"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                    <div className="h-8 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : allBooks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
              {allBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onShowDetails={() => setSelectedBook(book)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No books available yet.</p>
              <p className="text-sm">Add books through the admin panel to see them here.</p>
            </div>
          )}
        </section>
      </main>

      {/* Book Details Modal */}
      {selectedBook && (
        <BookModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <img 
              src={logoPath} 
              alt="BookVerse Logo" 
              className="h-12 w-auto"
            />
            <p className="text-gray-600 text-sm">
              © 2024 MindMint. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}