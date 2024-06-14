import { redirect } from "react-router-dom";

function UserRequired() {
  const user = localStorage.getItem("user");

  if (!user) return redirect("/");

  return null;
}

export default UserRequired;
