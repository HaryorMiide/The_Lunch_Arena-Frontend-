import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Instagram,
  Twitter,
  Facebook,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import restaurantLogo from "@/assets/image9.png";
import footerBg from "@/assets/image7.jpg";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Menu", href: "/menu" },
    { name: "Rentals", href: "/rentals" },
    { name: "Event Catering", href: "/events" },
    { name: "Contact", href: "/contact" },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      href: "https://www.instagram.com/theluncharena",
      icon: <Instagram className="w-5 h-5" />,
      hoverColor: "hover:text-pink-500",
    },
    {
      name: "Twitter",
      href: "https://www.twitter.com/theluncharena",
      icon: <Twitter className="w-5 h-5" />,
      hoverColor: "hover:text-sky-400",
    },
    {
      name: "Facebook",
      href: "https://www.facebook.com/theluncharena",
      icon: <Facebook className="w-5 h-5" />,
      hoverColor: "hover:text-blue-500",
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card shadow-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img
                src={restaurantLogo}
                alt="Delicious Moments"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-primary">
                  The Lunch Arena
                </h1>
                <p className="text-xs text-muted-foreground">
                  Restaurant & Events
                </p>
              </div>
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>

            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "text-primary bg-restaurant-cream"
                      : "text-foreground hover:text-primary hover:bg-muted"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive(item.href)
                        ? "text-primary bg-restaurant-cream"
                        : "text-foreground hover:text-primary hover:bg-muted"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="relative mt-16 text-white">
        <img
          src={footerBg}
          alt="Footer background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60 z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">The Lunch Arena</h3>
              <p className="text-sm opacity-90">
                Creating memorable dining experiences and unforgettable events.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="space-y-2">
                {socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 text-sm opacity-90 hover:opacity-100 transition-all ${item.hoverColor}`}
                  >
                    {item.icon} {item.name}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-sm opacity-90">
                <p className="flex items-center gap-2">
                  <Phone size={16} /> 08026008230
                </p>
                <p className="flex items-center gap-2">
                  <Mail size={16} /> theluncharena@gmail.com
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={16} /> Old RADLAG Water Building 1, Lateef
                  Jakande Road Agidingbi Ikeja
                </p>
                <Link
                  to="/admin"
                  className="block text-xs mt-4 opacity-70 hover:opacity-100 transition-opacity"
                >
                  Admin Panel
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 mt-8 pt-4 text-center text-sm opacity-70">
            © 2025 The Lunch Arena. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
