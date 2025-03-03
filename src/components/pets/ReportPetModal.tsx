import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ReportPetForm from "./ReportPetForm";

interface ReportPetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportType: "lost" | "found";
  onSubmit: (data: any) => void;
}

const ReportPetModal = ({
  open = false,
  onOpenChange,
  reportType = "lost",
  onSubmit,
}: ReportPetModalProps) => {
  // Handle modal close
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Report {reportType === "lost" ? "Lost" : "Found"} Pet
          </DialogTitle>
        </DialogHeader>

        <ReportPetForm
          reportType={reportType}
          onSuccess={onSubmit}
          onCancel={handleClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ReportPetModal;
