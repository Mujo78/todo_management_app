import { render, screen } from "@testing-library/react";
import LandingPage from "./LandingPage";
import { BrowserRouter } from "react-router-dom";

test("info component on landing page displayed", () => {
  render(
    <BrowserRouter>
      <LandingPage />
    </BrowserRouter>
  );

  const appName = screen.getByText("Welcome to TaskMaster");
  expect(appName).toBeInTheDocument();
});
