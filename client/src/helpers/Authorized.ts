import { redirect } from "react-router-dom";

function Authorized() {
  const user = localStorage.getItem("user");

  if (user) return redirect("/home");

  return null;
}

export default Authorized;
