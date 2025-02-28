import React, { useState } from "react";
import Navbar from "./layout/Navbar";
import HeroSection from "./home/HeroSection";
import InteractiveMap from "./map/InteractiveMap";
import ReportActionCards from "./pets/ReportActionCards";
import AuthModal from "./auth/AuthModal";
import ReportPetModal from "./pets/ReportPetModal";
import MatchSuggestionModal from "./matches/MatchSuggestionModal";
import Footer from "./layout/Footer";
import MapWrapper from "./map/MapWrapper";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login");
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState<"lost" | "found">("lost");
  const [showMatchModal, setShowMatchModal] = useState(false);

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
    setShowAuthModal(false);
    // Show match modal as a demo when user logs in
    setTimeout(() => setShowMatchModal(true), 1000);
  };

  // Handle report pet actions
  const handleReportLostPet = () => {
    if (!isLoggedIn) {
      handleLogin();
      return;
    }
    setReportType("lost");
    setShowReportModal(true);
  };

  const handleReportFoundPet = () => {
    if (!isLoggedIn) {
      handleLogin();
      return;
    }
    setReportType("found");
    setShowReportModal(true);
  };

  const handleReportSubmit = (data: any) => {
    console.log("Report submitted:", data);
    setShowReportModal(false);
    // Show match modal as a demo after submitting a report
    setTimeout(() => setShowMatchModal(true), 1000);
  };

  // Handle map interactions
  const handlePetMarkerClick = (petId: string) => {
    console.log("Pet marker clicked:", petId);
  };

  const handleViewPetDetails = (petId: string) => {
    console.log("View pet details:", petId);
  };

  const handleContactOwner = (petId: string) => {
    console.log("Contact owner for pet:", petId);
    if (!isLoggedIn) {
      handleLogin();
    }
  };

  // Handle match actions
  const handleConfirmMatch = (matchId: string) => {
    console.log("Match confirmed:", matchId);
    setShowMatchModal(false);
  };

  const handleRejectMatch = (matchId: string) => {
    console.log("Match rejected:", matchId);
    setShowMatchModal(false);
  };

  return (
    <MapWrapper>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Navigation */}
        <Navbar
          isLoggedIn={isLoggedIn}
          onLogin={handleLogin}
          onSignup={handleSignup}
          onLogout={() => setIsLoggedIn(false)}
        />

        <main className="flex-1 pt-20">
          {/* pt-20 to account for fixed navbar */}
          {/* Hero Section */}
          <HeroSection
            onReportLostPet={handleReportLostPet}
            onReportFoundPet={handleReportFoundPet}
            onSearch={(query) => console.log("Search query:", query)}
          />
          {/* Report Action Cards */}
          <section className="py-16 bg-white">
            <ReportActionCards
              onLostPetClick={handleReportLostPet}
              onFoundPetClick={handleReportFoundPet}
            />
          </section>
          {/* Interactive Map Section */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">
                Pets in Your Area
              </h2>
              <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
                Browse lost and found pets in your area. Our interactive map
                shows you where pets have been reported missing or found,
                helping to reunite them with their owners faster.
              </p>
              <div className="h-[600px] rounded-xl overflow-hidden border shadow-lg">
                <InteractiveMap
                  onMarkerClick={handlePetMarkerClick}
                  onViewDetails={handleViewPetDetails}
                  onContact={handleContactOwner}
                />
              </div>
            </div>
          </section>
          {/* Success Stories Section */}
          <section className="py-16 bg-blue-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">
                Success Stories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Success Story Cards */}
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg overflow-hidden shadow-md"
                  >
                    <div className="aspect-video relative">
                      <img
                        src={`https://images.unsplash.com/photo-${1550000000000 + i * 10000}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                        alt={`Success story ${i}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">
                        {["Max", "Luna", "Buddy"][i - 1]} Found After {i * 2}{" "}
                        Days
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Thanks to PetConnect's AI matching technology,{" "}
                        {["Max", "Luna", "Buddy"][i - 1]} was reunited with
                        their family after being lost for {i * 2} days.
                      </p>
                      <button className="text-blue-600 font-medium hover:underline">
                        Read Full Story
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-10">
                <button className="inline-flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                  View All Success Stories
                </button>
              </div>
            </div>
          </section>
          {/* How It Works Section */}
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">
                How PetConnect Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 text-2xl font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Report</h3>
                  <p className="text-gray-600">
                    Create a detailed report with photos and location
                    information for your lost or found pet.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 text-2xl font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Match</h3>
                  <p className="text-gray-600">
                    Our AI technology scans the database to find potential
                    matches between lost and found pets.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-blue-600 text-2xl font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Reunite</h3>
                  <p className="text-gray-600">
                    Connect with pet owners or finders through our secure
                    messaging system to arrange a reunion.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <Footer />

        {/* Modals */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
          defaultTab={authModalTab}
        />

        <ReportPetModal
          open={showReportModal}
          onOpenChange={setShowReportModal}
          reportType={reportType}
          onSubmit={handleReportSubmit}
        />

        <MatchSuggestionModal
          isOpen={showMatchModal}
          onClose={() => setShowMatchModal(false)}
          onConfirmMatch={handleConfirmMatch}
          onRejectMatch={handleRejectMatch}
          onContactOwner={handleContactOwner}
        />
      </div>
    </MapWrapper>
  );
};

export default Home;
