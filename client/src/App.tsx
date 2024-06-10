import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import AppLayout from "./components/Layout/AppLayout";
import HomeLayout from "./components/Layout/HomeLayout";
import HomePage from "./pages/HomePage";
import VerifyEmail from "./pages/VerifyEmail";

const routes: RouteObject = {
  path: "/",
  element: <AppLayout />,
  children: [
    {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/",
      element: <HomeLayout />,
      children: [
        {
          path: "/home",
          element: <HomePage />,
        },
      ],
    },
    {
      path: "/verify-email/:token",
      element: <VerifyEmail />,
    },
  ],
};

const router = createBrowserRouter([routes]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
