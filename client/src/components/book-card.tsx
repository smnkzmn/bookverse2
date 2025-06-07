import { Book } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface BookCardProps {
  book: Book;
  onShowDetails: () => void;
  isCompact?: boolean;
  isFeatured?: boolean;
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

export default function BookCard({ book, onShowDetails, isCompact = false, isFeatured = false }: BookCardProps) {
  // Размеры для разных типов карточек
  const cardWidth = isFeatured ? "w-64" : (isCompact ? "w-44" : "w-52"); // 256px для Featured, 176px/208px для остальных
  const cardHeight = isFeatured ? "h-[420px]" : (isCompact ? "h-60" : "h-72"); // Высота для Featured больше
  const imageHeight = isFeatured ? "h-[320px]" : (isCompact ? "h-36" : "h-44"); // Высота изображения для Featured больше
  const titleSize = isFeatured ? "text-lg" : (isCompact ? "text-sm" : "text-base");
  const authorSize = isFeatured ? "text-base" : (isCompact ? "text-xs" : "text-sm");
  const padding = isFeatured ? "p-5" : (isCompact ? "p-2" : "p-4");

  return (
    <div 
      className={`bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer border border-gray-100 ${isFeatured ? 'h-[475px]' : 'h-72'}`}
      onClick={onShowDetails}
    >
      <div className={`relative ${isFeatured ? 'h-[350px]' : 'h-44'} m-3 rounded-xl overflow-hidden`}>
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={`${book.title} cover`}
            className="w-full h-full object-contain"
          />
        ) : (
          <div 
            className="w-full h-full flex items-center justify-center text-white text-2xl font-bold"
            style={{ background: book.coverColor || 'linear-gradient(45deg, #8B4513, #A0522D)' }}
          >
            {book.title.split(' ').map(word => word[0]).join('')}
          </div>
        )}
      </div>
      
      {!isCompact && (
        <div className={padding}>
          <h3 className={`font-bold ${titleSize} mb-2 text-bookverse-text`}>{book.title}</h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {book.description || "No description available."}
          </p>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onShowDetails();
              }}
              className="bg-bookverse-text hover:bg-gray-800 text-white border-none rounded-full"
            >
              Details
            </Button>
          </div>
        </div>
      )}

      {isCompact && book.coverImage && (
        <div className={padding}>
          <h4 className={`font-bold ${titleSize} text-bookverse-text line-clamp-1`}>{book.title}</h4>
          <p className={`text-gray-600 ${authorSize} line-clamp-1`}>by {book.author}</p>
          {book.amazonLink && (
            <a 
              href={book.amazonLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-2 inline-block bg-[#25CC86] hover:bg-[#1fb876] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Buy on Amazon
            </a>
          )}
        </div>
      )}
    </div>
  );
}
