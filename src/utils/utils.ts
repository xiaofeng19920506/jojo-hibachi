import dayjs from "dayjs";
import type { User } from "../features/types";

export const getMinDate = () => {
  return dayjs().add(3, "day");
};

export const verifyToken = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    return {} as User;
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/auth/verifyToken`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();
    if (response.ok && data.status === "success") {
      return data.user as User;
    } else {
      return {} as User;
    }
  } catch (error) {
    return {} as User;
  }
};
