import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  PawPrint,
  Loader2,
} from "lucide-react";
import InteractiveMap from "../map/InteractiveMap";
import MapFilters from "../map/MapFilters";
import PetPreviewCard from "./PetPreviewCard";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import { usePetDatabase } from "./usePetDatabase";

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  status: "lost" | "found";
  image_url?: string;
  imageUrl?: string;
  location: string;
  reported_date?: string;
  reportedDate?: string;
  description?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  color?: string;
  gender?: string;
  size?: string;
  lastSeen?: string;
}

const LostPetsPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { lostPets, loading, error } = usePetDatabase();
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [activeFilters, setActiveFilters] = useState<any>({
    petType: [],
    breed: "",
    color: "",
    gender: "",
    size: "",
    dateRange: 30,
  });

  // Normalize data from database to match the expected format
  const normalizedPets = lostPets.map((pet) => ({
    ...pet,
    imageUrl: pet.image_url || pet.imageUrl,
    reportedDate: pet.reported_date || pet.reportedDate,
    lastSeen: pet.reported_date || pet.reportedDate,
  }));

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      setFilteredPets(normalizedPets);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = normalizedPets.filter(
      (pet) =>
        pet.name.toLowerCase().includes(query) ||
        pet.breed.toLowerCase().includes(query) ||
        pet.location.toLowerCase().includes(query) ||
        (pet.color && pet.color.toLowerCase().includes(query)),
    );

    setFilteredPets(results);
  };

  // Handle filter changes
  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);

    let filtered = [...normalizedPets];

    // Filter by pet type
    if (filters.petType && filters.petType.length > 0) {
      filtered = filtered.filter((pet) =>
        filters.petType.some(
          (type: string) => pet.type.toLowerCase() === type.toLowerCase(),
        ),
      );
    }

    // Filter by date range
    if (filters.dateRange) {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - filters.dateRange);

      filtered = filtered.filter((pet) => {
        const reportDate = new Date(
          pet.reportedDate || pet.reported_date || "",
        );
        return reportDate >= cutoffDate;
      });
    }

    // Additional filters
    if (filters.color && filters.color !== "all") {
      filtered = filtered.filter(
        (pet) =>
          pet.color && pet.color.toLowerCase() === filters.color.toLowerCase(),
      );
    }

    if (filters.gender && filters.gender !== "all") {
      filtered = filtered.filter(
        (pet) =>
          pet.gender &&
          pet.gender.toLowerCase() === filters.gender.toLowerCase(),
      );
    }

    if (filters.size && filters.size !== "all") {
      filtered = filtered.filter(
        (pet) =>
          pet.size && pet.size.toLowerCase() === filters.size.toLowerCase(),
      );
    }

    setFilteredPets(filtered);
  };

  // Handle pet details view
  const handleViewDetails = (petId: string) => {
    console.log(`View details for pet ${petId}`);
    // In a real app, navigate to pet details page
    // navigate(`/pets/${petId}`);
  };

  // Handle contact owner
  const handleContactOwner = (petId: string) => {
    console.log(`Contact owner for pet ${petId}`);
    // In a real app, show contact modal or navigate to contact page
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Update filtered pets when lostPets changes
  useEffect(() => {
    setFilteredPets(normalizedPets);
  }, [lostPets]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="py-8">
            <h1 className="text-3xl font-bold mb-2">Lost Pets</h1>
            <p className="text-gray-600 mb-6">
              Browse lost pets in your area. If you recognize any of these pets,
              please contact their owners to help reunite them.
            </p>

            {/* Search and Filter Controls */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <form onSubmit={handleSearch} className="w-full md:w-1/2">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search by name, breed, color, location..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="pl-10 pr-4 py-2"
                  />
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <Button
                    type="submit"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8"
                  >
                    Search
                  </Button>
                </div>
              </form>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`${showFilters ? "bg-primary/10" : ""}`}
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>

                <div className="border rounded-md flex">
                  <Button
                    variant="ghost"
                    className={`rounded-r-none ${viewMode === "list" ? "bg-primary/10" : ""}`}
                    onClick={() => setViewMode("list")}
                  >
                    List View
                  </Button>
                  <Button
                    variant="ghost"
                    className={`rounded-l-none ${viewMode === "map" ? "bg-primary/10" : ""}`}
                    onClick={() => setViewMode("map")}
                  >
                    Map View
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap justify-between items-center">
              <div className="flex items-center">
                {loading ? (
                  <div className="flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Loading pets...</span>
                  </div>
                ) : (
                  <>
                    <Badge variant="outline" className="mr-2">
                      {filteredPets.length} pets found
                    </Badge>
                    {activeFilters.petType.length > 0 && (
                      <Badge variant="secondary" className="mr-2">
                        {activeFilters.petType.join(", ")}
                      </Badge>
                    )}
                    {activeFilters.color && activeFilters.color !== "all" && (
                      <Badge variant="secondary" className="mr-2">
                        {activeFilters.color}
                      </Badge>
                    )}
                  </>
                )}
              </div>
              <div className="text-sm text-gray-500">
                Showing lost pets reported in the last {activeFilters.dateRange}{" "}
                days
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Filters Panel */}
              {showFilters && (
                <div className="w-full md:w-[300px] flex-shrink-0">
                  <Card>
                    <CardHeader>
                      <CardTitle>Filter Pets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <MapFilters onFilterChange={handleFilterChange} />
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Main Content */}
              <div className="flex-1">
                {loading ? (
                  <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center justify-center h-[400px]">
                    <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      Loading pets...
                    </h3>
                    <p className="text-gray-500">
                      Fetching data from the database
                    </p>
                  </div>
                ) : viewMode === "list" ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredPets.map((pet) => (
                      <div
                        key={pet.id}
                        className="bg-white rounded-lg shadow-sm overflow-hidden"
                      >
                        <div className="aspect-video relative">
                          <img
                            src={
                              pet.imageUrl ||
                              pet.image_url ||
                              "https://images.unsplash.com/photo-1543466835-00a7907e9de1"
                            }
                            alt={pet.name}
                            className="w-full h-full object-cover"
                          />
                          <Badge
                            className="absolute top-2 right-2"
                            variant="destructive"
                          >
                            Lost
                          </Badge>
                        </div>
                        <div className="p-4">
                          <h3 className="text-xl font-semibold mb-1">
                            {pet.name}
                          </h3>
                          <p className="text-gray-600 mb-2">
                            {pet.breed} {pet.gender && `• ${pet.gender}`}{" "}
                            {pet.color && `• ${pet.color}`}
                          </p>

                          <div className="flex items-center text-sm text-gray-500 mb-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span>{pet.location}</span>
                          </div>

                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>
                              Last seen:{" "}
                              {formatDate(
                                pet.lastSeen ||
                                  pet.reportedDate ||
                                  pet.reported_date ||
                                  "",
                              )}
                            </span>
                          </div>

                          <div className="flex justify-between mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(pet.id)}
                            >
                              View Details
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleContactOwner(pet.id)}
                            >
                              Contact Owner
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden h-[600px]">
                    <InteractiveMap
                      pets={filteredPets}
                      onViewDetails={handleViewDetails}
                      onContact={handleContactOwner}
                    />
                  </div>
                )}

                {!loading && filteredPets.length === 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                    <PawPrint className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      No pets found
                    </h3>
                    <p className="text-gray-500 mb-4">
                      No lost pets match your search criteria. Try adjusting
                      your filters or search terms.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setFilteredPets(normalizedPets);
                        setActiveFilters({
                          petType: [],
                          breed: "",
                          color: "",
                          gender: "",
                          size: "",
                          dateRange: 30,
                        });
                      }}
                    >
                      Clear all filters
                    </Button>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                    <h3 className="text-red-700 font-medium mb-2">
                      Error loading pets from database
                    </h3>
                    <p className="text-red-600">{error}</p>
                    <p className="text-gray-600 mt-2">
                      Showing mock data instead.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LostPetsPage;
