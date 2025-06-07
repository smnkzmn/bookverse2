import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import logoPath from "@uploads/logo-01.svg";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Проверяем, не авторизован ли уже пользователь
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/stats", {
          credentials: "include",
        });
        if (response.ok) {
          window.location.replace("/admin");
        }
      } catch (error) {
        console.error("Auth check error:", error);
      }
    };
    checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        // Проверяем, что мы действительно аутентифицированы
        const statsResponse = await fetch("/api/admin/stats", {
          credentials: "include",
        });
        
        if (statsResponse.ok) {
          window.location.replace("/admin");
        } else {
          setError("Authentication failed");
        }
      } else {
        const data = await response.json();
        setError(data.message || "Invalid username or password");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bookverse-cream flex items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <img 
            src={logoPath} 
            alt="BookVerse Logo" 
            className="h-16 w-auto mx-auto mb-4"
          />
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Enter your credentials to access the admin panel</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 