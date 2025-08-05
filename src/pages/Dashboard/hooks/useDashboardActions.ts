import type { SelectChangeEvent } from "@mui/material";
import type { ReservationEntry } from "../types";
import type {
  SortableEntry,
  FoodEntry,
} from "../../../components/DataTable/types";

export type DialogType =
  | "edit"
  | "assign"
  | "status"
  | "cancel"
  | "role"
  | "delete"
  | "add";

interface UseDashboardActionsProps {
  activeTable: string;
  userRole: string;
  setDialogType: (type: DialogType) => void;
  setSelectedReservation: (reservation: ReservationEntry | null) => void;
  setEditFormData: (
    data: Partial<ReservationEntry> | Partial<FoodEntry>
  ) => void;
  setDialogOpen: (open: boolean) => void;
  setSelectedStatus: (status: string) => void;
  setSelectedEmployeeId: (id: string) => void;
  handleUpdateFood: (id: string, data: Partial<FoodEntry>) => Promise<void>;
  handleDeleteFood: (id: string) => Promise<void>;
  handleCreateFood: (
    data: Omit<FoodEntry, "id" | "createdAt" | "updatedAt" | "status">
  ) => Promise<void>;
  updateReservation: any;
  updateReservationStatus: any;
  changeUserRole: any;
  editFormData: Partial<ReservationEntry> | Partial<FoodEntry>;
  selectedReservation: ReservationEntry | null;
  dialogType: string;
  selectedStatus: string;
  handleDialogClose: () => void;
}

export function useDashboardActions({
  activeTable,
  userRole,
  setDialogType,
  setSelectedReservation,
  setEditFormData,
  setDialogOpen,
  setSelectedStatus,
  setSelectedEmployeeId,
  handleUpdateFood,
  handleDeleteFood,
  handleCreateFood,
  updateReservation,
  updateReservationStatus,
  changeUserRole,
  editFormData,
  selectedReservation,
  dialogType,
  selectedStatus,
  handleDialogClose,
}: UseDashboardActionsProps) {
  const handleActionClick = (action: string, item: SortableEntry) => {
    switch (activeTable) {
      case "reservations": {
        const reservation = item as ReservationEntry;
        switch (action.toLowerCase()) {
          case "edit":
            setDialogType("edit");
            setSelectedReservation(reservation);
            setEditFormData({
              date: reservation.date,
              time: reservation.time,
              price: reservation.price,
              notes: reservation.notes || "",
              adult: reservation.adult,
              kids: reservation.kids,
              allergies: reservation.allergies || "",
              eventType: reservation.eventType || "",
            });
            setDialogOpen(true);
            break;
          case "cancel":
            setDialogType("cancel");
            setSelectedReservation(reservation);
            setDialogOpen(true);
            break;
          case "assign employee":
            setDialogType("assign");
            setSelectedReservation(reservation);
            setDialogOpen(true);
            break;
          case "update status":
            setDialogType("status");
            setSelectedReservation(reservation);
            setSelectedStatus(reservation.status || "pending");
            setDialogOpen(true);
            break;
          case "selection menu":
            window.location.href = `/reservation/${reservation.id}/menu`;
            break;
          default:
            console.log(`Action ${action} not implemented for reservations`);
        }
        break;
      }
      case "food": {
        const food = item as FoodEntry;
        switch (action.toLowerCase()) {
          case "update":
            setDialogType("edit");
            setEditFormData({
              id: food.id,
              name: food.name,
              description: food.description,
              price: food.price,
              category: food.category,
              status: food.status,
              preparationTime: food.preparationTime,
              calories: food.calories,
            });
            setDialogOpen(true);
            break;
          case "delete":
            setDialogType("delete");
            setEditFormData({
              id: food.id,
              name: food.name,
              description: food.description,
              price: food.price,
              category: food.category,
              status: food.status,
            });
            setDialogOpen(true);
            break;
          default:
            console.log(`Action ${action} not implemented for food`);
        }
        break;
      }
      default:
        console.log(
          `Action ${action} not implemented for table ${activeTable}`
        );
    }
  };

  const handleAssignEmployeeChange = (e: SelectChangeEvent<string>) => {
    setSelectedEmployeeId(e.target.value);
  };

  const handleStatusChange = (e: SelectChangeEvent<string>) => {
    setSelectedStatus(e.target.value);
  };

  const handleDialogSave = async () => {
    // The full logic from useDashboard.ts
    console.log("[handleDialogSave] Function called with:", {
      dialogType,
      activeTable,
      editFormData,
      selectedReservation,
      userRole,
    });

    // Allow add dialog and food edit/delete to proceed without selectedReservation
    if (
      !selectedReservation &&
      dialogType !== "add" &&
      !(dialogType === "edit" && activeTable === "food") &&
      !(dialogType === "delete" && activeTable === "food")
    ) {
      console.log("[handleDialogSave] Early return - no selectedReservation");
      return;
    }

    if (dialogType === "assign" && userRole !== "admin") {
      console.error("Only admins can assign employees");
      return;
    }
    if (
      dialogType === "status" &&
      activeTable === "reservations" &&
      userRole !== "admin" &&
      userRole !== "employee"
    ) {
      console.error("Only admins and employees can change reservation status");
      return;
    }

    try {
      if (dialogType === "edit") {
        console.log("[handleDialogSave] Processing edit dialog");
        if (activeTable === "orders") {
          console.log("[handleDialogSave] Orders table - not implemented");
        } else if (activeTable === "reservations") {
          console.log("[handleDialogSave] Processing reservation edit");
          // Update reservation for users and employees
          if (!selectedReservation) {
            console.error("No reservation selected for update");
            return;
          }

          console.log("[handleDialogSave] Calling updateReservation with:", {
            id: selectedReservation.id,
            data: editFormData,
          });

          try {
            // Use admin mutation for admin users, regular mutation for others
            await updateReservation({
              id: selectedReservation.id,
              data: editFormData,
            }).unwrap();
            console.log("[handleDialogSave] Reservation update successful");
            handleDialogClose(); // Close modal after successful update
          } catch (error) {
            console.error(
              "[handleDialogSave] Reservation update failed:",
              error
            );
            throw error;
          }
        } else if (activeTable === "employees") {
          // ... (keep as in original)
        } else if (activeTable === "customers") {
          // Handle customer updates if needed
          console.log("[handleDialogSave] Customer updates not implemented");
        } else if (activeTable === "food") {
          // Update food item
          const foodId = (editFormData as Record<string, unknown>).id as string;
          if (!foodId) {
            console.error("No food item ID found for update");
            return;
          }

          try {
            console.log("[handleDialogSave] Updating food item:", {
              foodId: foodId,
              updates: editFormData,
            });

            await handleUpdateFood(foodId, editFormData as Partial<FoodEntry>);
            console.log("[handleDialogSave] Food item update successful");
            handleDialogClose(); // Close modal after successful update
          } catch (error) {
            console.error("[handleDialogSave] Food item update failed:", error);
            throw error;
          }
        } else {
          if (userRole === "admin" && selectedReservation) {
            await updateReservationStatus({
              id: selectedReservation.id,
              status: selectedStatus,
            }).unwrap();
          }
        }
      } else if (dialogType === "add" && activeTable === "food") {
        // Add new food item
        try {
          const foodData = editFormData as Partial<FoodEntry>;

          console.log("[handleDialogSave] Food data for validation:", foodData);

          // Validate required fields
          if (!foodData.name || foodData.name.trim() === "") {
            console.error("Name is required");
            throw new Error("Name is required");
          }
          if (!foodData.description || foodData.description.trim() === "") {
            console.error("Description is required");
            throw new Error("Description is required");
          }
          if (
            foodData.price === undefined ||
            foodData.price === null ||
            foodData.price < 0
          ) {
            console.error(
              "Price is required and must be greater than or equal to 0"
            );
            throw new Error(
              "Price is required and must be greater than or equal to 0"
            );
          }
          if (!foodData.category || foodData.category.trim() === "") {
            console.error("Category is required");
            throw new Error("Category is required");
          }

          const newFoodData = {
            name: foodData.name.trim(),
            description: foodData.description.trim(),
            price: Number(foodData.price),
            category: foodData.category,
          };

          console.log("[handleDialogSave] Sending food data:", newFoodData);
          await handleCreateFood(newFoodData);
          console.log("[handleDialogSave] Food item creation successful");
          handleDialogClose(); // Close modal after successful update
        } catch (error) {
          console.error("[handleDialogSave] Food item creation failed:", error);
          throw error;
        }
      } else if (dialogType === "delete" && activeTable === "food") {
        // Delete food item
        const foodId = (editFormData as Record<string, unknown>).id as string;
        if (!foodId) {
          console.error("No food item ID found for deletion");
          return;
        }

        try {
          console.log("[handleDialogSave] Deleting food item:", {
            foodId: foodId,
          });

          await handleDeleteFood(foodId);
          console.log("[handleDialogSave] Food item deletion successful");
          handleDialogClose(); // Close modal after successful update
        } catch (error) {
          console.error("[handleDialogSave] Food item deletion failed:", error);
          throw error;
        }
      } else if (
        dialogType === "role" &&
        (activeTable === "customers" || activeTable === "employees")
      ) {
        // Change user role (for customers or employees)
        if (!selectedReservation) {
          console.error("No user selected for role change");
          return;
        }
        await changeUserRole({
          userId: selectedReservation.id,
          role: (editFormData as { role: string }).role,
        }).unwrap();
        handleDialogClose(); // Close modal after successful update
      }
    } catch (error) {
      console.error("[handleDialogSave] Error:", error);
      throw error;
    }
  };

  return {
    handleActionClick,
    handleAssignEmployeeChange,
    handleStatusChange,
    handleDialogSave,
  };
}
