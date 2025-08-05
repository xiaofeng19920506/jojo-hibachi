import React from "react";
import { Box, Typography, Alert } from "@mui/material";
import type { FoodEntry } from "../../../../components/DataTable/types";

interface ConfirmationDialogProps {
  dialogType: "cancel" | "delete";
  activeTable: string;
  editFormData: Partial<FoodEntry>;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  dialogType,
  activeTable,
  editFormData,
}) => {
  if (dialogType === "cancel") {
    return (
      <Box sx={{ pt: 2 }}>
        <Typography variant="body1">
          Are you sure you want to cancel this reservation?
        </Typography>
      </Box>
    );
  }

  if (dialogType === "delete" && activeTable === "food") {
    return (
      <Box sx={{ pt: 1 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Are you sure you want to delete this food item? This action cannot be
          undone.
        </Alert>
        <Typography variant="body1">
          <strong>Name:</strong> {editFormData.name}
        </Typography>
        <Typography variant="body1">
          <strong>Category:</strong> {editFormData.category}
        </Typography>
        <Typography variant="body1">
          <strong>Price:</strong> ${editFormData.price}
        </Typography>
      </Box>
    );
  }

  return null;
};

export default ConfirmationDialog;
