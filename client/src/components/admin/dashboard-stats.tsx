import { useQuery } from "@tanstack/react-query";

interface Stats {
  totalBooks: number;
  totalCategories: number;
  featuredBooks: number;
  recentBooks: number;
}

export default function DashboardStats() {
  const { data: stats, isLoading } = useQuery<Stats>({
    queryKey: ["/api/admin/stats"],
  });

  if (isLoading) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-lg text-center animate-pulse">
            <div className="h-10 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-xl shadow-lg text-center">
        <div className="text-4xl font-bold text-admin-blue mb-2">
          {stats?.totalBooks || 0}
        </div>
        <div className="text-gray-600 text-lg">Total Books</div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg text-center">
        <div className="text-4xl font-bold text-admin-green mb-2">
          {stats?.totalCategories || 0}
        </div>
        <div className="text-gray-600 text-lg">Categories</div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg text-center">
        <div className="text-4xl font-bold text-yellow-500 mb-2">
          {stats?.featuredBooks || 0}
        </div>
        <div className="text-gray-600 text-lg">Featured</div>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-lg text-center">
        <div className="text-4xl font-bold text-purple-500 mb-2">
          {stats?.recentBooks || 0}
        </div>
        <div className="text-gray-600 text-lg">Today</div>
      </div>
    </section>
  );
}
