export interface customerInfos {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  state: string;
  city: string;
  zipCode: string;
  date: string;
  time: string;
  allergies: string;
  adult: number;
  kids: number;
  eventType: string;
  notes: string;
  reservationDay: string;
  reservationMonth: string;
  reservationYear: string;
  reservationDate?: {
    day: string;
    month: string;
    year: string;
  };
  reservationDateString?: string;
  transportationFee: number;
  price: number;
}

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  id: string;
  role: "user" | "employee" | "admin";
}
