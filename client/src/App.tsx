import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/LandingPage";

const routes = {
  element: <LandingPage />,
  path: "/",
  children: [],
};

const router = createBrowserRouter([routes]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
