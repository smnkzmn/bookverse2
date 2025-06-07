import { Book } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface BookListProps {
  books: Book[];
  onEdit: (book: Book) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

const getCoverGradient = (color: string) => {
  const gradients = {
    purple: "from-purple-500 to-purple-700",
    blue: "from-blue-500 to-blue-700",
    green: "from-green-500 to-green-700",
    red: "from-red-500 to-red-700",
    orange: "from-yellow-500 to-orange-500",
    gray: "from-gray-500 to-gray-700"
  };
  return gradients[color as keyof typeof gradients] || gradients.purple;
};

export default function BookList({ books, onEdit, onDelete, isLoading }: BookListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-20 bg-gray-300 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                <div className="h-3 bg-gray-300 rounded w-1/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/5"></div>
              </div>
              <div className="flex space-x-2">
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No books found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {books.map((book) => (
        <div
          key={book.id}
          className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className={`w-16 h-20 bg-gradient-to-br ${getCoverGradient(book.coverColor)} rounded-lg flex items-center justify-center text-white text-xs text-center flex-shrink-0`}>
            <div className="p-1">
              {book.title.split(' ').slice(0, 2).join(' ')}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-admin-primary truncate">{book.title}</h4>
            <p className="text-gray-600 text-sm">{book.author}</p>
            <p className="text-gray-500 text-xs">
              {book.genre} • {book.featured ? "Featured" : "Regular"}
            </p>
          </div>
          <div className="flex space-x-2 flex-shrink-0">
            <Button
              onClick={() => onEdit(book)}
              size="sm"
              className="bg-admin-blue hover:bg-blue-600 text-white"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => onDelete(book.id)}
              size="sm"
              variant="destructive"
              className="bg-admin-red hover:bg-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
