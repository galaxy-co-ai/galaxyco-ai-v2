import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Spinner } from "../spinner";

describe("Spinner", () => {
  it("renders with default props", () => {
    const { container } = render(React.createElement(Spinner));
    const spinner = container.firstChild as HTMLElement;
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute("role", "status");
  });

  it("renders with default label", () => {
    const { container } = render(React.createElement(Spinner));
    const spinner = container.firstChild as HTMLElement;
    expect(spinner).toHaveAttribute("aria-label", "Loading...");
  });

  it("renders with custom label", () => {
    const { container } = render(
      React.createElement(Spinner, { label: "Fetching data..." }),
    );
    const spinner = container.firstChild as HTMLElement;
    expect(spinner).toHaveAttribute("aria-label", "Fetching data...");
  });

  it("renders with different variants", () => {
    const { container: containerDefault } = render(
      React.createElement(Spinner, { variant: "default" }),
    );
    const { container: containerPrimary } = render(
      React.createElement(Spinner, { variant: "primary" }),
    );
    const { container: containerSuccess } = render(
      React.createElement(Spinner, { variant: "success" }),
    );
    const { container: containerWarning } = render(
      React.createElement(Spinner, { variant: "warning" }),
    );
    const { container: containerDestructive } = render(
      React.createElement(Spinner, { variant: "destructive" }),
    );

    expect(containerDefault.firstChild).toHaveClass("border-border");
    expect(containerPrimary.firstChild).toHaveClass("border-primary/20");
    expect(containerSuccess.firstChild).toHaveClass("border-success/20");
    expect(containerWarning.firstChild).toHaveClass("border-warning/20");
    expect(containerDestructive.firstChild).toHaveClass(
      "border-destructive/20",
    );
  });

  it("renders with different sizes", () => {
    const { container: containerXs } = render(
      React.createElement(Spinner, { size: "xs" }),
    );
    const { container: containerSm } = render(
      React.createElement(Spinner, { size: "sm" }),
    );
    const { container: containerLg } = render(
      React.createElement(Spinner, { size: "lg" }),
    );
    const { container: containerXl } = render(
      React.createElement(Spinner, { size: "xl" }),
    );

    expect(containerXs.firstChild).toHaveClass("h-3");
    expect(containerSm.firstChild).toHaveClass("h-4");
    expect(containerLg.firstChild).toHaveClass("h-6");
    expect(containerXl.firstChild).toHaveClass("h-8");
  });

  it("applies animate-spin class", () => {
    const { container } = render(React.createElement(Spinner));
    const spinner = container.firstChild as HTMLElement;
    expect(spinner).toHaveClass("animate-spin");
  });

  it("applies custom className", () => {
    const { container } = render(
      React.createElement(Spinner, { className: "custom-spinner" }),
    );
    const spinner = container.firstChild as HTMLElement;
    expect(spinner).toHaveClass("custom-spinner");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(React.createElement(Spinner, { ref }));
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders screen reader text", () => {
    const { container } = render(
      React.createElement(Spinner, { label: "Loading data" }),
    );
    const srText = container.querySelector(".sr-only");
    expect(srText).toBeInTheDocument();
    expect(srText?.textContent).toBe("Loading data");
  });
});
