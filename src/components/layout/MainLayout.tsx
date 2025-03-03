import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import AuthModal from "../auth/AuthModal";

const MainLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login");
  const [userName, setUserName] = useState("");

  // Handle login/signup
  const handleLogin = () => {
    setAuthModalTab("login");
    setShowAuthModal(true);
  };

  const handleSignup = () => {
    setAuthModalTab("signup");
    setShowAuthModal(true);
  };

  const handleAuthSuccess = (user: any) => {
    setIsLoggedIn(true);
    setUserName(user?.name || user?.email || "User");
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onSignup={handleSignup}
        onLogout={handleLogout}
        userName={userName}
      />

      <main className="flex-1 pt-20">
        <Outlet />
      </main>

      <Footer />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        defaultTab={authModalTab}
      />
    </div>
  );
};

export default MainLayout;
