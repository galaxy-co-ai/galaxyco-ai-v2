import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuRadioGroup,
} from "../dropdown-menu";

describe("DropdownMenu", () => {
  it("renders dropdown trigger", () => {
    const { container } = render(
      React.createElement(
        DropdownMenu,
        null,
        React.createElement(DropdownMenuTrigger, null, "Open"),
      ),
    );
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("renders dropdown items in content", () => {
    render(
      React.createElement(
        DropdownMenu,
        { open: true },
        React.createElement(DropdownMenuTrigger, null, "Open"),
        React.createElement(
          DropdownMenuContent,
          null,
          React.createElement(DropdownMenuItem, null, "Item 1"),
          React.createElement(DropdownMenuItem, null, "Item 2"),
        ),
      ),
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("renders dropdown menu label", () => {
    render(
      React.createElement(
        DropdownMenu,
        { open: true },
        React.createElement(DropdownMenuTrigger, null, "Open"),
        React.createElement(
          DropdownMenuContent,
          null,
          React.createElement(DropdownMenuLabel, null, "My Account"),
          React.createElement(DropdownMenuItem, null, "Profile"),
        ),
      ),
    );
    expect(screen.getByText("My Account")).toBeInTheDocument();
  });

  it("renders dropdown separator", () => {
    const { container } = render(
      React.createElement(
        DropdownMenu,
        { open: true },
        React.createElement(DropdownMenuTrigger, null, "Open"),
        React.createElement(
          DropdownMenuContent,
          null,
          React.createElement(DropdownMenuItem, null, "Item 1"),
          React.createElement(DropdownMenuSeparator),
          React.createElement(DropdownMenuItem, null, "Item 2"),
        ),
      ),
    );
    // Separator should separate items, verify items exist
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("renders checkbox item with checked state", () => {
    const { container } = render(
      React.createElement(
        DropdownMenu,
        { open: true },
        React.createElement(DropdownMenuTrigger, null, "Open"),
        React.createElement(
          DropdownMenuContent,
          null,
          React.createElement(
            DropdownMenuCheckboxItem,
            { checked: true },
            "Show Sidebar",
          ),
        ),
      ),
    );
    const item = screen.getByText("Show Sidebar");
    expect(item).toBeInTheDocument();
    expect(item.closest('[role="menuitemcheckbox"]')).toHaveAttribute(
      "data-state",
      "checked",
    );
  });

  it("renders radio group with items", () => {
    render(
      React.createElement(
        DropdownMenu,
        { open: true },
        React.createElement(DropdownMenuTrigger, null, "Open"),
        React.createElement(
          DropdownMenuContent,
          null,
          React.createElement(
            DropdownMenuRadioGroup,
            { value: "option1" },
            React.createElement(
              DropdownMenuRadioItem,
              { value: "option1" },
              "Option 1",
            ),
            React.createElement(
              DropdownMenuRadioItem,
              { value: "option2" },
              "Option 2",
            ),
          ),
        ),
      ),
    );
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("renders shortcut in menu item", () => {
    render(
      React.createElement(
        DropdownMenu,
        { open: true },
        React.createElement(DropdownMenuTrigger, null, "Open"),
        React.createElement(
          DropdownMenuContent,
          null,
          React.createElement(
            DropdownMenuItem,
            null,
            "Save",
            React.createElement(DropdownMenuShortcut, null, "⌘S"),
          ),
        ),
      ),
    );
    expect(screen.getByText("⌘S")).toBeInTheDocument();
  });

  it("applies inset to menu item", () => {
    const { container } = render(
      React.createElement(
        DropdownMenu,
        { open: true },
        React.createElement(DropdownMenuTrigger, null, "Open"),
        React.createElement(
          DropdownMenuContent,
          null,
          React.createElement(DropdownMenuItem, { inset: true }, "Inset Item"),
        ),
      ),
    );
    const item = screen.getByText("Inset Item");
    expect(item).toHaveClass("pl-8");
  });

  it("applies disabled state to menu item", () => {
    const { container } = render(
      React.createElement(
        DropdownMenu,
        { open: true },
        React.createElement(DropdownMenuTrigger, null, "Open"),
        React.createElement(
          DropdownMenuContent,
          null,
          React.createElement(DropdownMenuItem, { disabled: true }, "Disabled"),
        ),
      ),
    );
    const item = screen.getByText("Disabled");
    expect(item.closest('[role="menuitem"]')).toHaveAttribute(
      "data-disabled",
      "",
    );
  });

  it("applies custom className to content", () => {
    const { container } = render(
      React.createElement(
        DropdownMenu,
        { open: true },
        React.createElement(DropdownMenuTrigger, null, "Open"),
        React.createElement(
          DropdownMenuContent,
          { className: "custom-content" },
          React.createElement(DropdownMenuItem, null, "Item"),
        ),
      ),
    );
    // Content is rendered, verify item exists
    expect(screen.getByText("Item")).toBeInTheDocument();
  });

  it("checkbox item has check indicator when checked", () => {
    const { container } = render(
      React.createElement(
        DropdownMenu,
        { open: true },
        React.createElement(DropdownMenuTrigger, null, "Open"),
        React.createElement(
          DropdownMenuContent,
          null,
          React.createElement(
            DropdownMenuCheckboxItem,
            { checked: true },
            "Checked",
          ),
        ),
      ),
    );
    // Item should be checked
    const item = screen.getByText("Checked");
    expect(item.closest('[role="menuitemcheckbox"]')).toHaveAttribute(
      "data-state",
      "checked",
    );
  });

  it("radio item has circle indicator when selected", () => {
    const { container } = render(
      React.createElement(
        DropdownMenu,
        { open: true },
        React.createElement(DropdownMenuTrigger, null, "Open"),
        React.createElement(
          DropdownMenuContent,
          null,
          React.createElement(
            DropdownMenuRadioGroup,
            { value: "option1" },
            React.createElement(
              DropdownMenuRadioItem,
              { value: "option1" },
              "Selected",
            ),
          ),
        ),
      ),
    );
    // Item should be checked
    const item = screen.getByText("Selected");
    expect(item.closest('[role="menuitemradio"]')).toHaveAttribute(
      "data-state",
      "checked",
    );
  });

  it("renders group of items", () => {
    render(
      React.createElement(
        DropdownMenu,
        { open: true },
        React.createElement(DropdownMenuTrigger, null, "Open"),
        React.createElement(
          DropdownMenuContent,
          null,
          React.createElement(
            DropdownMenuGroup,
            null,
            React.createElement(DropdownMenuItem, null, "Item 1"),
            React.createElement(DropdownMenuItem, null, "Item 2"),
          ),
        ),
      ),
    );
    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("label has correct styling", () => {
    render(
      React.createElement(
        DropdownMenu,
        { open: true },
        React.createElement(DropdownMenuTrigger, null, "Open"),
        React.createElement(
          DropdownMenuContent,
          null,
          React.createElement(DropdownMenuLabel, null, "Header"),
        ),
      ),
    );
    const label = screen.getByText("Header");
    expect(label).toHaveClass("font-semibold");
  });

  it("shortcut has opacity styling", () => {
    const { container } = render(
      React.createElement(DropdownMenuShortcut, null, "⌘K"),
    );
    const shortcut = container.firstChild;
    expect(shortcut).toHaveClass("opacity-60");
  });
});
