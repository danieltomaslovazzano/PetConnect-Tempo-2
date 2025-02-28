import React from "react";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PetPreviewCardProps {
  pet?: {
    id: string;
    name: string;
    type: string;
    breed: string;
    status: "lost" | "found";
    imageUrl: string;
    location: string;
    reportedDate: string;
    description?: string;
  };
  onViewDetails?: (petId: string) => void;
  onContact?: (petId: string) => void;
}

const PetPreviewCard = ({
  pet = {
    id: "1",
    name: "Max",
    type: "Dog",
    breed: "Golden Retriever",
    status: "lost",
    imageUrl:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=612&q=80",
    location: "Central Park, New York",
    reportedDate: "2023-06-15",
    description: "Friendly dog with a blue collar. Last seen near the lake.",
  },
  onViewDetails = () => {},
  onContact = () => {},
}: PetPreviewCardProps) => {
  const statusColor = pet.status === "lost" ? "destructive" : "secondary";

  // Format date to be more readable
  const formattedDate = new Date(pet.reportedDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Card className="w-[350px] h-[200px] overflow-hidden bg-white">
      <div className="flex h-full">
        <div className="w-1/3 h-full">
          <img
            src={pet.imageUrl}
            alt={`${pet.name} - ${pet.breed}`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-2/3 flex flex-col justify-between">
          <CardHeader className="p-3 pb-0">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{pet.name}</CardTitle>
                <p className="text-sm text-gray-600">
                  {pet.type} - {pet.breed}
                </p>
              </div>
              <Badge variant={statusColor} className="capitalize">
                {pet.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-3 pt-1 pb-0 space-y-2">
            <div className="flex items-center text-sm">
              <MapPin className="h-3.5 w-3.5 mr-1 text-gray-500" />
              <span className="text-gray-600 truncate">{pet.location}</span>
            </div>
            <div className="flex items-center text-sm">
              <Calendar className="h-3.5 w-3.5 mr-1 text-gray-500" />
              <span className="text-gray-600">{formattedDate}</span>
            </div>
            {pet.description && (
              <p className="text-xs text-gray-500 line-clamp-2">
                {pet.description}
              </p>
            )}
          </CardContent>

          <CardFooter className="p-3 pt-0 justify-between">
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
              Contact <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default PetPreviewCard;
