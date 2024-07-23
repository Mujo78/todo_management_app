import { expect, afterEach, beforeAll, afterAll } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import * as matchers from "@testing-library/jest-dom/matchers";
import { serviceWorker } from "./msw/Worker";
expect.extend(matchers);

afterEach(() => {
  cleanup();
});

beforeAll(() => {
  serviceWorker.listen();
});

afterAll(() => {
  serviceWorker.close();
});

afterEach(() => {
  serviceWorker.resetHandlers();
});
