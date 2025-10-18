import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AlertCircle } from "lucide-react";
import { Caption } from "../caption";

describe("Caption", () => {
  it("renders caption text", () => {
    render(React.createElement(Caption, null, "Caption text"));
    expect(screen.getByText("Caption text")).toBeInTheDocument();
  });

  it("renders with different variants", () => {
    const { container: cDefault } = render(
      React.createElement(Caption, { variant: "default" }, "Default"),
    );
    const { container: cMuted } = render(
      React.createElement(Caption, { variant: "muted" }, "Muted"),
    );
    const { container: cSuccess } = render(
      React.createElement(Caption, { variant: "success" }, "Success"),
    );
    const { container: cWarning } = render(
      React.createElement(Caption, { variant: "warning" }, "Warning"),
    );
    const { container: cError } = render(
      React.createElement(Caption, { variant: "error" }, "Error"),
    );

    expect(cDefault.firstChild).toHaveClass("text-foreground");
    expect(cMuted.firstChild).toHaveClass("text-foreground-muted");
    expect(cSuccess.firstChild).toHaveClass("text-success");
    expect(cWarning.firstChild).toHaveClass("text-warning");
    expect(cError.firstChild).toHaveClass("text-destructive");
  });

  it("renders with different sizes", () => {
    const { container: cXs } = render(
      React.createElement(Caption, { size: "xs" }, "Extra Small"),
    );
    const { container: cSm } = render(
      React.createElement(Caption, { size: "sm" }, "Small"),
    );

    expect(cXs.firstChild).toHaveClass("text-xs");
    expect(cSm.firstChild).toHaveClass("text-sm");
  });

  it("renders with icon", () => {
    const { container } = render(
      React.createElement(
        Caption,
        { icon: React.createElement(AlertCircle, { className: "test-icon" }) },
        "With icon",
      ),
    );
    expect(container.querySelector(".test-icon")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      React.createElement(Caption, { className: "custom-caption" }, "Custom"),
    );
    expect(container.firstChild).toHaveClass("custom-caption");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(React.createElement(Caption, { ref }, "Test"));
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("has inline-flex layout", () => {
    const { container } = render(React.createElement(Caption, null, "Text"));
    expect(container.firstChild).toHaveClass("inline-flex");
  });

  it("muted variant has muted color", () => {
    const { container } = render(
      React.createElement(Caption, { variant: "muted" }, "Muted text"),
    );
    expect(container.firstChild).toHaveClass("text-foreground-muted");
  });

  it("error variant has destructive color", () => {
    const { container } = render(
      React.createElement(Caption, { variant: "error" }, "Error text"),
    );
    expect(container.firstChild).toHaveClass("text-destructive");
  });
});
