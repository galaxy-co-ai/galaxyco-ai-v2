import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusIndicator } from "../status-indicator";

describe("StatusIndicator", () => {
  it("renders status indicator", () => {
    const { container } = render(
      React.createElement(StatusIndicator, { status: "online" }),
    );
    const indicator = container.querySelector('[role="status"]');
    expect(indicator).toBeInTheDocument();
  });

  it("renders with different status variants", () => {
    const { container: cOnline } = render(
      React.createElement(StatusIndicator, { status: "online" }),
    );
    const { container: cOffline } = render(
      React.createElement(StatusIndicator, { status: "offline" }),
    );
    const { container: cBusy } = render(
      React.createElement(StatusIndicator, { status: "busy" }),
    );
    const { container: cAway } = render(
      React.createElement(StatusIndicator, { status: "away" }),
    );
    const { container: cInactive } = render(
      React.createElement(StatusIndicator, { status: "inactive" }),
    );

    expect(cOnline.querySelector(".bg-success")).toBeInTheDocument();
    expect(cOffline.querySelector(".bg-foreground-subtle")).toBeInTheDocument();
    expect(cBusy.querySelector(".bg-destructive")).toBeInTheDocument();
    expect(cAway.querySelector(".bg-warning")).toBeInTheDocument();
    expect(cInactive.querySelector(".bg-foreground-muted")).toBeInTheDocument();
  });

  it("renders with different sizes", () => {
    const { container: cSm } = render(
      React.createElement(StatusIndicator, { status: "online", size: "sm" }),
    );
    const { container: cLg } = render(
      React.createElement(StatusIndicator, { status: "online", size: "lg" }),
    );

    expect(cSm.querySelector(".h-2")).toBeInTheDocument();
    expect(cLg.querySelector(".h-3")).toBeInTheDocument();
  });

  it("shows label when showLabel is true", () => {
    render(
      React.createElement(StatusIndicator, {
        status: "online",
        showLabel: true,
      }),
    );
    expect(screen.getByText("Online")).toBeInTheDocument();
  });

  it("hides label by default", () => {
    render(React.createElement(StatusIndicator, { status: "online" }));
    expect(screen.queryByText("Online")).not.toBeInTheDocument();
  });

  it("uses custom label", () => {
    render(
      React.createElement(StatusIndicator, {
        status: "online",
        showLabel: true,
        label: "Available",
      }),
    );
    expect(screen.getByText("Available")).toBeInTheDocument();
  });

  it("has correct aria-label", () => {
    const { container } = render(
      React.createElement(StatusIndicator, { status: "busy" }),
    );
    const indicator = container.querySelector('[role="status"]');
    expect(indicator).toHaveAttribute("aria-label", "Busy");
  });

  it("applies pulse animation", () => {
    const { container } = render(
      React.createElement(StatusIndicator, { status: "online", pulse: true }),
    );
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("does not pulse by default", () => {
    const { container } = render(
      React.createElement(StatusIndicator, { status: "online" }),
    );
    expect(container.querySelector(".animate-pulse")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      React.createElement(StatusIndicator, {
        status: "online",
        className: "custom-status",
      }),
    );
    expect(container.firstChild).toHaveClass("custom-status");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(React.createElement(StatusIndicator, { status: "online", ref }));
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("status dot has aria-hidden", () => {
    const { container } = render(
      React.createElement(StatusIndicator, { status: "online" }),
    );
    const dot = container.querySelector('[aria-hidden="true"]');
    expect(dot).toBeInTheDocument();
  });

  it("renders with inline-flex layout", () => {
    const { container } = render(
      React.createElement(StatusIndicator, { status: "online" }),
    );
    expect(container.firstChild).toHaveClass("inline-flex");
  });
});
