import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Button } from "../components/ui/button";

describe("Button Render Test", () => {
  it("imports Button without error", () => {
    expect(Button).toBeDefined();
  });

  it("renders Button component", () => {
    const { container } = render(React.createElement(Button, null, "Test"));
    expect(container.querySelector("button")).toBeTruthy();
  });
});
