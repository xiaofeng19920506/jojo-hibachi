import dayjs from "dayjs";

export const getMinDate = () => {
  return dayjs().add(3, "day"); // Get today's date + 3 days
};