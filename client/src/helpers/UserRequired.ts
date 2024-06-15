import { redirect } from "react-router-dom";

function UserRequired() {
  const user = localStorage.getItem("user");
  const auth = localStorage.getItem("auth");

  if (!user && !auth) return redirect("/");

  return null;
}

export default UserRequired;
