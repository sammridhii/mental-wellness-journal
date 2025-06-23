import { useState } from "react";
import { useLocation } from "wouter";
import { Home, PenTool, TrendingUp, Lightbulb } from "lucide-react";

export default function MobileNav() {
  const [location, setLocation] = useLocation();
  
  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Write", href: "/write", icon: PenTool },
    { name: "Insights", href: "/dashboard", icon: TrendingUp },
    { name: "Advice", href: "/advice", icon: Lightbulb },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-cream/95 backdrop-blur-md border-t border-lavender-medium/20 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href || 
            (item.href === "/dashboard" && location === "/dashboard");
          
          return (
            <button
              key={item.name}
              onClick={() => setLocation(item.href)}
              className={`flex flex-col items-center space-y-1 transition-colors duration-200 ${
                isActive ? 'text-lavender-deep' : 'text-warm/60'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
