import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Brain, Bell, User } from "lucide-react";
import { useLocation } from "wouter";

export default function Header() {
  const { user } = useAuth();
  const [location, setLocation] = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Journal', href: '/' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-cream/90 border-b border-lavender-medium/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-lavender-medium to-lavender-deep flex items-center justify-center">
              <Brain className="w-4 h-4 text-cream" />
            </div>
            <h1 className="text-xl font-semibold text-lavender-deep">MindMirror</h1>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => setLocation(item.href)}
                className={`font-medium transition-colors duration-200 ${
                  location === item.href
                    ? 'text-lavender-deep'
                    : 'text-warm hover:text-lavender-deep'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-full hover:bg-lavender-light/30 transition-colors duration-200">
              <Bell className="w-5 h-5 text-lavender-deep" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-lavender-deep rounded-full"></span>
            </button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.location.href = '/api/logout'}
              className="hidden md:flex"
            >
              Logout
            </Button>
            
            <div className="w-8 h-8 rounded-full bg-lavender-medium flex items-center justify-center">
              {user?.profileImageUrl ? (
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <User className="w-4 h-4 text-cream" />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
