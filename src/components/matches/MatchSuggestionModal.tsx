import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Check, X, ArrowRight, ArrowLeft, Percent } from "lucide-react";

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  color: string;
  gender: string;
  size: string;
  imageUrl: string;
  location: string;
  reportedDate: string;
  status: "lost" | "found";
  description?: string;
}

interface MatchSuggestionModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  matches?: Array<{
    lostPet: Pet;
    foundPet: Pet;
    confidenceScore: number;
    matchId: string;
  }>;
  onConfirmMatch?: (matchId: string) => void;
  onRejectMatch?: (matchId: string) => void;
  onContactOwner?: (petId: string) => void;
}

const MatchSuggestionModal = ({
  isOpen = true,
  onClose = () => {},
  matches = [
    {
      matchId: "match-1",
      lostPet: {
        id: "lost-1",
        name: "Max",
        type: "Dog",
        breed: "Golden Retriever",
        color: "Golden",
        gender: "Male",
        size: "Large",
        imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d",
        location: "Central Park, New York",
        reportedDate: "2023-06-15",
        status: "lost",
        description:
          "Friendly dog with a blue collar. Last seen near the lake.",
      },
      foundPet: {
        id: "found-1",
        name: "Unknown",
        type: "Dog",
        breed: "Golden Retriever",
        color: "Golden",
        gender: "Male",
        size: "Large",
        imageUrl: "https://images.unsplash.com/photo-1561037404-61cd46aa615b",
        location: "East River Park, New York",
        reportedDate: "2023-06-17",
        status: "found",
        description: "Found friendly golden dog with blue collar, no tags.",
      },
      confidenceScore: 92,
    },
    {
      matchId: "match-2",
      lostPet: {
        id: "lost-2",
        name: "Luna",
        type: "Cat",
        breed: "Siamese",
        color: "Cream",
        gender: "Female",
        size: "Medium",
        imageUrl:
          "https://images.unsplash.com/photo-1592194996308-7b43878e84a6",
        location: "Brooklyn Heights, New York",
        reportedDate: "2023-06-10",
        status: "lost",
        description: "Shy cat with blue eyes and a pink collar with bell.",
      },
      foundPet: {
        id: "found-2",
        name: "Unknown",
        type: "Cat",
        breed: "Siamese Mix",
        color: "Cream/Tan",
        gender: "Female",
        size: "Medium",
        imageUrl: "https://images.unsplash.com/photo-1555685812-4b8f594e8e3b",
        location: "Prospect Park, Brooklyn",
        reportedDate: "2023-06-12",
        status: "found",
        description: "Found cream-colored cat with blue eyes, very timid.",
      },
      confidenceScore: 85,
    },
  ],
  onConfirmMatch = () => {},
  onRejectMatch = () => {},
  onContactOwner = () => {},
}: MatchSuggestionModalProps) => {
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const currentMatch = matches[currentMatchIndex];

  const handleNextMatch = () => {
    if (currentMatchIndex < matches.length - 1) {
      setCurrentMatchIndex(currentMatchIndex + 1);
    }
  };

  const handlePreviousMatch = () => {
    if (currentMatchIndex > 0) {
      setCurrentMatchIndex(currentMatchIndex - 1);
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 70) return "bg-yellow-500";
    return "bg-orange-500";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Potential Match Found
          </DialogTitle>
          <p className="text-gray-500">
            Our AI has identified potential matches for your pet. Please review
            the details below.
          </p>
        </DialogHeader>

        {matches.length > 0 ? (
          <div className="space-y-6">
            {/* Match navigation */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge
                  variant="secondary"
                  className="px-3 py-1 text-sm font-medium"
                >
                  Match {currentMatchIndex + 1} of {matches.length}
                </Badge>
                <div className="flex items-center space-x-1">
                  <Percent className="h-4 w-4 text-green-600" />
                  <span className="font-medium">
                    {currentMatch.confidenceScore}% Match
                  </span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousMatch}
                  disabled={currentMatchIndex === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextMatch}
                  disabled={currentMatchIndex === matches.length - 1}
                >
                  Next <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>

            {/* Confidence score indicator */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Match Confidence</span>
                <span className="font-medium">
                  {currentMatch.confidenceScore}%
                </span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getConfidenceColor(currentMatch.confidenceScore)}`}
                  style={{ width: `${currentMatch.confidenceScore}%` }}
                ></div>
              </div>
            </div>

            {/* Pet comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lost Pet */}
              <Card>
                <div className="p-4 border-b bg-red-50">
                  <Badge variant="destructive">Lost Pet</Badge>
                  <h3 className="text-lg font-semibold mt-2">
                    {currentMatch.lostPet.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Reported on {formatDate(currentMatch.lostPet.reportedDate)}
                  </p>
                </div>
                <div className="aspect-square overflow-hidden">
                  <img
                    src={currentMatch.lostPet.imageUrl}
                    alt={`Lost pet: ${currentMatch.lostPet.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Type</p>
                      <p>{currentMatch.lostPet.type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Breed</p>
                      <p>{currentMatch.lostPet.breed}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Color</p>
                      <p>{currentMatch.lostPet.color}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Gender
                      </p>
                      <p>{currentMatch.lostPet.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Size</p>
                      <p>{currentMatch.lostPet.size}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Location
                      </p>
                      <p className="truncate">
                        {currentMatch.lostPet.location}
                      </p>
                    </div>
                  </div>
                  {currentMatch.lostPet.description && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Description
                      </p>
                      <p className="text-sm">
                        {currentMatch.lostPet.description}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Found Pet */}
              <Card>
                <div className="p-4 border-b bg-green-50">
                  <Badge variant="secondary">Found Pet</Badge>
                  <h3 className="text-lg font-semibold mt-2">
                    {currentMatch.foundPet.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Reported on {formatDate(currentMatch.foundPet.reportedDate)}
                  </p>
                </div>
                <div className="aspect-square overflow-hidden">
                  <img
                    src={currentMatch.foundPet.imageUrl}
                    alt={`Found pet: ${currentMatch.foundPet.name}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Type</p>
                      <p>{currentMatch.foundPet.type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Breed</p>
                      <p>{currentMatch.foundPet.breed}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Color</p>
                      <p>{currentMatch.foundPet.color}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Gender
                      </p>
                      <p>{currentMatch.foundPet.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Size</p>
                      <p>{currentMatch.foundPet.size}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Location
                      </p>
                      <p className="truncate">
                        {currentMatch.foundPet.location}
                      </p>
                    </div>
                  </div>
                  {currentMatch.foundPet.description && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Description
                      </p>
                      <p className="text-sm">
                        {currentMatch.foundPet.description}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Matching details */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">
                Why we think this is a match:
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>
                    Both pets are {currentMatch.lostPet.type}s with similar
                    physical characteristics
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>
                    The {currentMatch.foundPet.breed} breed matches or is very
                    similar to {currentMatch.lostPet.breed}
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>
                    Found within {Math.floor(Math.random() * 5) + 1} miles of
                    the lost location
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>
                    Found {Math.floor(Math.random() * 3) + 1} days after the pet
                    was reported lost
                  </span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                  <span>Visual similarity detected in AI image analysis</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-gray-500">No potential matches found yet.</p>
          </div>
        )}

        <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between mt-6">
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onRejectMatch(currentMatch.matchId)}
              className="flex-1 sm:flex-none"
            >
              <X className="h-4 w-4 mr-2" /> Not a Match
            </Button>
            <Button
              variant="default"
              onClick={() => onConfirmMatch(currentMatch.matchId)}
              className="flex-1 sm:flex-none"
            >
              <Check className="h-4 w-4 mr-2" /> Confirm Match
            </Button>
          </div>
          <Button
            variant="secondary"
            onClick={() => onContactOwner(currentMatch.foundPet.id)}
          >
            Contact Finder <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MatchSuggestionModal;
