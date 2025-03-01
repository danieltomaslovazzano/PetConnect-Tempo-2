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
// @ts-ignore
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./LeafletStyles.css";

// Fix for default marker icons in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

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

  // Create custom marker icons
  const createMarkerIcon = (status: "lost" | "found") => {
    return new L.Icon({
      iconUrl:
        status === "lost"
          ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png"
          : "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });
  };

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
            <div className="w-full h-full relative">
              <div style={{ height: "100%", width: "100%" }}>
                <MapContainer
                  center={[initialCenter.lat, initialCenter.lng]}
                  zoom={initialZoom}
                  style={{ height: "100%", width: "100%" }}
                  whenCreated={(map) => {
                    mapRef.current = map;
                  }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {filteredPets.map((pet) => (
                    <Marker
                      key={pet.id}
                      position={[pet.coordinates.lat, pet.coordinates.lng]}
                      icon={createMarkerIcon(pet.status)}
                      eventHandlers={{
                        click: () => handleMarkerClick(pet.id),
                      }}
                    >
                      {selectedPet && selectedPet.id === pet.id && (
                        <Popup closeButton={false}>
                          <div className="w-[250px]">
                            <div className="flex items-center gap-2 mb-2">
                              <img
                                src={pet.imageUrl}
                                alt={pet.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                              <div>
                                <h3 className="font-medium">{pet.name}</h3>
                                <p className="text-xs text-gray-500">
                                  {pet.type} - {pet.breed}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  pet.status === "lost"
                                    ? "destructive"
                                    : "secondary"
                                }
                                className="ml-auto capitalize"
                              >
                                {pet.status}
                              </Badge>
                            </div>
                            <p className="text-xs mb-2">{pet.description}</p>
                            <div className="flex justify-between">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onViewDetails(pet.id)}
                                className="text-xs px-2 h-7"
                              >
                                View Details
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => onContact(pet.id)}
                                className="text-xs px-2 h-7"
                              >
                                Contact
                              </Button>
                            </div>
                          </div>
                        </Popup>
                      )}
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              {/* Selected pet info window - positioned absolutely over the map */}
              {selectedPet && (
                <div className="absolute z-10 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
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
