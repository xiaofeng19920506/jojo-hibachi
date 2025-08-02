// src/services/apiTransforms.ts
import type {
  ApiReservationData,
  ReservationEntry,
} from "../pages/Dashboard/types";

export const transformApiData = (
  apiData: ApiReservationData[]
): ReservationEntry[] => {
  console.log("[transformApiData] Processing reservations:", apiData.length);
  return apiData.map((item) => {
    let employeeId: string | undefined;
    let employeeName: string | undefined;
    if (item.assignedChef) {
      if (typeof item.assignedChef === "object" && item.assignedChef !== null) {
        const chefData = item.assignedChef as any;
        // Handle the new API structure with 'id' and 'fullName'
        employeeId = chefData.id || chefData._id;
        employeeName =
          chefData.fullName ||
          (chefData.firstName && chefData.lastName
            ? `${chefData.firstName} ${chefData.lastName}`.trim()
            : chefData.firstName || chefData.lastName || "Unknown Employee");
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
      address: item.address,
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
    };

    // Debug log for employee name issues
    console.log(`[transformApiData] Reservation ${result.id}:`, {
      assignedChef: item.assignedChef,
      employeeId: result.employeeId,
      employeeName: result.employeeName,
    });

    return result;
  });
};

export const transformCustomerData = (apiData: any[]) => {
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
      name = item.fullName;
    } else if (item.firstName && item.lastName) {
      name = `${item.firstName} ${item.lastName}`.trim();
    } else if (item.firstName) {
      name = item.firstName;
    } else if (item.lastName) {
      name = item.lastName;
    } else if (item.name) {
      name = item.name;
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

export const transformOrderData = (apiData: any[]) => {
  return apiData.map((item) => {
    // Handle customer name
    let customerName = "";
    if (item.customerName) {
      customerName = item.customerName;
    } else if (item.firstName && item.lastName) {
      customerName = `${item.firstName} ${item.lastName}`.trim();
    } else if (item.firstName) {
      customerName = item.firstName;
    } else if (item.lastName) {
      customerName = item.lastName;
    } else {
      customerName = "Unknown Customer";
    }

    // Handle assigned employee
    let assignedEmployee = "";
    if (item.assignedEmployee) {
      assignedEmployee = item.assignedEmployee;
    } else if (item.assignedChef) {
      if (typeof item.assignedChef === "object" && item.assignedChef !== null) {
        const chefData = item.assignedChef as any;
        // Handle the new API structure with 'id' and 'fullName'
        assignedEmployee =
          chefData.fullName ||
          (chefData.firstName && chefData.lastName
            ? `${chefData.firstName} ${chefData.lastName}`.trim()
            : chefData.firstName || chefData.lastName || "Unknown Employee");
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

export const transformEmployeeData = (apiData: any[]) => {
  console.log("[transformEmployeeData] Processing employees:", apiData.length);
  return apiData.map((item) => {
    // Handle different name formats
    let name = "";
    if (item.fullName) {
      name = item.fullName;
    } else if (item.firstName && item.lastName) {
      name = `${item.firstName} ${item.lastName}`.trim();
    } else if (item.firstName) {
      name = item.firstName;
    } else if (item.lastName) {
      name = item.lastName;
    } else if (item.name) {
      name = item.name;
    } else {
      name = "Unknown Employee";
    }

    const result = {
      id: item._id || item.id,
      name,
      email: item.email || "",
      role: item.role || "employee",
      joinDate:
        item.joinDate ||
        item.createdAt ||
        new Date().toISOString().split("T")[0],
      status: item.isActive === false ? "inactive" : "active",
      ordersAssigned: item.ordersAssigned || 0,
    };

    // Debug log for employee name issues
    console.log(`[transformEmployeeData] Employee ${result.id}:`, result.name);

    return result;
  });
};
