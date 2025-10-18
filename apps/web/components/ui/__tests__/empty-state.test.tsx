import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmptyState } from "../empty-state";

describe("EmptyState", () => {
  it("renders with title and description", () => {
    render(
      React.createElement(EmptyState, {
        title: "No items found",
        description: "Create your first item to get started",
      }),
    );
    expect(screen.getByText("No items found")).toBeInTheDocument();
    expect(
      screen.getByText("Create your first item to get started"),
    ).toBeInTheDocument();
  });

  it("renders with emoji icon", () => {
    render(
      React.createElement(EmptyState, {
        icon: "📦",
        iconType: "emoji",
        title: "Empty",
        description: "No data",
      }),
    );
    expect(screen.getByText("📦")).toBeInTheDocument();
  });

  it("renders with custom component icon", () => {
    const CustomIcon = React.createElement(
      "div",
      {
        className: "test-icon",
      },
      "Icon",
    );
    render(
      React.createElement(EmptyState, {
        icon: CustomIcon,
        iconType: "component",
        title: "Empty",
        description: "No data",
      }),
    );
    expect(screen.getByText("Icon")).toBeInTheDocument();
  });

  it("renders with help text", () => {
    render(
      React.createElement(EmptyState, {
        title: "No items",
        description: "Get started",
        helpText: "Tip: Start by importing data",
      }),
    );
    expect(
      screen.getByText("Tip: Start by importing data"),
    ).toBeInTheDocument();
  });

  it("renders with steps", () => {
    render(
      React.createElement(EmptyState, {
        title: "No items",
        description: "Follow these steps",
        steps: ["Step 1: Click create", "Step 2: Fill form", "Step 3: Save"],
      }),
    );
    expect(screen.getByText("Step 1: Click create")).toBeInTheDocument();
    expect(screen.getByText("Step 2: Fill form")).toBeInTheDocument();
    expect(screen.getByText("Step 3: Save")).toBeInTheDocument();
  });

  it("renders primary action button", () => {
    const onClick = vi.fn();
    render(
      React.createElement(EmptyState, {
        title: "No items",
        description: "Create one",
        action: { label: "Create Item", onClick },
      }),
    );
    expect(screen.getByText("Create Item")).toBeInTheDocument();
  });

  it("calls action onClick when button clicked", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      React.createElement(EmptyState, {
        title: "No items",
        description: "Create one",
        action: { label: "Create", onClick },
      }),
    );
    await user.click(screen.getByText("Create"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders secondary action button", () => {
    render(
      React.createElement(EmptyState, {
        title: "No items",
        description: "Get started",
        action: { label: "Create", onClick: vi.fn() },
        secondaryAction: { label: "Import", onClick: vi.fn() },
      }),
    );
    expect(screen.getByText("Create")).toBeInTheDocument();
    expect(screen.getByText("Import")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      React.createElement(EmptyState, {
        title: "Empty",
        description: "Nothing here",
        className: "custom-empty",
      }),
    );
    expect(container.firstChild).toHaveClass("custom-empty");
  });

  it("renders without icon", () => {
    render(
      React.createElement(EmptyState, {
        title: "Empty",
        description: "No data",
      }),
    );
    expect(screen.getByText("Empty")).toBeInTheDocument();
  });

  it("has dashed border", () => {
    const { container } = render(
      React.createElement(EmptyState, {
        title: "Empty",
        description: "No data",
      }),
    );
    expect(container.firstChild).toHaveClass("border-dashed");
  });

  it("renders steps with numbered badges", () => {
    const { container } = render(
      React.createElement(EmptyState, {
        title: "Setup",
        description: "Follow steps",
        steps: ["First step", "Second step"],
      }),
    );
    expect(container.textContent).toContain("1");
    expect(container.textContent).toContain("2");
  });

  it("action button has default variant", () => {
    render(
      React.createElement(EmptyState, {
        title: "Empty",
        description: "Create item",
        action: { label: "Create", onClick: vi.fn() },
      }),
    );
    const button = screen.getByRole("button", { name: "Create" });
    expect(button).toBeInTheDocument();
  });

  it("action button can have custom variant", () => {
    render(
      React.createElement(EmptyState, {
        title: "Empty",
        description: "Create",
        action: { label: "Delete", onClick: vi.fn(), variant: "destructive" },
      }),
    );
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });
});
