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
        const chefData = item.assignedChef as any;
        employeeId = chefData._id;
        employeeName =
          chefData.fullName || `${chefData.firstName} ${chefData.lastName}`;
      } else {
        employeeId = item.assignedChef as string;
        employeeName = item.assignedChef as string;
      }
    }
    return {
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
      assignedChef: employeeId ?? "unAssigned",
      timeStamp: item.timeStamp,
    };
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
    return {
      id: item._id || item.id,
      name: `${item.firstName || item.name} ${item.lastName || ""}`,
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
  return apiData.map((item) => ({
    id: item._id || item.id,
    customerName:
      item.customerName || `${item.firstName || ""} ${item.lastName || ""}`,
    service: item.service || item.eventType || "Dining",
    date: item.date || item.createdAt || new Date().toISOString().split("T")[0],
    status: item.status || "pending",
    assignedEmployee:
      item.assignedEmployee || item.assignedChef || "Unassigned",
    price: item.price || 0,
  }));
};

export const transformEmployeeData = (apiData: any[]) => {
  return apiData.map((item) => ({
    id: item._id || item.id,
    name: `${item.firstName || item.name} ${item.lastName || ""}`,
    email: item.email || "",
    role: item.role || "employee",
    joinDate:
      item.joinDate || item.createdAt || new Date().toISOString().split("T")[0],
    status: item.isActive === false ? "inactive" : "active",
    ordersAssigned: item.ordersAssigned || 0,
  }));
};
