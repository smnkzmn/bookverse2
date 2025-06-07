import { useState, useEffect, useRef } from "react";
import { Book, InsertBook } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Save, X, Upload, Image, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

interface BookFormProps {
  book?: Book | null;
  onSubmit: (bookData: InsertBook) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const colorOptions = [
  { name: "Purple", value: "purple", gradient: "from-purple-500 to-purple-700" },
  { name: "Blue", value: "blue", gradient: "from-blue-500 to-blue-700" },
  { name: "Green", value: "green", gradient: "from-green-500 to-green-700" },
  { name: "Red", value: "red", gradient: "from-red-500 to-red-700" },
  { name: "Orange", value: "orange", gradient: "from-yellow-500 to-orange-500" },
  { name: "Gray", value: "gray", gradient: "from-gray-500 to-gray-700" },
];

const languageOptions = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
];

export default function BookForm({ book, onSubmit, onCancel, isLoading }: BookFormProps) {
  const [formData, setFormData] = useState<InsertBook>({
    title: "",
    author: "",
    genre: "Fantasy",
    description: "",
    amazonLink: "",
    coverColor: "purple",
    coverImage: "",
    featured: false,
    dateAdded: new Date().toISOString().split('T')[0],
    translations: book?.translations || {},
  });
  const [uploadingCover, setUploadingCover] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title,
        author: book.author,
        genre: book.genre,
        description: book.description || "",
        amazonLink: book.amazonLink || "",
        coverColor: book.coverColor,
        coverImage: book.coverImage || "",
        featured: book.featured,
        dateAdded: book.dateAdded,
        translations: book.translations || {},
      });
    } else {
      setFormData({
        title: "",
        author: "",
        genre: "Fantasy",
        description: "",
        amazonLink: "",
        coverColor: "purple",
        coverImage: "",
        featured: false,
        dateAdded: new Date().toISOString().split('T')[0],
        translations: {},
      });
    }
  }, [book]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.author.trim()) {
      return;
    }
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof InsertBook, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const formData = new FormData();
      formData.append('cover', file);

      const response = await fetch('/api/books/upload-cover', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { coverUrl } = await response.json();
      handleInputChange('coverImage', coverUrl);
      
      toast({
        title: "Success",
        description: "Book cover uploaded successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload cover image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploadingCover(false);
    }
  };

  const addTranslation = () => {
    setFormData(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [`lang_${Object.keys(prev.translations).length + 1}`]: { amazonLink: '', languageCode: 'en' }
      }
    }));
  };

  const removeTranslation = (key: string) => {
    const newTranslations = { ...formData.translations };
    delete newTranslations[key];
    setFormData(prev => ({ ...prev, translations: newTranslations }));
  };

  const updateTranslation = (key: string, field: 'amazonLink' | 'languageCode', value: string) => {
    setFormData(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [key]: {
          ...prev.translations[key],
          [field]: value
        }
      }
    }));
  };

  return (
    <section className="bg-white rounded-xl shadow-lg mb-8">
      <div className="bg-admin-secondary text-white p-6 rounded-t-xl">
        <h2 className="text-2xl font-bold">
          {book ? "Edit Book" : "Add New Book"}
        </h2>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold text-admin-primary">
              Book Title *
            </Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="border-2 focus:border-admin-blue"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="author" className="text-sm font-semibold text-admin-primary">
              Author *
            </Label>
            <Input
              id="author"
              type="text"
              value={formData.author}
              onChange={(e) => handleInputChange("author", e.target.value)}
              className="border-2 focus:border-admin-blue"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre" className="text-sm font-semibold text-admin-primary">
              Genre
            </Label>
            <Select value={formData.genre} onValueChange={(value) => handleInputChange("genre", value)}>
              <SelectTrigger className="border-2 focus:border-admin-blue">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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

          <div className="space-y-2">
            <Label htmlFor="amazonLink" className="text-sm font-semibold text-admin-primary">
              Amazon Link (Original)
            </Label>
            <Input
              id="amazonLink"
              type="url"
              value={formData.amazonLink || ""}
              onChange={(e) => handleInputChange("amazonLink", e.target.value)}
              placeholder="https://amazon.com/..."
              className="border-2 focus:border-admin-blue"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-admin-primary">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter book description..."
              className="border-2 focus:border-admin-blue resize-none h-24"
            />
          </div>

          <div className="md:col-span-2 space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-admin-primary">Book Cover</Label>
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingCover}
                    className="w-full bg-admin-blue hover:bg-blue-600"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploadingCover ? "Uploading..." : "Upload Cover Image"}
                  </Button>
                </div>
                {formData.coverImage && (
                  <div className="w-16 h-20 border rounded-lg overflow-hidden">
                    <img
                      src={formData.coverImage}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Supported formats: JPG, JPEG, PNG (max 5MB)
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-admin-primary">Cover Color (Fallback)</Label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color.gradient} cursor-pointer border-2 transition-all hover:scale-110 ${
                      formData.coverColor === color.value ? "border-admin-primary" : "border-transparent"
                    }`}
                    onClick={() => handleInputChange("coverColor", color.value)}
                    title={color.name}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500">
                Used when no cover image is uploaded
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={formData.featured}
              onCheckedChange={(checked) => handleInputChange("featured", checked as boolean)}
            />
            <Label htmlFor="featured" className="text-sm font-semibold text-admin-primary">
              Featured Book
            </Label>
          </div>

          {/* Translations Section */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <Label>Translations</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTranslation}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Translation
              </Button>
            </div>

            {Object.entries(formData.translations).map(([key, translation]) => (
              <div key={key} className="flex gap-4 items-start p-4 border rounded-lg">
                <div className="flex-1 space-y-4">
                  <div>
                    <Label>Language</Label>
                    <Select
                      value={translation.languageCode}
                      onValueChange={(value) => updateTranslation(key, 'languageCode', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languageOptions.map(lang => (
                          <SelectItem key={lang.code} value={lang.code}>
                            <span className="flex items-center gap-2">
                              <span>{lang.flag}</span>
                              <span>{lang.name}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Amazon Link</Label>
                    <Input
                      type="url"
                      value={translation.amazonLink}
                      onChange={(e) => updateTranslation(key, 'amazonLink', e.target.value)}
                      placeholder="https://amazon.com/..."
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTranslation(key)}
                  className="mt-6"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="md:col-span-2 flex space-x-4 pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-admin-green hover:bg-green-600 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {book ? "Update Book" : "Save Book"}
            </Button>
            {book && (
              <Button
                type="button"
                onClick={onCancel}
                variant="secondary"
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
