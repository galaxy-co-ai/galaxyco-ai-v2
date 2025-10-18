import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Label } from "../label";

describe("Label", () => {
  it("renders with text", () => {
    render(React.createElement(Label, null, "Test Label"));
    expect(screen.getByText("Test Label")).toBeInTheDocument();
  });

  it("renders as a label element", () => {
    render(React.createElement(Label, null, "Label Text"));
    const label = screen.getByText("Label Text");
    expect(label.tagName).toBe("LABEL");
  });

  it("applies default variant classes", () => {
    render(React.createElement(Label, null, "Default"));
    const label = screen.getByText("Default");
    expect(label).toHaveClass("text-foreground");
    expect(label).toHaveClass("text-sm");
  });

  it("renders with muted variant", () => {
    render(React.createElement(Label, { variant: "muted" }, "Muted"));
    const label = screen.getByText("Muted");
    expect(label).toHaveClass("text-foreground-muted");
  });

  it("renders with subtle variant", () => {
    render(React.createElement(Label, { variant: "subtle" }, "Subtle"));
    const label = screen.getByText("Subtle");
    expect(label).toHaveClass("text-foreground-subtle");
  });

  it("renders with different sizes", () => {
    render(React.createElement(Label, { size: "sm" }, "Small"));
    render(React.createElement(Label, { size: "lg" }, "Large"));

    const small = screen.getByText("Small");
    const large = screen.getByText("Large");

    expect(small).toHaveClass("text-xs");
    expect(large).toHaveClass("text-base");
  });

  it("shows asterisk when required is true", () => {
    const { container } = render(
      React.createElement(Label, { required: true }, "Required Field"),
    );
    const label = container.querySelector("label");
    // The asterisk is added via after: pseudo-element
    expect(label).toHaveClass("after:content-['*']");
    expect(label).toHaveClass("after:text-destructive");
  });

  it("does not show asterisk when required is false", () => {
    const { container } = render(
      React.createElement(Label, { required: false }, "Optional Field"),
    );
    const label = container.querySelector("label");
    expect(label).not.toHaveClass("after:content-['*']");
  });

  it("applies htmlFor attribute correctly", () => {
    render(
      React.createElement(Label, { htmlFor: "test-input" }, "Label for input"),
    );
    const label = screen.getByText("Label for input");
    expect(label).toHaveAttribute("for", "test-input");
  });

  it("applies custom className", () => {
    const { container } = render(
      React.createElement(Label, { className: "custom-class" }, "Custom"),
    );
    const label = container.querySelector("label");
    expect(label).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLLabelElement>();
    render(React.createElement(Label, { ref }, "Test"));
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });

  it("renders with multiple props combined", () => {
    const { container } = render(
      React.createElement(
        Label,
        {
          variant: "muted",
          size: "lg",
          required: true,
          htmlFor: "combined-input",
        },
        "Complete Label",
      ),
    );
    const label = container.querySelector("label");
    expect(label).toHaveClass("text-foreground-muted");
    expect(label).toHaveClass("text-base");
    expect(label).toHaveClass("after:content-['*']");
    expect(label).toHaveAttribute("for", "combined-input");
  });

  it("handles disabled peer styling classes", () => {
    const { container } = render(React.createElement(Label, null, "Label"));
    const label = container.querySelector("label");
    expect(label).toHaveClass("peer-disabled:cursor-not-allowed");
    expect(label).toHaveClass("peer-disabled:opacity-70");
  });
});
