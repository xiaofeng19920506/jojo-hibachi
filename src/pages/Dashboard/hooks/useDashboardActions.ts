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
  updateReservation: (args: {
    id: string;
    data: Partial<ReservationEntry>;
  }) => { unwrap: () => Promise<unknown> };
  updateReservationStatus: (args: { id: string; status: string }) => {
    unwrap: () => Promise<unknown>;
  };
  assignChefToReservation: (args: { id: string; chefId: string }) => {
    unwrap: () => Promise<unknown>;
  };
  changeUserRole: (args: { userId: string; role: string }) => {
    unwrap: () => Promise<unknown>;
  };
  editFormData: Partial<ReservationEntry> | Partial<FoodEntry>;
  selectedReservation: ReservationEntry | null;
  dialogType: string;
  selectedStatus: string;
  selectedEmployeeId: string;
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
  assignChefToReservation,
  changeUserRole,
  editFormData,
  selectedReservation,
  dialogType,
  selectedStatus,
  selectedEmployeeId,
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
            // Action not implemented for reservations
            break;
        }
        break;
      }
      case "customers": {
        const customer = item as unknown as Record<string, unknown>;
        switch (action.toLowerCase()) {
          case "change role":
            setDialogType("role");
            setEditFormData({
              id: customer.id as string,
              name: customer.name as string,
              email: customer.email as string,
            });
            setDialogOpen(true);
            break;
          default:
            // Action not implemented for customers
            break;
        }
        break;
      }
      case "orders": {
        const order = item as unknown as Record<string, unknown>;
        switch (action.toLowerCase()) {
          case "assign employee":
            setDialogType("assign");
            setEditFormData({
              id: order.id as string,
            });
            setDialogOpen(true);
            break;
          case "update status":
            setDialogType("status");
            setEditFormData({
              id: order.id as string,
            });
            setDialogOpen(true);
            break;
          case "edit order":
            setDialogType("edit");
            setEditFormData({
              id: order.id as string,
            });
            setDialogOpen(true);
            break;
          case "cancel order":
            setDialogType("cancel");
            setEditFormData({
              id: order.id as string,
            });
            setDialogOpen(true);
            break;
          default:
            // Action not implemented for orders
            break;
        }
        break;
      }
      case "employees": {
        const employee = item as unknown as Record<string, unknown>;
        switch (action.toLowerCase()) {
          case "change role":
            setDialogType("role");
            setEditFormData({
              id: employee.id as string,
              name: employee.name as string,
              email: employee.email as string,
            });
            setDialogOpen(true);
            break;
          case "update status":
            setDialogType("status");
            setEditFormData({
              id: employee.id as string,
              name: employee.name as string,
            });
            setDialogOpen(true);
            break;
          default:
            // Action not implemented for employees
            break;
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
            // Action not implemented for food
            break;
        }
        break;
      }
      default:
        // Action not implemented for table ${activeTable}
        break;
    }
  };

  const handleAssignEmployeeChange = (e: SelectChangeEvent<string>) => {
    setSelectedEmployeeId(e.target.value);
  };

  const handleStatusChange = (e: SelectChangeEvent<string>) => {
    setSelectedStatus(e.target.value);
  };

  const handleDialogSave = async () => {
    // Allow add dialog and food edit/delete to proceed without selectedReservation
    if (
      !selectedReservation &&
      dialogType !== "add" &&
      !(dialogType === "edit" && activeTable === "food") &&
      !(dialogType === "delete" && activeTable === "food")
    ) {
      return;
    }

    if (dialogType === "assign" && userRole !== "admin") {
      throw new Error("Only admins can assign employees");
    }
    if (
      dialogType === "status" &&
      activeTable === "reservations" &&
      userRole !== "admin" &&
      userRole !== "employee"
    ) {
      throw new Error(
        "Only admins and employees can change reservation status"
      );
    }

    if (dialogType === "status") {
      if (activeTable === "reservations") {
        // Update reservation status for admins and employees
        if (!selectedReservation) {
          throw new Error("No reservation selected for status update");
        }

        await updateReservationStatus({
          id: selectedReservation.id,
          status: selectedStatus,
        }).unwrap();
        handleDialogClose(); // Close modal after successful update
      } else if (activeTable === "employees") {
        // Handle employee status updates if needed
      } else if (activeTable === "orders") {
        // Handle order status updates if needed
      }
    } else if (dialogType === "cancel") {
      if (activeTable === "reservations") {
        // Cancel reservation
        if (!selectedReservation) {
          throw new Error("No reservation selected for cancellation");
        }

        await updateReservationStatus({
          id: selectedReservation.id,
          status: "cancelled",
        }).unwrap();
        handleDialogClose(); // Close modal after successful update
      } else if (activeTable === "orders") {
        // Cancel order
        const orderId = (editFormData as Record<string, unknown>).id as string;
        if (!orderId) {
          throw new Error("No order selected for cancellation");
        }

        await updateReservationStatus({
          id: orderId,
          status: "cancelled",
        }).unwrap();
        handleDialogClose(); // Close modal after successful update
      }
    } else if (dialogType === "assign") {
      if (activeTable === "reservations") {
        // Assign employee to reservation
        if (!selectedReservation) {
          throw new Error("No reservation selected for employee assignment");
        }
        if (!selectedEmployeeId) {
          throw new Error("No employee selected for assignment");
        }

        await assignChefToReservation({
          id: selectedReservation.id,
          chefId: selectedEmployeeId,
        }).unwrap();
        handleDialogClose(); // Close modal after successful update
      } else if (activeTable === "orders") {
        // Assign employee to order
        const orderId = (editFormData as Record<string, unknown>).id as string;
        if (!orderId) {
          throw new Error("No order selected for employee assignment");
        }
        if (!selectedEmployeeId) {
          throw new Error("No employee selected for assignment");
        }

        await assignChefToReservation({
          id: orderId,
          chefId: selectedEmployeeId,
        }).unwrap();
        handleDialogClose(); // Close modal after successful update
      }
    } else if (dialogType === "edit") {
      if (activeTable === "orders") {
        // Orders table - not implemented
      } else if (activeTable === "reservations") {
        // Update reservation for users and employees
        if (!selectedReservation) {
          throw new Error("No reservation selected for update");
        }

        await updateReservation({
          id: selectedReservation.id,
          data: editFormData as Partial<ReservationEntry>,
        }).unwrap();
        handleDialogClose(); // Close modal after successful update
      } else if (activeTable === "employees") {
        // Handle employee updates if needed
      } else if (activeTable === "customers") {
        // Handle customer updates if needed
      } else if (activeTable === "food") {
        // Update food item
        const foodId = (editFormData as Record<string, unknown>).id as string;
        if (!foodId) {
          throw new Error("No food item ID found for update");
        }

        await handleUpdateFood(foodId, editFormData as Partial<FoodEntry>);
        handleDialogClose(); // Close modal after successful update
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
      const foodData = editFormData as Partial<FoodEntry>;

      // Validate required fields
      if (!foodData.name || foodData.name.trim() === "") {
        throw new Error("Name is required");
      }
      if (!foodData.description || foodData.description.trim() === "") {
        throw new Error("Description is required");
      }
      if (
        foodData.price === undefined ||
        foodData.price === null ||
        foodData.price < 0
      ) {
        throw new Error(
          "Price is required and must be greater than or equal to 0"
        );
      }
      if (!foodData.category || foodData.category.trim() === "") {
        throw new Error("Category is required");
      }

      const newFoodData = {
        name: foodData.name.trim(),
        description: foodData.description.trim(),
        price: Number(foodData.price),
        category: foodData.category,
      };

      await handleCreateFood(newFoodData);
      handleDialogClose(); // Close modal after successful update
    } else if (dialogType === "delete" && activeTable === "food") {
      // Delete food item
      const foodId = (editFormData as Record<string, unknown>).id as string;
      if (!foodId) {
        throw new Error("No food item ID found for deletion");
      }

      await handleDeleteFood(foodId);
      handleDialogClose(); // Close modal after successful deletion
    } else if (
      dialogType === "role" &&
      (activeTable === "customers" || activeTable === "employees")
    ) {
      // Change user role (for customers or employees)
      const userId = (editFormData as Record<string, unknown>).id as string;
      if (!userId) {
        throw new Error("No user selected for role change");
      }
      await changeUserRole({
        userId: userId,
        role: (editFormData as { role: string }).role,
      }).unwrap();
      handleDialogClose(); // Close modal after successful update
    }
  };

  return {
    handleActionClick,
    handleAssignEmployeeChange,
    handleStatusChange,
    handleDialogSave,
  };
}
