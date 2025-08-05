import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { SelectChangeEvent } from "@mui/material";
import type { ReservationEntry, Employee } from "../types";
import type { FoodEntry } from "../../../components/DataTable/types";
import {
  ReservationEditForm,
  FoodEditForm,
  AssignmentForm,
  StatusForm,
  RoleForm,
  ConfirmationDialog,
} from "./EditDialog/index";

interface EditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  dialogType:
    | "edit"
    | "assign"
    | "status"
    | "cancel"
    | "role"
    | "delete"
    | "add";
  activeTable: string;
  userRole: string;
  loading: boolean;
  editFormData: Partial<ReservationEntry> | Partial<FoodEntry>;
  onEditFormChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => void;
  selectedEmployeeId: string;
  onAssignEmployeeChange: (e: SelectChangeEvent<string>) => void;
  selectedStatus: string;
  onStatusChange: (e: SelectChangeEvent<string>) => void;
  availableEmployees?: Employee[];
  getEmployeeDisplayName: (employee: Employee) => string;
}

const EditDialog: React.FC<EditDialogProps> = ({
  open,
  onClose,
  onSave,
  dialogType,
  activeTable,
  userRole,
  loading,
  editFormData,
  onEditFormChange,
  selectedEmployeeId,
  onAssignEmployeeChange,
  selectedStatus,
  onStatusChange,
  availableEmployees,
  getEmployeeDisplayName,
}) => {
  const isMobile = useMediaQuery("(max-width:600px)");

  const getDialogTitle = () => {
    if (dialogType === "edit") {
      return `Edit ${
        activeTable === "orders"
          ? "Order"
          : activeTable === "food"
          ? "Food Item"
          : "Reservation"
      }`;
    }
    if (dialogType === "add") {
      return `Add New ${
        activeTable === "orders"
          ? "Order"
          : activeTable === "food"
          ? "Food Item"
          : "Reservation"
      }`;
    }
    if (dialogType === "assign") {
      return `Assign ${activeTable === "orders" ? "Employee" : "Chef"}`;
    }
    if (dialogType === "role" && activeTable === "customers") {
      return "Change User Role";
    }
    if (dialogType === "delete") {
      return "Delete Food Item";
    }
    return "Update Status";
  };

  const renderFormContent = () => {
    if (dialogType === "edit" || dialogType === "add") {
      if (activeTable === "food") {
        return (
          <FoodEditForm
            editFormData={editFormData as Partial<FoodEntry>}
            onEditFormChange={onEditFormChange}
          />
        );
      }
      if (activeTable === "reservations") {
        return (
          <ReservationEditForm
            editFormData={editFormData as Partial<ReservationEntry>}
            onEditFormChange={onEditFormChange}
            userRole={userRole}
          />
        );
      }
    }

    if (dialogType === "assign") {
      return (
        <AssignmentForm
          selectedEmployeeId={selectedEmployeeId}
          onAssignEmployeeChange={onAssignEmployeeChange}
          availableEmployees={availableEmployees}
          getEmployeeDisplayName={getEmployeeDisplayName}
          activeTable={activeTable}
        />
      );
    }

    if (dialogType === "status") {
      return (
        <StatusForm
          selectedStatus={selectedStatus}
          onStatusChange={onStatusChange}
          activeTable={activeTable}
          userRole={userRole}
        />
      );
    }

    if (dialogType === "role") {
      return (
        <RoleForm
          editFormData={editFormData as { role?: string }}
          onEditFormChange={onEditFormChange}
          activeTable={activeTable}
        />
      );
    }

    if (dialogType === "cancel" || dialogType === "delete") {
      return (
        <ConfirmationDialog
          dialogType={dialogType}
          activeTable={activeTable}
          editFormData={editFormData as Partial<FoodEntry>}
        />
      );
    }

    return null;
  };

  const isFormValid = () => {
    if (dialogType === "edit" && activeTable === "reservations") {
      // Check for validation errors in reservation form
      // This would need to be implemented with proper validation state
      return true;
    }
    return true;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
    >
      <DialogTitle>{getDialogTitle()}</DialogTitle>
      <DialogContent>{renderFormContent()}</DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          color="secondary"
          disabled={loading}
          sx={{ fontSize: { xs: 16, sm: 18 }, minHeight: 44, minWidth: 44 }}
        >
          Cancel
        </Button>
        {dialogType === "cancel" ? (
          <Button
            variant="contained"
            color="error"
            onClick={onSave}
            disabled={loading}
          >
            Confirm Cancel
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={onSave}
            disabled={loading || !isFormValid()}
          >
            {loading ? <CircularProgress size={20} /> : "Save"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
