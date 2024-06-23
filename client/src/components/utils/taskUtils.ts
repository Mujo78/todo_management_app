export function formatPriority(priority: number) {
  if (priority === 0) return "success";
  else if (priority === 1) return "warning";
  else return "error";
}

export function formatStatus(status: number) {
  if (status === 0) return "Open";
  else if (status === 1) return "Completed";
  else return "Failed";
}
