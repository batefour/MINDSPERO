import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/mindspero-logo.svg" alt="MindSpero" className="w-8 h-8" />
            <span className="text-lg font-bold text-foreground">MindSpero</span>
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-6xl md:text-7xl font-bold text-foreground">404</h1>
            <p className="text-2xl font-semibold text-foreground">Page Not Found</p>
          </div>

          <p className="text-muted-foreground max-w-md mx-auto text-lg">
            We couldn't find the page you're looking for. It may have been moved or doesn't exist yet.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition font-medium gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Return Home
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition font-medium"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
