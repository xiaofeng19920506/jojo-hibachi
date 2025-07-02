import dayjs from "dayjs";

export const getMinDate = () => {
  return dayjs().add(3, "day");
};
