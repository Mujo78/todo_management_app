import { describe, expect, it } from "vitest";
import { formatPriority, formatStatus } from "./taskUtils";

describe("TaskUtils Formating Priority Fn", () => {
  it.each([
    ["success", 0],
    ["warning", 1],
    ["error", 12],
    ["error", -1],
  ])("Should return string: %s from number %i", (expected, input) => {
    const status = formatPriority(input);
    expect(status).toBe(expected);
  });
});

describe("TaskUtils Formating Status Fn", () => {
  it.each([
    ["Open", 0],
    ["Completed", 1],
    ["Failed", 12],
    ["Failed", -1],
  ])("Should return string: %s from number %i", (expected, input) => {
    const status = formatStatus(input);
    expect(status).toBe(expected);
  });
});
