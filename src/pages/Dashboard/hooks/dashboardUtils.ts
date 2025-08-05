export function getAvailableActions(userRole: string, activeTable: string) {
  const actions: string[] = [];
  switch (userRole) {
    case "user":
      if (activeTable === "reservations")
        actions.push("Edit", "Cancel", "Select Menu");
      break;
    case "employee":
      if (activeTable === "reservations")
        actions.push("Edit", "Update Status", "Select Menu");
      break;
    case "admin":
      if (activeTable === "reservations") {
        actions.push("Edit", "Assign Employee", "Update Status");
      } else if (activeTable === "employees") {
        actions.push("Update Status", "Change Role");
      } else if (activeTable === "customers") {
        actions.push("Change Role");
      }
      break;
  }
  return actions;
}

export function getGreeting(user: any) {
  if (!user) return "Welcome";
  const name = user.firstName || user.lastName || user.email || "User";
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning, ${name}`;
  if (hour < 18) return `Good afternoon, ${name}`;
  return `Good evening, ${name}`;
}
