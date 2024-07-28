/* eslint-disable react-refresh/only-export-components */
import { lazy } from "react";
import { RouteObject } from "react-router-dom";

const Home = lazy(() => import("../pages/HomePage/HomePage"));
const ProfileLayout = lazy(
  () => import("../components/Layout/ProfileLayout/ProfileLayout")
);
const Profile = lazy(() => import("../pages/User/Profile/Profile"));
const EditProfile = lazy(() => import("../pages/User/EditProfile/EditProfile"));
const ChangePassword = lazy(
  () => import("../pages/User/ChangePassword/ChangePassword")
);

const AddNewTask = lazy(() => import("../pages/Task/AddNewTask"));
const EditTask = lazy(() => import("../pages/Task/EditTask"));

const userRoutes: RouteObject[] = [
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/profile",
    element: <ProfileLayout />,
    children: [
      {
        path: "",
        element: <Profile />,
      },
      {
        path: "edit",
        element: <EditProfile />,
      },
      {
        path: "change-password",
        element: <ChangePassword />,
      },
    ],
  },
  {
    path: "/add-task",
    element: <AddNewTask />,
  },
  {
    path: "/edit-task/:taskId",
    element: <EditTask />,
  },
];

export default userRoutes;
