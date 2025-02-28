import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Camera, MapPin, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PetPhotoUploader from "./PetPhotoUploader";
import PetDetailsForm from "./PetDetailsForm";
import LocationPicker from "../map/LocationPicker";

interface ReportPetModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  reportType?: "lost" | "found";
  onSubmit?: (data: ReportPetFormData) => void;
}

interface ReportPetFormData {
  reportType: "lost" | "found";
  photos: Array<{
    id: string;
    url: string;
    name: string;
    size: number;
    progress: number;
  }>;
  petDetails: {
    species: string;
    breed: string;
    name: string;
    age: string;
    gender: string;
    size: string;
    primaryColor: string;
    secondaryColor: string;
    distinctiveFeatures: string;
    microchipped: string;
    collar: string;
    additionalInfo: string;
  };
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  contactPreferences: {
    preferredMethod: string;
    phoneNumber: string;
    emailVisible: boolean;
    notes: string;
  };
}

const ReportPetModal = ({
  open = true,
  onOpenChange = () => {},
  reportType = "lost",
  onSubmit = () => {},
}: ReportPetModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ReportPetFormData>({
    reportType,
    photos: [],
    petDetails: {
      species: "",
      breed: "",
      name: "",
      age: "",
      gender: "",
      size: "",
      primaryColor: "",
      secondaryColor: "",
      distinctiveFeatures: "",
      microchipped: "",
      collar: "",
      additionalInfo: "",
    },
    location: {
      lat: 40.7128,
      lng: -74.006,
      address: "New York, NY, USA",
    },
    contactPreferences: {
      preferredMethod: "email",
      phoneNumber: "",
      emailVisible: true,
      notes: "",
    },
  });

  const steps = [
    { id: "photos", label: "Photos", icon: <Camera className="h-4 w-4" /> },
    { id: "details", label: "Pet Details", icon: null },
    { id: "location", label: "Location", icon: <MapPin className="h-4 w-4" /> },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePhotosChange = (photos: any[]) => {
    setFormData({ ...formData, photos });
  };

  const handlePetDetailsChange = (petDetails: any) => {
    setFormData({ ...formData, petDetails });
  };

  const handleLocationChange = (location: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    setFormData({ ...formData, location });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {reportType === "lost" ? "Report a Lost Pet" : "Report a Found Pet"}
          </DialogTitle>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div
                  className={`flex flex-col items-center ${index <= currentStep ? "text-primary" : "text-gray-400"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${index <= currentStep ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}
                  >
                    {index < currentStep ? "✓" : <span>{index + 1}</span>}
                  </div>
                  <span className="text-xs font-medium">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${index < currentStep ? "bg-primary" : "bg-gray-200"}`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step content */}
        <div className="mt-4">
          <Tabs value={steps[currentStep].id} className="w-full">
            <TabsContent value="photos" className="mt-0">
              <PetPhotoUploader
                photos={formData.photos}
                onPhotosChange={handlePhotosChange}
              />
            </TabsContent>

            <TabsContent value="details" className="mt-0">
              <PetDetailsForm
                defaultValues={formData.petDetails}
                onSubmit={handlePetDetailsChange}
              />
            </TabsContent>

            <TabsContent value="location" className="mt-0">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">
                    {reportType === "lost"
                      ? "Where was your pet last seen?"
                      : "Where did you find this pet?"}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Please provide the most accurate location possible to help
                    increase the chances of a successful reunion.
                  </p>
                </div>
                <div className="flex justify-center">
                  <LocationPicker
                    initialLocation={formData.location}
                    onLocationSelect={handleLocationChange}
                    title={
                      reportType === "lost"
                        ? "Last Seen Location"
                        : "Found Location"
                    }
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          <Button onClick={handleNext}>
            {currentStep < steps.length - 1 ? (
              <>
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </>
            ) : (
              <>
                Submit Report <Save className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportPetModal;
