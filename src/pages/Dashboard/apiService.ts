import type { ApiReservationData, ReservationEntry } from "./types";

// API service functions
export const apiService = {
  async fetchData(endpoint: string, token: string) {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}${endpoint}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    return response.json();
  },

  async getAllData(token: string) {
    return this.fetchData("/reservation", token);
  },

  async getUserData(token: string) {
    return this.fetchData("/reservation", token);
  },

  async updateReservation(id: string, data: any, token: string) {
    // Transform the data to match your API format
    const transformedData: any = {};

    if (data.service) transformedData.eventType = data.service;
    if (data.date) {
      const dateObj = new Date(data.date);
      transformedData.reservationDay = dateObj.getDate().toString();
      transformedData.reservationMonth = (dateObj.getMonth() + 1).toString();
      transformedData.reservationYear = dateObj.getFullYear().toString();
    }
    if (data.time) transformedData.time = data.time;
    if (data.status) transformedData.status = data.status;
    if (data.notes) transformedData.notes = data.notes;
    if (data.price !== undefined) transformedData.price = data.price;
    if (data.employeeId) transformedData.assignedChef = data.employeeId;

    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/reservations/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(transformedData),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update reservation: ${response.statusText}`);
    }

    return response.json();
  },

  async deleteReservation(id: string, token: string) {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/reservations/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete reservation: ${response.statusText}`);
    }

    return response.json();
  },

  async getEmployees(token: string) {
    return this.fetchData("/api/v1/employees", token);
  },
};

export const transformApiData = (
  apiData: ApiReservationData[]
): ReservationEntry[] => {
  return apiData.map((item) => ({
    id: item._id,
    customerId: item._id,
    customerName: `${item.firstName} ${item.lastName}`,
    employeeId: item.assignedChef ?? undefined,
    employeeName: item.assignedChef ?? undefined,
    service: item.eventType || "Dining",
    date: `${item.reservationYear}-${item.reservationMonth.padStart(
      2,
      "0"
    )}-${item.reservationDay.padStart(2, "0")}`,
    time: item.time,
    status: item.status,
    price: item.price || 0,
    notes: item.notes,
    phoneNumber: item.phoneNumber,
    address: item.address,
    city: item.city,
    state: item.state,
    zipCode: item.zipCode,
    adult: item.adult,
    kids: item.kids,
    allergies: item.allergies,
    eventType: item.eventType,
    assignedChef: item.assignedChef ?? "unAssigned",
    timeStamp: item.timeStamp,
  }));
};
