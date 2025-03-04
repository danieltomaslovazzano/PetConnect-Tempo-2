import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dog, Cat, Rabbit } from "lucide-react";

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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFormManagement } from "@/hooks/useFormManagement";

const petFormSchema = z.object({
  species: z.string().min(1, { message: "Please select a species" }),
  breed: z.string().optional(),
  name: z.string().optional(),
  age: z.string().optional(),
  gender: z.string().min(1, { message: "Please select a gender" }),
  size: z.string().min(1, { message: "Please select a size" }),
  primaryColor: z.string().min(1, { message: "Please select a primary color" }),
  secondaryColor: z.string().optional(),
  distinctiveFeatures: z.string().optional(),
  microchipped: z.string().optional(),
  collar: z.string().optional(),
  additionalInfo: z.string().optional(),
});

type PetFormValues = z.infer<typeof petFormSchema>;

interface PetDetailsFormProps {
  onSubmit?: (data: PetFormValues) => void;
  defaultValues?: Partial<PetFormValues>;
}

const PetDetailsForm = ({
  onSubmit = () => {},
  defaultValues = {
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
}: PetDetailsFormProps) => {
  // Use the useFormManagement hook
  const {
    form,
    isSubmitting,
    error,
    success,
    handleSubmit,
  } = useFormManagement<PetFormValues>({
    schema: petFormSchema,
    defaultValues,
    onSubmit: async (data) => {
      onSubmit(data);
    },
  });

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-6">Pet Details</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Species Selection with Icons */}
          <FormField
            control={form.control}
            name="species"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Species*</FormLabel>
                <div className="flex gap-4">
                  <div
                    className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-colors ${field.value === "dog" ? "border-primary bg-primary/10" : "border-gray-200 hover:border-gray-300"}`}
                    onClick={() => field.onChange("dog")}
                  >
                    <Dog className="h-8 w-8 mb-2" />
                    <span>Dog</span>
                  </div>
                  <div
                    className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-colors ${field.value === "cat" ? "border-primary bg-primary/10" : "border-gray-200 hover:border-gray-300"}`}
                    onClick={() => field.onChange("cat")}
                  >
                    <Cat className="h-8 w-8 mb-2" />
                    <span>Cat</span>
                  </div>
                  <div
                    className={`flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-colors ${field.value === "other" ? "border-primary bg-primary/10" : "border-gray-200 hover:border-gray-300"}`}
                    onClick={() => field.onChange("other")}
                  >
                    <Rabbit className="h-8 w-8 mb-2" />
                    <span>Other</span>
                  </div>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Breed */}
          <FormField
            control={form.control}
            name="breed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Breed</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Labrador Retriever, Siamese"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  If you know the breed of your pet, please specify it here.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pet's Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Max, Bella" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Age */}
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age (approximate)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 2 years, 6 months" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Gender */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender*</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <label htmlFor="male" className="cursor-pointer">
                        Male
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <label htmlFor="female" className="cursor-pointer">
                        Female
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unknown" id="unknown" />
                      <label htmlFor="unknown" className="cursor-pointer">
                        Unknown
                      </label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Size */}
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size*</FormLabel>
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
                    <SelectItem value="small">Small (0-20 lbs)</SelectItem>
                    <SelectItem value="medium">Medium (21-50 lbs)</SelectItem>
                    <SelectItem value="large">Large (51-90 lbs)</SelectItem>
                    <SelectItem value="xlarge">X-Large (90+ lbs)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Primary Color */}
          <FormField
            control={form.control}
            name="primaryColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Primary Color*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select primary color" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="black">Black</SelectItem>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="brown">Brown</SelectItem>
                    <SelectItem value="gray">Gray</SelectItem>
                    <SelectItem value="tan">Tan</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                    <SelectItem value="calico">Calico</SelectItem>
                    <SelectItem value="tabby">Tabby</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Secondary Color */}
          <FormField
            control={form.control}
            name="secondaryColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secondary Color</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select secondary color (if applicable)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="black">Black</SelectItem>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="brown">Brown</SelectItem>
                    <SelectItem value="gray">Gray</SelectItem>
                    <SelectItem value="tan">Tan</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Distinctive Features */}
          <FormField
            control={form.control}
            name="distinctiveFeatures"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distinctive Features</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe any distinctive markings, scars, or other identifying features"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This information can help others identify your pet more
                  easily.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Microchipped */}
          <FormField
            control={form.control}
            name="microchipped"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Microchipped?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="microchipped-yes" />
                      <label
                        htmlFor="microchipped-yes"
                        className="cursor-pointer"
                      >
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="microchipped-no" />
                      <label
                        htmlFor="microchipped-no"
                        className="cursor-pointer"
                      >
                        No
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="unknown"
                        id="microchipped-unknown"
                      />
                      <label
                        htmlFor="microchipped-unknown"
                        className="cursor-pointer"
                      >
                        Unknown
                      </label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Collar */}
          <FormField
            control={form.control}
            name="collar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wearing a Collar?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-row gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="collar-yes" />
                      <label htmlFor="collar-yes" className="cursor-pointer">
                        Yes
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="collar-no" />
                      <label htmlFor="collar-no" className="cursor-pointer">
                        No
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="unknown" id="collar-unknown" />
                      <label
                        htmlFor="collar-unknown"
                        className="cursor-pointer"
                      >
                        Unknown
                      </label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormDescription>
                  If yes, please describe the collar in the additional
                  information section.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Additional Information */}
          <FormField
            control={form.control}
            name="additionalInfo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Information</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any other details that might help identify your pet (behavior, medical conditions, etc.)"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit button would typically be handled by the parent component */}
        </form>
      </Form>
    </div>
  );
};

export default PetDetailsForm;