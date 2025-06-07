import { Book } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface BookModalProps {
  book: Book | null;
  onClose: () => void;
}

const languageFlags: { [key: string]: string } = {
  en: '🇬🇧',
  es: '🇪🇸',
  de: '🇩🇪',
  fr: '🇫🇷',
  it: '🇮🇹',
  pt: '🇵🇹',
  ru: '🇷🇺',
  ja: '🇯🇵',
  zh: '🇨🇳',
  ko: '🇰🇷',
};

export default function BookModal({ book, onClose }: BookModalProps) {
  if (!book) return null;

  const translations = book.translations || {};
  const amazonLink = book.amazonLink || undefined;

  return (
    <Dialog open={!!book} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{book.title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <>
                <div className={`absolute inset-0 bg-gradient-to-br from-${book.coverColor}-500 to-${book.coverColor}-700`} />
                <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold">
                  {book.title.split(' ').map(word => word[0]).join('')}
                </div>
              </>
            )}
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Author</h3>
              <p className="text-gray-600">{book.author}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Genre</h3>
              <p className="text-gray-600">{book.genre}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{book.description || "No description available."}</p>
            </div>
            <div className="space-y-4">
              {amazonLink && (
                <Button
                  asChild
                  className="w-full bg-[#25CC86] hover:bg-[#1fb876]"
                >
                  <a href={amazonLink} target="_blank" rel="noopener noreferrer">
                    Buy on Amazon
                  </a>
                </Button>
              )}
              
              {/* Translation Flags */}
              {Object.keys(translations).length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(translations).map(([key, translation]) => (
                    <Button
                      key={key}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      asChild
                    >
                      <a href={translation.amazonLink} target="_blank" rel="noopener noreferrer">
                        {languageFlags[translation.languageCode]}
                      </a>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
