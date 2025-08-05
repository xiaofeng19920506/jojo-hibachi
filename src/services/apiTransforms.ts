// src/services/apiTransforms.ts
import type {
  ApiReservationData,
  ReservationEntry,
} from "../pages/Dashboard/types";

export const transformApiData = (
  apiData: ApiReservationData[]
): ReservationEntry[] => {
  return apiData.map((item) => {
    let employeeId: string | undefined;
    let employeeName: string | undefined;
    if (item.assignedChef) {
      if (typeof item.assignedChef === "object" && item.assignedChef !== null) {
        const chefData = item.assignedChef as Record<string, unknown>;
        // Handle the new API structure with 'id' and 'fullName'
        employeeId = (chefData.id as string) || (chefData._id as string);
        employeeName =
          (chefData.fullName as string) ||
          (chefData.firstName && chefData.lastName
            ? `${chefData.firstName as string} ${
                chefData.lastName as string
              }`.trim()
            : (chefData.firstName as string) ||
              (chefData.lastName as string) ||
              "");
      } else {
        // If assignedChef is a string, it's likely just the ID
        // We should not use it as the name
        employeeId = item.assignedChef as string;
        employeeName = "Unassigned"; // Better fallback name
      }
    }
    const result = {
      id: item._id,
      customerId: item._id,
      customerName: `${item.firstName} ${item.lastName}`,
      employeeId,
      employeeName,
      service: item.eventType || "Dining",
      date: item.reservationDate
        ? `${item.reservationDate.year}-${item.reservationDate.month.padStart(
            2,
            "0"
          )}-${item.reservationDate.day.padStart(2, "0")}`
        : "",
      time: item.time,
      status: item.status,
      price: item.price || 0,
      notes: item.notes,
      phoneNumber: item.phoneNumber,
      address:
        (item as any).fullAddress ||
        `${item.address}, ${item.city}, ${item.state} ${item.zipCode}`
          .replace(/^,\s*/, "")
          .replace(/,\s*,/g, ","),
      city: item.city,
      state: item.state,
      zipCode: item.zipCode,
      email: item.email,
      adult: item.adult,
      kids: item.kids,
      allergies: item.allergies,
      eventType: item.eventType,
      assignedChef: employeeId ?? "Unassigned",
      timeStamp: item.timeStamp,
      foodOrder: item.foodOrder || [],
    };

    return result;
  });
};

export const transformCustomerData = (apiData: Record<string, unknown>[]) => {
  return apiData.map((item) => {
    const addressParts = [
      item.address,
      item.city,
      item.state,
      item.zipCode,
    ].filter(Boolean);

    // Handle different name formats
    let name = "";
    if (item.fullName) {
      name = item.fullName as string;
    } else if (item.firstName && item.lastName) {
      name = `${item.firstName as string} ${item.lastName as string}`.trim();
    } else if (item.firstName) {
      name = item.firstName as string;
    } else if (item.lastName) {
      name = item.lastName as string;
    } else if (item.name) {
      name = item.name as string;
    } else {
      name = "Unknown Customer";
    }

    return {
      id: item._id || item.id,
      name,
      date:
        item.createdAt || item.date || new Date().toISOString().split("T")[0],
      address: addressParts.join(", ") || "N/A",
      price: item.totalSpent || item.price || 0,
      email: item.email || "",
      phone: item.phone || item.phoneNumber || "",
    };
  });
};

export const transformOrderData = (apiData: Record<string, unknown>[]) => {
  return apiData.map((item) => {
    // Handle customer name
    let customerName = "";
    if (item.customerName) {
      customerName = item.customerName as string;
    } else if (item.firstName && item.lastName) {
      customerName = `${item.firstName as string} ${
        item.lastName as string
      }`.trim();
    } else if (item.firstName) {
      customerName = item.firstName as string;
    } else if (item.lastName) {
      customerName = item.lastName as string;
    } else {
      customerName = "Unknown Customer";
    }

    // Handle assigned employee
    let assignedEmployee = "";
    if (item.assignedEmployee) {
      assignedEmployee = item.assignedEmployee as string;
    } else if (item.assignedChef) {
      if (typeof item.assignedChef === "object" && item.assignedChef !== null) {
        const chefData = item.assignedChef as Record<string, unknown>;
        // Handle the new API structure with 'id' and 'fullName'
        assignedEmployee =
          (chefData.fullName as string) ||
          (chefData.firstName && chefData.lastName
            ? `${chefData.firstName as string} ${
                chefData.lastName as string
              }`.trim()
            : (chefData.firstName as string) ||
              (chefData.lastName as string) ||
              "");
      } else {
        assignedEmployee = "Unassigned";
      }
    } else {
      assignedEmployee = "Unassigned";
    }

    return {
      id: item._id || item.id,
      customerName,
      service: item.service || item.eventType || "Dining",
      date:
        item.date || item.createdAt || new Date().toISOString().split("T")[0],
      status: item.status || "pending",
      assignedEmployee,
      price: item.price || 0,
    };
  });
};

export const transformEmployeeData = (apiData: Record<string, unknown>[]) => {
  return apiData.map((item) => {
    // Handle different name formats
    let name = "";
    if (item.fullName) {
      name = item.fullName as string;
    } else if (item.firstName && item.lastName) {
      name = `${item.firstName as string} ${item.lastName as string}`.trim();
    } else if (item.firstName) {
      name = item.firstName as string;
    } else if (item.lastName) {
      name = item.lastName as string;
    } else if (item.name) {
      name = item.name as string;
    } else {
      name = "";
    }

    // Handle full address
    const addressParts = [
      item.address,
      item.city,
      item.state,
      item.zipCode,
    ].filter(Boolean);
    const fullAddress = addressParts.join(", ") || "";

    const result = {
      id: item._id || item.id,
      name,
      email: item.email || "",
      phone: item.phone || "",
      address: fullAddress,
      role: item.role || "employee",
      joinDate:
        item.joinDate ||
        item.createdAt ||
        new Date().toISOString().split("T")[0],
      status: item.isActive === false ? "inactive" : "active",
      ordersAssigned: item.ordersAssigned || 0,
    };

    return result;
  });
};
