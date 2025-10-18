import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../button";

// NOTE: Using React.createElement due to JSX transformation issue
// Simple JSX works but imported component JSX fails with "React is not defined"

describe("Button", () => {
  it("renders with text", () => {
    render(React.createElement(Button, null, "Click me"));
    expect(
      screen.getByRole("button", { name: /click me/i }),
    ).toBeInTheDocument();
  });

  it("handles click events", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(React.createElement(Button, { onClick: handleClick }, "Click me"));
    const button = screen.getByRole("button", { name: /click me/i });

    await user.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("can be disabled", () => {
    render(React.createElement(Button, { disabled: true }, "Disabled"));
    const button = screen.getByRole("button", { name: /disabled/i });
    expect(button).toBeDisabled();
  });

  it("applies variant classes correctly", () => {
    const { container } = render(
      React.createElement(Button, { variant: "destructive" }, "Delete"),
    );
    const button = container.querySelector("button");
    expect(button).toHaveClass("bg-destructive");
  });

  it("applies size classes correctly", () => {
    const { container } = render(
      React.createElement(Button, { size: "sm" }, "Small"),
    );
    const button = container.querySelector("button");
    expect(button).toHaveClass("h-8");
  });
});
