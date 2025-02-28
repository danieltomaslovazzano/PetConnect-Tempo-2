import React from "react";
import { MapProvider } from "./MapProvider";

interface MapWrapperProps {
  children: React.ReactNode;
}

const MapWrapper = ({ children }: MapWrapperProps) => {
  return <MapProvider>{children}</MapProvider>;
};

export default MapWrapper;
