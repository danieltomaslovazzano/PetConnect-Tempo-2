import React from "react";
import { Button } from "../ui/button";
import { ArrowRight, Search, PawPrint } from "lucide-react";

interface HeroSectionProps {
  onReportLostPet?: () => void;
  onReportFoundPet?: () => void;
  onSearch?: (query: string) => void;
}

const HeroSection = ({
  onReportLostPet = () => {},
  onReportFoundPet = () => {},
  onSearch = () => {},
}: HeroSectionProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 md:py-24 px-4 md:px-8 lg:px-16 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 right-0 h-full">
          {Array.from({ length: 20 }).map((_, i) => (
            <PawPrint
              key={i}
              className="absolute text-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.5 + 0.1,
                transform: `rotate(${Math.random() * 360}deg) scale(${Math.random() * 1.5 + 0.5})`,
              }}
              size={Math.random() * 30 + 20}
            />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Reunite Lost Pets With Their Families
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100">
              PetConnect uses AI technology to match lost pets with found
              reports, helping bring beloved companions back home where they
              belong.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold text-base px-6"
                onClick={onReportLostPet}
              >
                Report Lost Pet
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/20 font-semibold text-base px-6"
                onClick={onReportFoundPet}
              >
                Report Found Pet
              </Button>
            </div>
          </div>

          <div className="md:w-1/2 w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20">
              <h2 className="text-2xl font-semibold mb-4 text-center">
                Looking for a pet?
              </h2>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by breed, color, location..."
                    className="w-full px-4 py-3 pl-10 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70"
                    size={18}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-white text-blue-700 hover:bg-blue-50 font-semibold"
                >
                  Search Pets <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
              <div className="mt-4 text-center text-sm text-blue-100">
                <p>Our AI matching system helps connect lost and found pets</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex items-center">
              <div className="bg-white/20 rounded-full p-2 mr-3">
                <span className="text-xl font-bold">5k+</span>
              </div>
              <span>Pets Reunited</span>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 rounded-full p-2 mr-3">
                <span className="text-xl font-bold">98%</span>
              </div>
              <span>Match Accuracy</span>
            </div>
            <div className="flex items-center">
              <div className="bg-white/20 rounded-full p-2 mr-3">
                <span className="text-xl font-bold">24h</span>
              </div>
              <span>Average Response</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
