export interface ReservationFormValues {
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  date: string;
  time: string;
  guests: number;
  allergies?: string;
  notes?: string;
  eventType?: string;
}
