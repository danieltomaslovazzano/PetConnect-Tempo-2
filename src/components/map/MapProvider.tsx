import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

interface Location {
  lat: number;
  lng: number;
}

interface MapContextType {
  userLocation: Location | null;
  isLocating: boolean;
  locateUser: () => void;
  setCustomLocation: (location: Location) => void;
}

const MapContext = createContext<MapContextType>({
  userLocation: null,
  isLocating: false,
  locateUser: () => {},
  setCustomLocation: () => {},
});

export const useMapContext = () => useContext(MapContext);

interface MapProviderProps {
  children: ReactNode;
  defaultLocation?: Location;
}

export const MapProvider = ({
  children,
  defaultLocation = { lat: 40.7128, lng: -74.006 }, // New York by default
}: MapProviderProps) => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Function to get user's current location
  const locateUser = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setUserLocation(defaultLocation);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setUserLocation(defaultLocation);
    }
  };

  // Function to set a custom location
  const setCustomLocation = (location: Location) => {
    setUserLocation(location);
  };

  // Try to get user location on initial load
  useEffect(() => {
    locateUser();
  }, []);

  return (
    <MapContext.Provider
      value={{
        userLocation,
        isLocating,
        locateUser,
        setCustomLocation,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
