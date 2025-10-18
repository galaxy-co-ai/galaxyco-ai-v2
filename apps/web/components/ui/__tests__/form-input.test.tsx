import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormInput } from "../form-input";

describe("FormInput", () => {
  it("renders with label", () => {
    render(React.createElement(FormInput, { label: "Email" }));
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("renders without label", () => {
    const { container } = render(React.createElement(FormInput));
    expect(container.querySelector("label")).not.toBeInTheDocument();
  });

  it("displays error message", () => {
    render(
      React.createElement(FormInput, {
        label: "Email",
        error: "Invalid email",
      }),
    );
    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  });

  it("displays helper text", () => {
    render(
      React.createElement(FormInput, {
        label: "Email",
        helperText: "Enter your email address",
      }),
    );
    expect(screen.getByText("Enter your email address")).toBeInTheDocument();
  });

  it("shows required indicator", () => {
    render(React.createElement(FormInput, { label: "Name", required: true }));
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("renders left icon", () => {
    const icon = React.createElement(
      "div",
      { className: "left-test-icon" },
      "Icon",
    );
    const { container } = render(
      React.createElement(FormInput, { leftIcon: icon }),
    );
    expect(container.querySelector(".left-test-icon")).toBeInTheDocument();
  });

  it("renders right icon", () => {
    const icon = React.createElement(
      "div",
      { className: "right-test-icon" },
      "Icon",
    );
    const { container } = render(
      React.createElement(FormInput, { rightIcon: icon }),
    );
    expect(container.querySelector(".right-test-icon")).toBeInTheDocument();
  });

  it("input has correct padding with left icon", () => {
    const icon = React.createElement("div", null, "Icon");
    const { container } = render(
      React.createElement(FormInput, { leftIcon: icon }),
    );
    const input = container.querySelector("input");
    expect(input).toHaveClass("pl-10");
  });

  it("input has correct padding with right icon", () => {
    const icon = React.createElement("div", null, "Icon");
    const { container } = render(
      React.createElement(FormInput, { rightIcon: icon }),
    );
    const input = container.querySelector("input");
    expect(input).toHaveClass("pr-10");
  });

  it("applies error styling to input", () => {
    const { container } = render(
      React.createElement(FormInput, { error: "Error" }),
    );
    const input = container.querySelector("input");
    expect(input).toHaveClass("border-destructive");
  });

  it("error message has role alert", () => {
    render(React.createElement(FormInput, { error: "Error message" }));
    const error = screen.getByText("Error message");
    expect(error).toHaveAttribute("role", "alert");
  });

  it("input has aria-invalid when error exists", () => {
    const { container } = render(
      React.createElement(FormInput, { error: "Error" }),
    );
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("input has aria-describedby for error", () => {
    const { container } = render(
      React.createElement(FormInput, { error: "Error", id: "test-input" }),
    );
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("aria-describedby", "test-input-error");
  });

  it("input has aria-describedby for helper", () => {
    const { container } = render(
      React.createElement(FormInput, { helperText: "Help", id: "test-input" }),
    );
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("aria-describedby", "test-input-helper");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(React.createElement(FormInput, { ref }));
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("calls onChange when typing", async () => {
    const user = userEvent.setup();
    const { container } = render(React.createElement(FormInput));
    const input = container.querySelector("input") as HTMLInputElement;
    await user.type(input, "test");
    expect(input.value).toBe("test");
  });

  it("helper text supports both helper and helperText props", () => {
    render(React.createElement(FormInput, { helper: "Old prop" }));
    expect(screen.getByText("Old prop")).toBeInTheDocument();
  });

  it("helperText takes precedence over helper", () => {
    render(
      React.createElement(FormInput, { helper: "Old", helperText: "New" }),
    );
    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.queryByText("Old")).not.toBeInTheDocument();
  });
});
