import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Search,
  Filter,
  Dog,
  Cat,
  X,
  List,
  Map as MapIcon,
} from "lucide-react";

import MapFilters from "./MapFilters";
import PetPreviewCard from "../pets/PetPreviewCard";

interface Location {
  lat: number;
  lng: number;
}

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  status: "lost" | "found";
  imageUrl: string;
  location: string;
  reportedDate: string;
  description?: string;
  coordinates: Location;
}

interface InteractiveMapProps {
  pets?: Pet[];
  initialCenter?: Location;
  initialZoom?: number;
  onMarkerClick?: (petId: string) => void;
  onViewDetails?: (petId: string) => void;
  onContact?: (petId: string) => void;
}

const InteractiveMap = ({
  pets = [
    {
      id: "1",
      name: "Max",
      type: "Dog",
      breed: "Golden Retriever",
      status: "lost",
      imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d",
      location: "Central Park, New York",
      reportedDate: "2023-06-15",
      description: "Friendly dog with a blue collar. Last seen near the lake.",
      coordinates: { lat: 40.7812, lng: -73.9665 },
    },
    {
      id: "2",
      name: "Luna",
      type: "Cat",
      breed: "Siamese",
      status: "found",
      imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
      location: "Brooklyn Heights, New York",
      reportedDate: "2023-06-18",
      description:
        "Found this cat wandering around. Has a purple collar with no tag.",
      coordinates: { lat: 40.6958, lng: -73.9936 },
    },
    {
      id: "3",
      name: "Buddy",
      type: "Dog",
      breed: "Labrador",
      status: "lost",
      imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb",
      location: "Prospect Park, Brooklyn",
      reportedDate: "2023-06-20",
      description:
        "Black lab with white patch on chest. Very friendly. Responds to Buddy.",
      coordinates: { lat: 40.6602, lng: -73.969 },
    },
  ],
  initialCenter = { lat: 40.7128, lng: -74.006 },
  initialZoom = 12,
  onMarkerClick = () => {},
  onViewDetails = () => {},
  onContact = () => {},
}: InteractiveMapProps) => {
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [filteredPets, setFilteredPets] = useState<Pet[]>(pets);
  const [activeTab, setActiveTab] = useState("all");
  const [mapCenter, setMapCenter] = useState<Location>(initialCenter);
  const mapRef = useRef<L.Map | null>(null);

  // Handle marker click
  const handleMarkerClick = (petId: string) => {
    const pet = pets.find((p) => p.id === petId);
    if (pet) {
      setSelectedPet(pet);
      setMapCenter(pet.coordinates);
      onMarkerClick(petId);
    }
  };

  // Close pet info window
  const handleCloseInfo = () => {
    setSelectedPet(null);
  };

  // Handle filter changes
  const handleFilterChange = (filters: any) => {
    // In a real implementation, this would filter the pets based on the criteria
    // For now, we'll just simulate filtering with a timeout
    setTimeout(() => {
      // Simple filtering example
      let filtered = [...pets];

      // Filter by status if specified
      if (filters.status && filters.status !== "all") {
        filtered = filtered.filter((pet) => pet.status === filters.status);
      }

      // Filter by pet type if any selected
      if (filters.petType && filters.petType.length > 0) {
        filtered = filtered.filter((pet) =>
          filters.petType.some(
            (type: string) => pet.type.toLowerCase() === type.toLowerCase(),
          ),
        );
      }

      setFilteredPets(filtered);
    }, 300);
  };

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === "all") {
      setFilteredPets(pets);
    } else {
      setFilteredPets(pets.filter((pet) => pet.status === value));
    }
  };

  // Format date for popup
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Initialize filtered pets
  useEffect(() => {
    setFilteredPets(pets);
  }, [pets]);

  return (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Map Controls */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold">Pet Locations</h2>
          <Badge variant="outline" className="ml-2">
            {filteredPets.length} pets
          </Badge>
        </div>

        <div className="flex items-center space-x-2">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-[300px]"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="lost">Lost</TabsTrigger>
              <TabsTrigger value="found">Found</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-primary/10" : ""}
          >
            <Filter className="h-4 w-4" />
          </Button>

          <div className="border rounded-md flex">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-r-none ${viewMode === "map" ? "bg-primary/10" : ""}`}
              onClick={() => setViewMode("map")}
            >
              <MapIcon className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-l-none ${viewMode === "list" ? "bg-primary/10" : ""}`}
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-[300px] border-r h-full overflow-auto">
            <MapFilters onFilterChange={handleFilterChange} />
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 relative">
          {viewMode === "map" ? (
            <div className="w-full h-full bg-gray-100 relative">
              {/* This would be replaced with an actual map component */}
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <MapIcon className="h-16 w-16 mx-auto text-gray-400" />
                  <p className="mt-2">Interactive Map View</p>
                  <p className="text-sm text-gray-400">
                    (Map implementation would go here)
                  </p>
                </div>
              </div>

              {/* Simulate map markers */}
              {filteredPets.map((pet) => (
                <div
                  key={pet.id}
                  className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${(pet.coordinates.lng + 74.01) * 10}px`,
                    top: `${(40.75 - pet.coordinates.lat) * 10}px`,
                  }}
                  onClick={() => handleMarkerClick(pet.id)}
                >
                  <div
                    className={`p-1 rounded-full ${pet.status === "lost" ? "bg-red-500" : "bg-green-500"}`}
                  >
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                </div>
              ))}

              {/* Selected pet info window */}
              {selectedPet && (
                <div
                  className="absolute z-10"
                  style={{
                    left: `${(selectedPet.coordinates.lng + 74.01) * 10}px`,
                    top: `${(40.75 - selectedPet.coordinates.lat) * 10 - 120}px`,
                  }}
                >
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white shadow-md z-10"
                      onClick={handleCloseInfo}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <PetPreviewCard
                      pet={selectedPet}
                      onViewDetails={onViewDetails}
                      onContact={onContact}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full overflow-auto p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPets.map((pet) => (
                  <PetPreviewCard
                    key={pet.id}
                    pet={pet}
                    onViewDetails={onViewDetails}
                    onContact={onContact}
                  />
                ))}
              </div>
              {filteredPets.length === 0 && (
                <div className="w-full h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <Search className="h-12 w-12 mx-auto text-gray-400" />
                    <p className="mt-2">No pets match your search criteria</p>
                    <Button
                      variant="link"
                      onClick={() => {
                        setFilteredPets(pets);
                        setShowFilters(false);
                      }}
                    >
                      Clear all filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
