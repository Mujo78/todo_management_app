import { redirect } from "react-router-dom";

function Authorized() {
  const user = localStorage.getItem("user");
  const auth = localStorage.getItem("auth");

  if (user && auth) return redirect("/home");

  return null;
}

export default Authorized;
