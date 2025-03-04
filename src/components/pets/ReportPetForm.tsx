import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle, PawPrint } from "lucide-react";
import { CreatePetRequest } from "@/api";
import { usePets } from "@/hooks";
import PetPhotoUploader from "./PetPhotoUploader";
import LocationPicker from "../map/LocationPicker";
import CardLayout from "@/components/ui/card-layout";
import { useFormManagement } from "@/hooks/useFormManagement";

// Form schema for validation
const formSchema = z.object({
  name: z.string().min(1, { message: "Pet name is required" }),
  type: z.string().min(1, { message: "Pet type is required" }),
  breed: z.string().min(1, { message: "Breed is required" }),
  color: z.string().optional(),
  gender: z.enum(["male", "female", "unknown"]),
  size: z.enum(["small", "medium", "large", "xlarge"]),
  age: z.string().optional(),
  description: z.string().min(1, { message: "Description is required" }),
  status: z.enum(["lost", "found"]),
  owner_name: z.string().min(1, { message: "Your name is required" }),
  owner_email: z.string().email({ message: "Valid email is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }),
  image_url: z.string().url().optional(),
  microchipped: z.boolean().default(false),
  collar: z.boolean().default(false),
  distinctive_features: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ReportPetFormProps {
  reportType: "lost" | "found";
  onSuccess?: (data: any) => void;
  onCancel?: () => void;
}

const ReportPetForm = ({
  reportType = "lost",
  onSuccess = () => {},
  onCancel = () => {},
}: ReportPetFormProps) => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
    address: string;
  }>({
    lat: 40.7128,
    lng: -74.006,
    address: "New York, NY, USA",
  });
  const { createPet } = usePets();

  // Use the useFormManagement hook
  const {
    form,
    isSubmitting,
    error,
    success,
    handleSubmit,
  } = useFormManagement<FormValues>({
    schema: formSchema,
    defaultValues: {
      name: reportType === "found" ? "Unknown" : "",
      type: "Dog",
      breed: "",
      color: "",
      gender: "unknown",
      size: "medium",
      age: "",
      description: "",
      status: reportType,
      owner_name: "",
      owner_email: "",
      location: location.address,
      coordinates: { lat: location.lat, lng: location.lng },
      microchipped: false,
      collar: false,
      distinctive_features: "",
    },
    onSubmit: async (data) => {
      // Ensure image URL is included if provided
      if (imageUrl && !data.image_url) {
        data.image_url = imageUrl;
      }

      // Validate required fields
      if (!data.name || !data.breed || !data.location) {
        throw new Error("Please fill in all required fields");
      }

      // Validate coordinates
      if (!data.coordinates || !data.coordinates.lat || !data.coordinates.lng) {
        throw new Error("Please select a valid location on the map");
      }

      // Create pet using the API
      const petData: CreatePetRequest = {
        ...data,
        status: reportType,
      };

      const result = await createPet(petData);
      onSuccess(result);
    },
  });

  // Handle image upload completion
  const handleImageUploaded = (url: string) => {
    setImageUrl(url);
    form.setValue("image_url", url);
  };

  // Handle location selection
  const handleLocationSelect = (loc: {
    lat: number;
    lng: number;
    address: string;
  }) => {
    setLocation(loc);
    form.setValue("location", loc.address);
    form.setValue("coordinates", { lat: loc.lat, lng: loc.lng });
  };

  return (
    <CardLayout
      title={`${reportType === "lost" ? "Lost" : "Found"} Pet Report`}
      description={`Please fill out the form below to report a ${reportType} pet.`}
      icon={<PawPrint className="h-6 w-6 text-blue-500" />}
      className="max-w-3xl mx-auto"
    >
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800">Success!</AlertTitle>
          <AlertDescription className="text-green-700">
            Your {reportType} pet report has been submitted successfully.
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Pet Information</h3>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pet Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Max" {...field} />
                      </FormControl>
                      <FormDescription>
                        {reportType === "found" &&
                          "Use 'Unknown' if you don't know the pet's name"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pet Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Dog">Dog</SelectItem>
                            <SelectItem value="Cat">Cat</SelectItem>
                            <SelectItem value="Bird">Bird</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="breed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Breed</FormLabel>
                        <FormControl>
                          <Input placeholder="Golden Retriever" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <FormControl>
                          <Input placeholder="Golden" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="unknown">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                            <SelectItem value="xlarge">X-Large</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age (if known)</FormLabel>
                      <FormControl>
                        <Input placeholder="2 years" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide details about the pet's appearance, behavior, or circumstances when lost/found"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="microchipped"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Microchipped</FormLabel>
                          <FormDescription>
                            Does the pet have a microchip?
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="collar"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Wearing Collar</FormLabel>
                          <FormDescription>
                            Is the pet wearing a collar?
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="distinctive_features"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Distinctive Features</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="White patch on chest, scar on left ear, etc."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Your Information</h3>

                <FormField
                  control={form.control}
                  name="owner_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="owner_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        We'll use this to contact you about potential matches
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Pet Photo</h3>
                <PetPhotoUploader onImageUploaded={handleImageUploaded} />
                {imageUrl && (
                  <div className="mt-2">
                    <p className="text-sm text-green-600">
                      Image uploaded successfully!
                    </p>
                    <div className="mt-2 relative aspect-video w-full overflow-hidden rounded-md border">
                      <img
                        src={imageUrl}
                        alt="Uploaded pet"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Location</h3>
                <p className="text-sm text-gray-500">
                  Please select the location where the pet was{" "}
                  {reportType === "lost" ? "last seen" : "found"}
                </p>
                <div className="h-[350px] w-full">
                  <LocationPicker
                    onLocationSelect={handleLocationSelect}
                    title={`Select where pet was ${reportType === "lost" ? "last seen" : "found"}`}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit Report
            </Button>
          </div>
        </form>
      </Form>
    </CardLayout>
  );
};

export default ReportPetForm;