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
import HomePage from "../../pages/HomePage";
import UserRequired from "../UserRequired";

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
          </Route>

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/password-reset/:token" element={<ResetPassword />} />
        </Routes>
      </QueryClientProvider>
    </MemoryRouter>
  );
};
