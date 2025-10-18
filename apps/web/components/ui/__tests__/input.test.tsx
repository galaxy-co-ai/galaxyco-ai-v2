import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "../input";

describe("Input", () => {
  it("renders with default props", () => {
    render(React.createElement(Input, { placeholder: "Enter text" }));
    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("h-10"); // default size
  });

  it("renders with different sizes", () => {
    const { container: containerSm } = render(
      React.createElement(Input, { size: "sm", placeholder: "sm-input" }),
    );
    const { container: containerLg } = render(
      React.createElement(Input, { size: "lg", placeholder: "lg-input" }),
    );

    const inputSm = containerSm.querySelector("input");
    const inputLg = containerLg.querySelector("input");

    expect(inputSm).toHaveClass("h-8");
    expect(inputLg).toHaveClass("h-12");
  });

  it("renders with destructive variant", () => {
    const { container } = render(
      React.createElement(Input, { variant: "destructive" }),
    );
    const input = container.querySelector("input");
    expect(input).toHaveClass("border-destructive");
  });

  it("renders with success variant", () => {
    const { container } = render(
      React.createElement(Input, { variant: "success" }),
    );
    const input = container.querySelector("input");
    expect(input).toHaveClass("border-success");
  });

  it("applies destructive variant when error prop is provided", () => {
    const { container } = render(
      React.createElement(Input, { error: "This field is required" }),
    );
    const input = container.querySelector("input");
    expect(input).toHaveClass("border-destructive");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("handles user input", async () => {
    const user = userEvent.setup();
    render(
      React.createElement(Input, {
        placeholder: "Type here",
      }),
    );

    const input = screen.getByPlaceholderText("Type here") as HTMLInputElement;
    await user.type(input, "Hello World");

    expect(input.value).toBe("Hello World");
  });

  it("can be disabled", () => {
    render(React.createElement(Input, { disabled: true }));
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
  });

  it("can be read-only", () => {
    render(
      React.createElement(Input, { readOnly: true, value: "Read only text" }),
    );
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input).toHaveAttribute("readonly");
    expect(input.value).toBe("Read only text");
  });

  it("accepts different input types", () => {
    const { container: emailContainer } = render(
      React.createElement(Input, { type: "email" }),
    );
    const { container: passwordContainer } = render(
      React.createElement(Input, { type: "password" }),
    );

    const emailInput = emailContainer.querySelector("input");
    const passwordInput = passwordContainer.querySelector("input");

    expect(emailInput).toHaveAttribute("type", "email");
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(React.createElement(Input, { ref }));
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("applies custom className", () => {
    const { container } = render(
      React.createElement(Input, { className: "custom-class" }),
    );
    const input = container.querySelector("input");
    expect(input).toHaveClass("custom-class");
  });

  it("sets aria-describedby when error is provided with id", () => {
    const { container } = render(
      React.createElement(Input, { id: "test-input", error: "Error message" }),
    );
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("aria-describedby", "test-input-error");
  });
});
