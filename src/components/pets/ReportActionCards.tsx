import React from "react";
import { Button } from "@/components/ui/button";
import { Search, PawPrint, MapPin } from "lucide-react";
import CardLayout from "@/components/ui/card-layout";

interface ReportActionCardsProps {
  onLostPetClick?: () => void;
  onFoundPetClick?: () => void;
}

const ReportActionCards: React.FC<ReportActionCardsProps> = ({
  onLostPetClick = () => {},
  onFoundPetClick = () => {},
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-white">
      <h2 className="text-2xl font-bold text-center mb-8">
        How can we help you today?
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Lost Pet Card */}
        <CardLayout
          title="I Lost My Pet"
          description="Create a lost pet report and let our AI technology help find your pet by matching with found pet reports in your area."
          icon={<Search className="h-6 w-6 text-red-500" />}
          className="border-2 border-red-100 hover:border-red-200"
          headerClassName="bg-red-50"
        >
          <div className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>Upload multiple photos for better AI matching</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>Provide detailed information about your pet</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 font-bold">•</span>
                <span>Get real-time notifications for potential matches</span>
              </li>
            </ul>

            <Button
              onClick={onLostPetClick}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
              size="lg"
            >
              <PawPrint className="mr-2 h-5 w-5" />
              Report Lost Pet
            </Button>
          </div>
        </CardLayout>

        {/* Found Pet Card */}
        <CardLayout
          title="I Found a Pet"
          description="Report a found pet to help reunite it with its owner. Our platform will search for matching lost pet reports in the area."
          icon={<MapPin className="h-6 w-6 text-green-500" />}
          className="border-2 border-green-100 hover:border-green-200"
          headerClassName="bg-green-50"
        >
          <div className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">•</span>
                <span>Take clear photos to help with identification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">•</span>
                <span>Mark the exact location where you found the pet</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 font-bold">•</span>
                <span>
                  Connect with potential owners through secure messaging
                </span>
              </li>
            </ul>

            <Button
              onClick={onFoundPetClick}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              <PawPrint className="mr-2 h-5 w-5" />
              Report Found Pet
            </Button>
          </div>
        </CardLayout>
      </div>
    </div>
  );
};

export default ReportActionCards;