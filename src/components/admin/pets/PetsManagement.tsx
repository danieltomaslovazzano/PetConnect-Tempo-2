import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  Eye,
  MapPin,
} from "lucide-react";
import CreatePetDialog from "./CreatePetDialog";
import EditPetDialog from "./EditPetDialog";
import { formatDate } from "@/utils/utilityModule";

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  owner: string;
  ownerEmail: string;
  status: "lost" | "found" | "blocked" | "resolved";
  reportedDate: string;
  location: string;
  imageUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  owner: string;
  ownerEmail: string;
  status: "lost" | "found" | "blocked" | "resolved";
  reportedDate: string;
  location: string;
  imageUrl: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

const PetsManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  // Mock pets data
  const [pets, setPets] = useState<Pet[]>([
    {
      id: "1",
      name: "Max",
      type: "Dog",
      breed: "Golden Retriever",
      owner: "John Smith",
      ownerEmail: "john.smith@example.com",
      status: "lost",
      reportedDate: "2023-06-15",
      location: "Central Park, New York",
      imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d",
      coordinates: { lat: 40.7812, lng: -73.9665 },
    },
    {
      id: "2",
      name: "Luna",
      type: "Cat",
      breed: "Siamese",
      owner: "Sarah Johnson",
      ownerEmail: "sarah.j@example.com",
      status: "found",
      reportedDate: "2023-06-18",
      location: "Brooklyn Heights, New York",
      imageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba",
      coordinates: { lat: 40.6958, lng: -73.9936 },
    },
    {
      id: "3",
      name: "Buddy",
      type: "Dog",
      breed: "Labrador",
      owner: "Michael Brown",
      ownerEmail: "michael.b@example.com",
      status: "resolved",
      reportedDate: "2023-06-20",
      location: "Prospect Park, Brooklyn",
      imageUrl: "https://images.unsplash.com/photo-1587300003388-59208cc962cb",
      coordinates: { lat: 40.6602, lng: -73.969 },
    },
    {
      id: "4",
      name: "Oliver",
      type: "Cat",
      breed: "Tabby",
      owner: "Emily Davis",
      ownerEmail: "emily.d@example.com",
      status: "lost",
      reportedDate: "2023-06-22",
      location: "East Village, Manhattan",
      imageUrl: "https://images.unsplash.com/photo-1573865526739-10659fec78a5",
      coordinates: { lat: 40.7264, lng: -73.9818 },
    },
    {
      id: "5",
      name: "Daisy",
      type: "Dog",
      breed: "Beagle",
      owner: "David Wilson",
      ownerEmail: "david.w@example.com",
      status: "blocked",
      reportedDate: "2023-06-25",
      location: "Battery Park, Manhattan",
      imageUrl: "https://images.unsplash.com/photo-1505628346881-b72b27e84530",
      coordinates: { lat: 40.7033, lng: -74.017 },
    },
  ]);

  // Filter pets based on search query
  const filteredPets = pets.filter(
    (pet) =>
      pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pet.owner.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Handle pet creation
  const handleCreatePet = (newPet: Omit<Pet, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setPets([
      ...pets,
      {
        id,
        ...newPet,
      },
    ]);
    setShowCreateDialog(false);
  };

  // Handle pet update
  const handleUpdatePet = (updatedPet: Pet) => {
    setPets(pets.map((pet) => (pet.id === updatedPet.id ? updatedPet : pet)));
    setShowEditDialog(false);
    setSelectedPet(null);
  };

  // Handle pet deletion
  const handleDeletePet = (petId: string) => {
    if (window.confirm("Are you sure you want to delete this pet?")) {
      setPets(pets.filter((pet) => pet.id !== petId));
    }
  };

  // Handle pet block/unblock
  const handleTogglePetStatus = (petId: string) => {
    setPets(
      pets.map((pet) => {
        if (pet.id === petId) {
          return {
            ...pet,
            status: pet.status === "blocked" ? "lost" : "blocked",
          };
        }
        return pet;
      }),
    );
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "lost":
        return "destructive";
      case "found":
        return "secondary";
      case "resolved":
        return "success";
      case "blocked":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pets Management</h1>
          <p className="text-muted-foreground">
            Manage pet listings and reports
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Pet
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search pets by name, breed, or owner..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Pets table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pet</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Reported</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPets.length > 0 ? (
              filteredPets.map((pet) => (
                <TableRow key={pet.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md overflow-hidden">
                        <img
                          src={pet.imageUrl}
                          alt={pet.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{pet.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {pet.type} - {pet.breed}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{pet.owner}</p>
                      <p className="text-sm text-muted-foreground">
                        {pet.ownerEmail}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(pet.status)}>
                      {pet.status.charAt(0).toUpperCase() + pet.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm truncate max-w-[150px]">
                        {pet.location}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(pet.reportedDate)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedPet(pet);
                            setShowEditDialog(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleTogglePetStatus(pet.id)}
                        >
                          {pet.status === "blocked" ? (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Unblock
                            </>
                          ) : (
                            <>
                              <Ban className="mr-2 h-4 w-4" />
                              Block
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeletePet(pet.id)}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No pets found. Try adjusting your search.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Pet Dialog */}
      <CreatePetDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSubmit={handleCreatePet}
      />

      {/* Edit Pet Dialog */}
      {selectedPet && (
        <EditPetDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          pet={selectedPet}
          onSubmit={handleUpdatePet}
        />
      )}
    </div>
  );
};

export default PetsManagement;
