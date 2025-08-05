export const getAvailableActions = (
  item: any,
  userRole: string,
  activeTable: string
): string[] => {
  if (!item) return [];

  switch (activeTable) {
    case "customers":
      return userRole === "admin"
        ? ["View Details", "Change Role"]
        : ["View Details"];
    case "employees":
      return userRole === "admin"
        ? [
            "Change Role",
            "Update Status",
            "View Profile",
            "Edit Employee",
            "Reset Password",
          ]
        : ["View Profile"];
    case "orders":
      return userRole === "admin"
        ? [
            "Assign Employee",
            "Update Status",
            "View Details",
            "Edit Order",
            "Cancel Order",
          ]
        : ["View Details"];
    case "reservations":
      if (userRole === "admin") {
        return [
          "Edit",
          "Cancel",
          "Assign Employee",
          "Update Status",
          "Selection Menu",
        ];
      } else if (userRole === "employee") {
        return ["Edit", "Cancel", "Update Status", "Selection Menu"];
      }
      return ["Edit", "Cancel", "Selection Menu"];
    case "food":
      return userRole === "admin" ? ["Update", "Delete"] : [];
    default:
      return [];
  }
};

export function getGreeting(user: any) {
  if (!user) return "Welcome";
  const name = user.firstName || user.lastName || user.email || "User";
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning, ${name}`;
  if (hour < 18) return `Good afternoon, ${name}`;
  return `Good evening, ${name}`;
}
