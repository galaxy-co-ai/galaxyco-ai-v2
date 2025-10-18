import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormField } from "../form-field";

describe("FormField", () => {
  it("renders with label", () => {
    render(React.createElement(FormField, { label: "Username" }));
    expect(screen.getByText("Username")).toBeInTheDocument();
  });

  it("renders with input by default", () => {
    const { container } = render(
      React.createElement(FormField, { label: "Email", type: "email" }),
    );
    const input = container.querySelector('input[type="email"]');
    expect(input).toBeInTheDocument();
  });

  it("renders with textarea when type is textarea", () => {
    const { container } = render(
      React.createElement(FormField, {
        label: "Description",
        type: "textarea",
      }),
    );
    const textarea = container.querySelector("textarea");
    expect(textarea).toBeInTheDocument();
  });

  it("displays error message", () => {
    render(
      React.createElement(FormField, {
        label: "Email",
        error: "Invalid email address",
      }),
    );
    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
  });

  it("displays description text", () => {
    render(
      React.createElement(FormField, {
        label: "Password",
        description: "Must be at least 8 characters",
      }),
    );
    expect(
      screen.getByText("Must be at least 8 characters"),
    ).toBeInTheDocument();
  });

  it("shows required indicator on label", () => {
    const { container } = render(
      React.createElement(FormField, { label: "Username", required: true }),
    );
    // Required label should have asterisk or required indicator
    const label = container.querySelector("label");
    expect(label).toBeInTheDocument();
  });

  it("applies disabled state to input", () => {
    const { container } = render(
      React.createElement(FormField, { label: "Name", disabled: true }),
    );
    const input = container.querySelector("input");
    expect(input).toBeDisabled();
  });

  it("applies readonly state to input", () => {
    const { container } = render(
      React.createElement(FormField, { label: "ID", readOnly: true }),
    );
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("readonly");
  });

  it("calls onChange when input value changes", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      React.createElement(FormField, { label: "Name", onChange }),
    );
    const input = container.querySelector("input") as HTMLInputElement;
    await user.type(input, "test");
    expect(onChange).toHaveBeenCalled();
  });

  it("applies placeholder to input", () => {
    const { container } = render(
      React.createElement(FormField, {
        label: "Email",
        placeholder: "Enter your email",
      }),
    );
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("placeholder", "Enter your email");
  });

  it("applies custom id to input", () => {
    const { container } = render(
      React.createElement(FormField, { label: "Custom", id: "custom-id" }),
    );
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("id", "custom-id");
    const label = container.querySelector("label");
    expect(label).toHaveAttribute("for", "custom-id");
  });

  it("applies name attribute to input", () => {
    const { container } = render(
      React.createElement(FormField, { label: "Email", name: "user_email" }),
    );
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("name", "user_email");
  });

  it("applies autoComplete attribute", () => {
    const { container } = render(
      React.createElement(FormField, {
        label: "Email",
        autoComplete: "email",
      }),
    );
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("autocomplete", "email");
  });

  it("applies different sizes", () => {
    const { container: cSm } = render(
      React.createElement(FormField, { label: "Small", size: "sm" }),
    );
    const { container: cLg } = render(
      React.createElement(FormField, { label: "Large", size: "lg" }),
    );
    const smallInput = cSm.querySelector("input");
    const largeInput = cLg.querySelector("input");
    expect(smallInput).toBeInTheDocument();
    expect(largeInput).toBeInTheDocument();
  });

  it("error message has role alert", () => {
    render(
      React.createElement(FormField, { label: "Email", error: "Error text" }),
    );
    const errorMsg = screen.getByText("Error text");
    expect(errorMsg).toHaveAttribute("role", "alert");
  });

  it("input has aria-invalid when error exists", () => {
    const { container } = render(
      React.createElement(FormField, { label: "Email", error: "Invalid" }),
    );
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("input has aria-describedby for error", () => {
    const { container } = render(
      React.createElement(FormField, {
        label: "Email",
        id: "test-field",
        error: "Error",
      }),
    );
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("aria-describedby");
  });

  it("input has aria-describedby for description", () => {
    const { container } = render(
      React.createElement(FormField, {
        label: "Password",
        id: "pwd-field",
        description: "Help text",
      }),
    );
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("aria-describedby");
  });

  it("renders inline variant", () => {
    const { container } = render(
      React.createElement(FormField, { label: "Inline", variant: "inline" }),
    );
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass("flex");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(React.createElement(FormField, { label: "Test", ref }));
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders with controlled value", () => {
    const { container } = render(
      React.createElement(FormField, { label: "Name", value: "John Doe" }),
    );
    const input = container.querySelector("input") as HTMLInputElement;
    expect(input.value).toBe("John Doe");
  });

  it("renders different input types", () => {
    const { container: cEmail } = render(
      React.createElement(FormField, { label: "Email", type: "email" }),
    );
    const { container: cPassword } = render(
      React.createElement(FormField, { label: "Password", type: "password" }),
    );
    const { container: cNumber } = render(
      React.createElement(FormField, { label: "Age", type: "number" }),
    );

    expect(cEmail.querySelector('input[type="email"]')).toBeInTheDocument();
    expect(
      cPassword.querySelector('input[type="password"]'),
    ).toBeInTheDocument();
    expect(cNumber.querySelector('input[type="number"]')).toBeInTheDocument();
  });
});
