export function formatPriority(priority: number) {
  if (priority === 0) return "Low";
  else if (priority === 1) return "Medium";
  else return "High";
}

export function formatStatus(status: number) {
  if (status === 0) return "Open";
  else if (status === 1) return "InProgress";
  else return "Completed";
}
