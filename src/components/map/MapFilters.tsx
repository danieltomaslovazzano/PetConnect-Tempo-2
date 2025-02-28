import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Slider } from "../ui/slider";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Search, Filter, MapPin, Calendar, Dog, Cat, X } from "lucide-react";

interface MapFiltersProps {
  onFilterChange?: (filters: FilterState) => void;
}

interface FilterState {
  petType: string[];
  status: string;
  dateRange: number;
  distance: number;
  searchQuery: string;
}

const MapFilters = ({ onFilterChange = () => {} }: MapFiltersProps) => {
  const [filters, setFilters] = React.useState<FilterState>({
    petType: [],
    status: "all",
    dateRange: 30,
    distance: 10,
    searchQuery: "",
  });

  const handlePetTypeChange = (type: string) => {
    setFilters((prev) => {
      const newPetTypes = prev.petType.includes(type)
        ? prev.petType.filter((t) => t !== type)
        : [...prev.petType, type];

      const newFilters = { ...prev, petType: newPetTypes };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleStatusChange = (status: string) => {
    const newFilters = { ...filters, status };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateRangeChange = (value: number[]) => {
    const newFilters = { ...filters, dateRange: value[0] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDistanceChange = (value: number[]) => {
    const newFilters = { ...filters, distance: value[0] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, searchQuery: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      petType: [],
      status: "all",
      dateRange: 30,
      distance: 10,
      searchQuery: "",
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <Card className="w-full h-full bg-white overflow-auto">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Filters</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-sm flex items-center gap-1"
          >
            <X size={16} />
            Reset
          </Button>
        </div>
        <div className="relative mt-2">
          <input
            type="text"
            placeholder="Search by breed, color, etc."
            className="w-full pl-9 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            value={filters.searchQuery}
            onChange={handleSearchChange}
          />
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="font-medium flex items-center gap-2">
            <Filter size={16} />
            Status
          </h3>
          <RadioGroup
            value={filters.status}
            onValueChange={handleStatusChange}
            className="flex flex-col space-y-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <label htmlFor="all" className="text-sm">
                All
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="lost" id="lost" />
              <label htmlFor="lost" className="text-sm">
                Lost Pets
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="found" id="found" />
              <label htmlFor="found" className="text-sm">
                Found Pets
              </label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium flex items-center gap-2">
            <Dog size={16} />
            Pet Type
          </h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="dog"
                checked={filters.petType.includes("dog")}
                onCheckedChange={() => handlePetTypeChange("dog")}
              />
              <label htmlFor="dog" className="text-sm">
                Dogs
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="cat"
                checked={filters.petType.includes("cat")}
                onCheckedChange={() => handlePetTypeChange("cat")}
              />
              <label htmlFor="cat" className="text-sm">
                Cats
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="bird"
                checked={filters.petType.includes("bird")}
                onCheckedChange={() => handlePetTypeChange("bird")}
              />
              <label htmlFor="bird" className="text-sm">
                Birds
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="other"
                checked={filters.petType.includes("other")}
                onCheckedChange={() => handlePetTypeChange("other")}
              />
              <label htmlFor="other" className="text-sm">
                Other
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium flex items-center gap-2">
            <Calendar size={16} />
            Date Reported
          </h3>
          <Select
            value={filters.dateRange.toString()}
            onValueChange={(value) => handleDateRangeChange([parseInt(value)])}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 3 months</SelectItem>
              <SelectItem value="180">Last 6 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <MapPin size={16} />
            Distance
          </h3>
          <div className="px-2">
            <Slider
              value={[filters.distance]}
              min={1}
              max={50}
              step={1}
              onValueChange={handleDistanceChange}
            />
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>1 mile</span>
              <span>{filters.distance} miles</span>
              <span>50 miles</span>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button className="w-full">Apply Filters</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MapFilters;
