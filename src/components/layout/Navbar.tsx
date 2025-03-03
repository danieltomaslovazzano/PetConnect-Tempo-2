import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  Menu,
  Search,
  Bell,
  User,
  LogOut,
  Settings,
  PawPrint,
} from "lucide-react";

interface NavbarProps {
  isLoggedIn?: boolean;
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  onLogin?: () => void;
  onSignup?: () => void;
  onLogout?: () => void;
}

const Navbar = ({
  isLoggedIn = false,
  user = {
    name: "John Doe",
    email: "john@example.com",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  },
  onLogin = () => {},
  onSignup = () => {},
  onLogout = () => {},
}: NavbarProps) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full h-20 bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 z-50">
      <div className="container mx-auto h-full px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <PawPrint className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">PetConnect</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className={`font-medium ${location.pathname === "/" ? "text-primary" : "text-gray-700 hover:text-primary"}`}
          >
            Home
          </Link>
          <Link
            to="/lost-pets"
            className={`font-medium ${location.pathname === "/lost-pets" ? "text-primary" : "text-gray-700 hover:text-primary"}`}
          >
            Lost Pets
          </Link>
          <Link
            to="/found-pets"
            className={`font-medium ${location.pathname === "/found-pets" ? "text-primary" : "text-gray-700 hover:text-primary"}`}
          >
            Found Pets
          </Link>
          <Link
            to="/resources"
            className={`font-medium ${location.pathname === "/resources" ? "text-primary" : "text-gray-700 hover:text-primary"}`}
          >
            Resources
          </Link>
        </div>

        {/* Search Button */}
        <div className="hidden md:flex items-center ml-4">
          <Button variant="ghost" size="icon" className="mr-2">
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* Auth Buttons or User Menu */}
        <div className="flex items-center space-x-2">
          {isLoggedIn ? (
            <>
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="mr-2">
                <Bell className="h-5 w-5" />
              </Button>

              {/* User Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar>
                      <AvatarImage src={user.avatarUrl} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/profile"
                      className="cursor-pointer w-full flex items-center"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/my-pets"
                      className="cursor-pointer w-full flex items-center"
                    >
                      <PawPrint className="mr-2 h-4 w-4" />
                      <span>My Pets</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to="/settings"
                      className="cursor-pointer w-full flex items-center"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onLogout}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={onLogin}>
                Log in
              </Button>
              <Button onClick={onSignup}>Sign up</Button>
            </>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-md">
          <div className="px-4 py-3 space-y-3">
            <Link
              to="/"
              className="block text-gray-700 hover:text-primary font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/lost-pets"
              className="block text-gray-700 hover:text-primary font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Lost Pets
            </Link>
            <Link
              to="/found-pets"
              className="block text-gray-700 hover:text-primary font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Found Pets
            </Link>
            <Link
              to="/resources"
              className="block text-gray-700 hover:text-primary font-medium py-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Resources
            </Link>
            <div className="pt-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
