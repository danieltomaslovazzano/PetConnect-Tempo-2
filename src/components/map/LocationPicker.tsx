import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// @ts-ignore
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./LeafletStyles.css";

interface LocationPickerProps {
  onLocationSelect?: (location: {
    lat: number;
    lng: number;
    address: string;
  }) => void;
  initialLocation?: { lat: number; lng: number; address: string };
  title?: string;
}

const LocationPicker = ({
  onLocationSelect = () => {},
  initialLocation = {
    lat: 40.7128,
    lng: -74.006,
    address: "New York, NY, USA",
  },
  title = "Select Location",
}: LocationPickerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const mapRef = useRef<L.Map | null>(null);

  const [searchResults, setSearchResults] = useState<
    Array<{ address: string; lat: number; lng: number }>
  >([]);

  // Mock function to simulate searching for locations
  const handleSearch = () => {
    if (!searchQuery.trim()) return;

    // In a real implementation, this would call a geocoding API
    const mockResults = [
      { address: "Central Park, New York, NY", lat: 40.7812, lng: -73.9665 },
      { address: "Times Square, New York, NY", lat: 40.758, lng: -73.9855 },
      { address: "Brooklyn Bridge, New York, NY", lat: 40.7061, lng: -73.9969 },
    ];

    // Filter results based on search query
    const filteredResults = mockResults.filter((result) =>
      result.address.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    setSearchResults(filteredResults);
  };

  const handleLocationSelect = (location: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    setSelectedLocation(location);
    onLocationSelect(location);
    // Clear search results after selection
    setSearchResults([]);
  };

  // Map click handler component
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        const newLocation = {
          lat,
          lng,
          address: `Location at ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        };
        setSelectedLocation(newLocation);
        onLocationSelect(newLocation);
      },
    });
    return null;
  };

  return (
    <Card className="w-full max-w-[650px] h-[350px] bg-white">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <div className="relative mt-2">
          <Input
            type="text"
            placeholder="Search for an address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pr-10"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
        {searchResults.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
            {searchResults.map((result, index) => (
              <div
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleLocationSelect(result)}
              >
                {result.address}
              </div>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="w-full h-[200px] rounded-md relative overflow-hidden">
          <MapContainer
            center={[initialLocation.lat, initialLocation.lng]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            whenCreated={(map) => {
              mapRef.current = map;
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[selectedLocation.lat, selectedLocation.lng]}
              icon={
                new L.Icon({
                  iconUrl:
                    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
                  iconRetinaUrl:
                    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
                  shadowUrl:
                    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41],
                })
              }
            />
            <MapClickHandler />
          </MapContainer>

          {/* Selected location info */}
          <div className="absolute bottom-2 left-2 right-2 bg-white p-2 rounded-md shadow-md z-[1000]">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-blue-600" />
              <span className="text-sm truncate">
                {selectedLocation.address}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Lat: {selectedLocation.lat.toFixed(4)}, Lng:{" "}
              {selectedLocation.lng.toFixed(4)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationPicker;
