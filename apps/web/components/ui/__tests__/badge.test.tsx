import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Badge } from "../badge";

describe("Badge", () => {
  it("renders with text", () => {
    render(React.createElement(Badge, null, "Test Badge"));
    expect(screen.getByText("Test Badge")).toBeInTheDocument();
  });

  it("renders with default variant", () => {
    const { container } = render(React.createElement(Badge, null, "Default"));
    const badge = container.querySelector("div");
    expect(badge).toHaveClass("bg-background-subtle");
    expect(badge).toHaveClass("text-foreground");
  });

  it("renders with primary variant", () => {
    const { container } = render(
      React.createElement(Badge, { variant: "primary" }, "Primary"),
    );
    const badge = container.querySelector("div");
    expect(badge).toHaveClass("bg-primary/10");
    expect(badge).toHaveClass("text-primary");
  });

  it("renders with success variant", () => {
    const { container } = render(
      React.createElement(Badge, { variant: "success" }, "Success"),
    );
    const badge = container.querySelector("div");
    expect(badge).toHaveClass("bg-success/10");
    expect(badge).toHaveClass("text-success");
  });

  it("renders with destructive variant", () => {
    const { container } = render(
      React.createElement(Badge, { variant: "destructive" }, "Error"),
    );
    const badge = container.querySelector("div");
    expect(badge).toHaveClass("bg-destructive/10");
    expect(badge).toHaveClass("text-destructive");
  });

  it("renders with solid variants", () => {
    const { container } = render(
      React.createElement(Badge, { variant: "primary-solid" }, "Solid"),
    );
    const badge = container.querySelector("div");
    expect(badge).toHaveClass("bg-primary");
    expect(badge).toHaveClass("text-primary-foreground");
    expect(badge).toHaveClass("shadow-sm");
  });

  it("renders with different sizes", () => {
    const { container: containerSm } = render(
      React.createElement(Badge, { size: "sm" }, "Small"),
    );
    const { container: containerLg } = render(
      React.createElement(Badge, { size: "lg" }, "Large"),
    );

    expect(containerSm.querySelector("div")).toHaveClass("px-2");
    expect(containerSm.querySelector("div")).toHaveClass("py-0.5");
    expect(containerLg.querySelector("div")).toHaveClass("px-3");
    expect(containerLg.querySelector("div")).toHaveClass("py-1.5");
  });

  it("renders with icon", () => {
    const icon = React.createElement("span", { "data-testid": "icon" }, "★");
    render(React.createElement(Badge, { icon }, "With Icon"));

    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByText("With Icon")).toBeInTheDocument();
  });

  it("renders as removable with close button", () => {
    const onRemove = vi.fn();
    render(
      React.createElement(
        Badge,
        { removable: true, onRemove },
        "Removable Badge",
      ),
    );

    const removeButton = screen.getByLabelText("Remove");
    expect(removeButton).toBeInTheDocument();
  });

  it("calls onRemove when close button is clicked", async () => {
    const onRemove = vi.fn();
    const user = userEvent.setup();

    render(
      React.createElement(
        Badge,
        { removable: true, onRemove },
        "Removable Badge",
      ),
    );

    const removeButton = screen.getByLabelText("Remove");
    await user.click(removeButton);

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it("does not render close button when removable is false", () => {
    render(React.createElement(Badge, null, "Not Removable"));
    expect(screen.queryByLabelText("Remove")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      React.createElement(Badge, { className: "custom-class" }, "Custom"),
    );
    expect(container.querySelector("div")).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(React.createElement(Badge, { ref }, "Test"));
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders with multiple props combined", () => {
    const icon = React.createElement("span", null, "★");
    const onRemove = vi.fn();
    const { container } = render(
      React.createElement(
        Badge,
        { variant: "success", size: "lg", icon, removable: true, onRemove },
        "Complete",
      ),
    );

    const badge = container.querySelector("div");
    expect(badge).toHaveClass("bg-success/10");
    expect(badge).toHaveClass("px-3");
    expect(screen.getByLabelText("Remove")).toBeInTheDocument();
    expect(screen.getByText("Complete")).toBeInTheDocument();
  });
});
