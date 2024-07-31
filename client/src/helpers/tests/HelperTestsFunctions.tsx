import { QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import queryClient from "../../queryClient";
import LandingPage from "../../pages/LandingPage/LandingPage";
import LoginForm from "../../components/Landing/LoginForm/LoginForm";
import SignupForm from "../../components/Landing/SignupForm/SignupForm";
import ForgotPassword from "../../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../../pages/ResetPassword/ResetPassword";
import HomeLayout from "../../components/Layout/HomeLayout";
import HomePage from "../../pages/HomePage/HomePage";
import UserRequired from "../UserRequired";
import VerifyEmail from "../../pages/VerifyEmail/VerifyEmail";
import ProfileLayout from "../../components/Layout/ProfileLayout/ProfileLayout";
import Profile from "../../pages/User/Profile/Profile";
import EditProfile from "../../pages/User/EditProfile/EditProfile";
import ChangePassword from "../../pages/User/ChangePassword/ChangePassword";
import ErrorPage from "../../pages/ErrorPage/ErrorPage";
import AddNewTask from "../../pages/Task/AddNewTask/AddNewTask";
import EditTask from "../../pages/Task/EditTask/EditTask";

export const renderWithRouter = (initialEntries: string[]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={<LandingPage />}>
            <Route path="" element={<LoginForm />} />
            <Route path="signup" element={<SignupForm />} />
          </Route>

          <Route path="/" element={<HomeLayout />} loader={UserRequired}>
            <Route path="home" element={<HomePage />} />
            <Route path="/profile" element={<ProfileLayout />}>
              <Route path="" element={<Profile />} />
              <Route path="edit" element={<EditProfile />} />
              <Route path="change-password" element={<ChangePassword />} />
            </Route>

            <Route path="/add-task" element={<AddNewTask />} />
            <Route path="/edit-task/:taskId" element={<EditTask />} />
          </Route>

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/password-reset/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </QueryClientProvider>
    </MemoryRouter>
  );
};
