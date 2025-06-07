import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Book, InsertBook } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import DashboardStats from "@/components/admin/dashboard-stats";
import BookForm from "@/components/admin/book-form";
import BookList from "@/components/admin/book-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Download, Upload, Plus, LogOut } from "lucide-react";
import logoPath from "@uploads/logo-01.svg";

export default function Admin() {
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [showAddBook, setShowAddBook] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Проверка аутентификации
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/stats", {
          credentials: "include",
        });
        if (!response.ok) {
          console.log("Auth check failed, redirecting to login");
          setLocation("/admin/login");
        }
      } catch (error) {
        console.error("Auth check error:", error);
        setLocation("/admin/login");
      }
    };
    checkAuth();
  }, [setLocation]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setLocation("/admin/login");
      } else {
        toast({
          title: "Error",
          description: "Failed to logout. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
    retry: false,
    credentials: "include",
  });

  const { data: books = [], isLoading } = useQuery<Book[]>({
    queryKey: ["/api/books"],
    credentials: "include",
  });

  const createBookMutation = useMutation({
    mutationFn: async (bookData: InsertBook) => {
      const response = await apiRequest("POST", "/api/books", bookData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
      queryClient.invalidateQueries({ queryKey: ["/api/books/featured"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Success",
        description: "Book created successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create book. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateBookMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertBook> }) => {
      const response = await apiRequest("PATCH", `/api/books/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
      queryClient.invalidateQueries({ queryKey: ["/api/books/featured"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      setEditingBook(null);
      toast({
        title: "Success",
        description: "Book updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update book. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteBookMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/books/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/books"] });
      queryClient.invalidateQueries({ queryKey: ["/api/books/featured"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({
        title: "Success",
        description: "Book deleted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete book. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (bookData: InsertBook) => {
    if (editingBook) {
      updateBookMutation.mutate({ id: editingBook.id, data: bookData });
    } else {
      createBookMutation.mutate(bookData);
    }
  };

  const handleEdit = (book: Book) => {
    setEditingBook(book);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this book?")) {
      deleteBookMutation.mutate(id);
    }
  };

  const handleCancelEdit = () => {
    setEditingBook(null);
  };

  const exportBooks = () => {
    const dataStr = JSON.stringify(books, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bookverse_books.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedBooks = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedBooks)) {
          // Here you would typically send each book to the server
          toast({
            title: "Import functionality",
            description: "Import feature would be implemented here with proper validation.",
          });
        } else {
          throw new Error('Invalid file format');
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Error importing books. Please check the file format.",
          variant: "destructive",
        });
      }
      event.target.value = '';
    };
    reader.readAsText(file);
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "all" || book.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <img 
              src={logoPath} 
              alt="BookVerse Logo" 
              className="h-12 w-auto"
            />
            <h1 className="text-2xl font-bold text-bookverse-text">BookVerse Admin</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button className="text-bookverse-text hover:bg-gray-100" variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Website
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-bookverse-text hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Admin Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-600">Total Books</h3>
            <p className="text-3xl font-bold text-bookverse-text">{stats?.totalBooks || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-600">Categories</h3>
            <p className="text-3xl font-bold text-bookverse-text">{stats?.totalCategories || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-600">Featured Books</h3>
            <p className="text-3xl font-bold text-bookverse-text">{stats?.featuredBooks || 0}</p>
          </div>
        </div>

        {/* Add/Edit Book Form */}
        <BookForm
          book={editingBook}
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
          isLoading={createBookMutation.isPending || updateBookMutation.isPending}
        />

        {/* Books Section */}
        <section className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-bookverse-text">Books</h2>
            <div className="flex items-center space-x-4">
              <Button
                onClick={exportBooks}
                variant="outline"
                className="text-bookverse-text hover:bg-gray-100"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <label className="text-bookverse-text hover:bg-gray-100 px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm font-medium flex items-center border border-gray-200">
                <Upload className="w-4 h-4 mr-2" />
                Import
                <input
                  type="file"
                  className="hidden"
                  accept=".json"
                  onChange={handleImport}
                />
              </label>
              <Button
                onClick={() => setShowAddBook(true)}
                className="bg-bookverse-text hover:bg-gray-800 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Book
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search books by title or author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="md:w-48">
              <Select value={selectedGenre || "all"} onValueChange={(value) => setSelectedGenre(value === "all" ? "" : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Genres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genres</SelectItem>
                  <SelectItem value="Fantasy">Fantasy</SelectItem>
                  <SelectItem value="Mystery">Mystery</SelectItem>
                  <SelectItem value="Science Fiction">Science Fiction</SelectItem>
                  <SelectItem value="Romance">Romance</SelectItem>
                  <SelectItem value="Thriller">Thriller</SelectItem>
                  <SelectItem value="Historical">Historical</SelectItem>
                  <SelectItem value="Non-Fiction">Non-Fiction</SelectItem>
                  <SelectItem value="Biography">Biography</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Books List */}
          <BookList
            books={filteredBooks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isLoading}
          />
        </section>
      </main>
    </div>
  );
}
