import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage/LandingPage";
import AppLayout from "./components/Layout/AppLayout";
import HomeLayout from "./components/Layout/HomeLayout";

const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const ForgotPassword = lazy(
  () => import("./pages/ForgotPassword/ForgotPassword")
);
const ResetPassword = lazy(() => import("./pages/ResetPassword/ResetPassword"));

import UserRequired from "./helpers/UserRequired";
import Authorized from "./helpers/Authorized";
import userRoutes from "./routes/userRoutes";
import ErrorPage from "./pages/ErrorPage";
import SuspenseFallback from "./components/UI/SuspenseFallback";
import SignupForm from "./components/Landing/SignupForm/SignupForm";
import LoginForm from "./components/Landing/LoginForm/LoginForm";

const routes: RouteObject = {
  path: "/",
  element: <AppLayout />,
  children: [
    {
      path: "/",
      element: <LandingPage />,
      loader: Authorized,
      children: [
        {
          path: "",
          element: <LoginForm />,
        },
        {
          path: "signup",
          element: <SignupForm />,
        },
      ],
    },
    {
      path: "/",
      element: <HomeLayout />,
      loader: UserRequired,
      children: userRoutes,
    },
    {
      path: "/forgot-password",
      element: (
        <Suspense fallback={<SuspenseFallback />}>
          <ForgotPassword />
        </Suspense>
      ),
    },
    {
      path: "/verify-email/:token",
      element: (
        <Suspense fallback={<SuspenseFallback />}>
          <VerifyEmail />
        </Suspense>
      ),
    },
    {
      path: "/password-reset/:token",
      element: (
        <Suspense fallback={<SuspenseFallback />}>
          <ResetPassword />
        </Suspense>
      ),
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ],
};

const router = createBrowserRouter([routes]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
