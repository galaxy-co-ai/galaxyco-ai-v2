import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressBar } from "../progress-bar";

describe("ProgressBar", () => {
  it("renders with default props", () => {
    const { container } = render(React.createElement(ProgressBar));
    expect(container.querySelector('[role="progressbar"]')).toBeInTheDocument();
  });

  it("renders with value", () => {
    const { container } = render(
      React.createElement(ProgressBar, { value: 50 }),
    );
    const progressbar = container.querySelector('[role="progressbar"]');
    expect(progressbar).toHaveAttribute("aria-valuenow", "50");
  });

  it("renders with different variants", () => {
    const { container: cDefault } = render(
      React.createElement(ProgressBar, { variant: "default" }),
    );
    const { container: cPrimary } = render(
      React.createElement(ProgressBar, { variant: "primary" }),
    );
    const { container: cSuccess } = render(
      React.createElement(ProgressBar, { variant: "success" }),
    );
    const { container: cWarning } = render(
      React.createElement(ProgressBar, { variant: "warning" }),
    );
    const { container: cDestructive } = render(
      React.createElement(ProgressBar, { variant: "destructive" }),
    );

    expect(cDefault.querySelector('[role="progressbar"]')).toHaveClass(
      "bg-muted",
    );
    expect(cPrimary.querySelector('[role="progressbar"]')).toHaveClass(
      "bg-primary/20",
    );
    expect(cSuccess.querySelector('[role="progressbar"]')).toHaveClass(
      "bg-success/20",
    );
    expect(cWarning.querySelector('[role="progressbar"]')).toHaveClass(
      "bg-warning/20",
    );
    expect(cDestructive.querySelector('[role="progressbar"]')).toHaveClass(
      "bg-destructive/20",
    );
  });

  it("renders with different sizes", () => {
    const { container: cSm } = render(
      React.createElement(ProgressBar, { size: "sm" }),
    );
    const { container: cDefault } = render(
      React.createElement(ProgressBar, { size: "default" }),
    );
    const { container: cLg } = render(
      React.createElement(ProgressBar, { size: "lg" }),
    );

    expect(cSm.querySelector('[role="progressbar"]')).toHaveClass("h-1");
    expect(cDefault.querySelector('[role="progressbar"]')).toHaveClass("h-2");
    expect(cLg.querySelector('[role="progressbar"]')).toHaveClass("h-3");
  });

  it("shows percentage label when showLabel is true", () => {
    render(React.createElement(ProgressBar, { value: 75, showLabel: true }));
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("hides label by default", () => {
    render(React.createElement(ProgressBar, { value: 50 }));
    expect(screen.queryByText("50%")).not.toBeInTheDocument();
  });

  it("renders with striped appearance", () => {
    const { container } = render(
      React.createElement(ProgressBar, { striped: true }),
    );
    const progressbar = container.querySelector('[role="progressbar"]');
    const fill = progressbar?.querySelector("div");
    expect(fill).toHaveClass("bg-[length:1rem_1rem]");
  });

  it("renders with animated stripes", () => {
    const { container } = render(
      React.createElement(ProgressBar, { striped: true, animated: true }),
    );
    const progressbar = container.querySelector('[role="progressbar"]');
    const fill = progressbar?.querySelector("div");
    expect(fill).toHaveClass("animate-progress-stripe");
  });

  it("does not animate without striped", () => {
    const { container } = render(
      React.createElement(ProgressBar, { animated: true }),
    );
    const progressbar = container.querySelector('[role="progressbar"]');
    const fill = progressbar?.querySelector("div");
    expect(fill).not.toHaveClass("animate-progress-stripe");
  });

  it("renders indeterminate state", () => {
    const { container } = render(
      React.createElement(ProgressBar, { indeterminate: true }),
    );
    const progressbar = container.querySelector('[role="progressbar"]');
    expect(progressbar).not.toHaveAttribute("aria-valuenow");
  });

  it("indeterminate has loading label", () => {
    const { container } = render(
      React.createElement(ProgressBar, { indeterminate: true }),
    );
    const progressbar = container.querySelector('[role="progressbar"]');
    expect(progressbar).toHaveAttribute("aria-label", "Loading...");
  });

  it("respects max value", () => {
    const { container } = render(
      React.createElement(ProgressBar, { value: 50, max: 200 }),
    );
    const progressbar = container.querySelector('[role="progressbar"]');
    expect(progressbar).toHaveAttribute("aria-valuemax", "200");
  });

  it("calculates percentage correctly", () => {
    render(
      React.createElement(ProgressBar, {
        value: 50,
        max: 200,
        showLabel: true,
      }),
    );
    expect(screen.getByText("25%")).toBeInTheDocument();
  });

  it("caps value at 100%", () => {
    render(
      React.createElement(ProgressBar, {
        value: 150,
        max: 100,
        showLabel: true,
      }),
    );
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("has aria-valuemin of 0", () => {
    const { container } = render(React.createElement(ProgressBar));
    const progressbar = container.querySelector('[role="progressbar"]');
    expect(progressbar).toHaveAttribute("aria-valuemin", "0");
  });

  it("applies custom className", () => {
    const { container } = render(
      React.createElement(ProgressBar, { className: "custom-progress" }),
    );
    expect(container.querySelector('[role="progressbar"]')).toHaveClass(
      "custom-progress",
    );
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(React.createElement(ProgressBar, { ref }));
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("has rounded-full class", () => {
    const { container } = render(React.createElement(ProgressBar));
    expect(container.querySelector('[role="progressbar"]')).toHaveClass(
      "rounded-full",
    );
  });

  it("does not show label for indeterminate", () => {
    render(
      React.createElement(ProgressBar, {
        indeterminate: true,
        showLabel: true,
      }),
    );
    expect(screen.queryByText("%")).not.toBeInTheDocument();
  });
});
