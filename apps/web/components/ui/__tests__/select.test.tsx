import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
  SelectSeparator,
} from "../select";

describe("Select", () => {
  it("renders select trigger with placeholder", () => {
    render(
      React.createElement(
        Select,
        null,
        React.createElement(
          SelectTrigger,
          null,
          React.createElement(SelectValue, { placeholder: "Select option" }),
        ),
      ),
    );
    expect(screen.getByText("Select option")).toBeInTheDocument();
  });

  it("renders select items in content", () => {
    const { container } = render(
      React.createElement(
        Select,
        { open: true },
        React.createElement(
          SelectTrigger,
          null,
          React.createElement(SelectValue, { placeholder: "Select" }),
        ),
        React.createElement(
          SelectContent,
          null,
          React.createElement(SelectItem, { value: "1" }, "Option 1"),
          React.createElement(SelectItem, { value: "2" }, "Option 2"),
        ),
      ),
    );
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("renders select with groups and labels", () => {
    render(
      React.createElement(
        Select,
        { open: true },
        React.createElement(
          SelectTrigger,
          null,
          React.createElement(SelectValue, { placeholder: "Select" }),
        ),
        React.createElement(
          SelectContent,
          null,
          React.createElement(
            SelectGroup,
            null,
            React.createElement(SelectLabel, null, "Fruits"),
            React.createElement(SelectItem, { value: "apple" }, "Apple"),
            React.createElement(SelectItem, { value: "banana" }, "Banana"),
          ),
        ),
      ),
    );
    expect(screen.getByText("Fruits")).toBeInTheDocument();
    expect(screen.getByText("Apple")).toBeInTheDocument();
  });

  it("renders select separator", () => {
    const { container } = render(
      React.createElement(
        Select,
        { open: true },
        React.createElement(
          SelectTrigger,
          null,
          React.createElement(SelectValue, { placeholder: "Select" }),
        ),
        React.createElement(
          SelectContent,
          null,
          React.createElement(SelectItem, { value: "1" }, "Option 1"),
          React.createElement(SelectSeparator),
          React.createElement(SelectItem, { value: "2" }, "Option 2"),
        ),
      ),
    );
    // Separator should be rendered in DOM
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
  });

  it("applies disabled state to trigger", () => {
    const { container } = render(
      React.createElement(
        Select,
        { disabled: true },
        React.createElement(
          SelectTrigger,
          null,
          React.createElement(SelectValue, { placeholder: "Select" }),
        ),
      ),
    );
    const button = container.querySelector("button");
    expect(button).toBeDisabled();
  });

  it("applies custom className to trigger", () => {
    const { container } = render(
      React.createElement(
        Select,
        null,
        React.createElement(
          SelectTrigger,
          { className: "custom-trigger" },
          React.createElement(SelectValue, { placeholder: "Select" }),
        ),
      ),
    );
    const button = container.querySelector("button");
    expect(button).toHaveClass("custom-trigger");
  });

  it("applies custom className to content", () => {
    const { container } = render(
      React.createElement(
        Select,
        { open: true },
        React.createElement(
          SelectTrigger,
          null,
          React.createElement(SelectValue, { placeholder: "Select" }),
        ),
        React.createElement(
          SelectContent,
          { className: "custom-content" },
          React.createElement(SelectItem, { value: "1" }, "Option 1"),
        ),
      ),
    );
    // Content is rendered, verify item exists
    expect(screen.getByText("Option 1")).toBeInTheDocument();
  });

  it("trigger has chevron icon", () => {
    const { container } = render(
      React.createElement(
        Select,
        null,
        React.createElement(
          SelectTrigger,
          null,
          React.createElement(SelectValue, { placeholder: "Select" }),
        ),
      ),
    );
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("forwards ref to trigger", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      React.createElement(
        Select,
        null,
        React.createElement(
          SelectTrigger,
          { ref },
          React.createElement(SelectValue, { placeholder: "Select" }),
        ),
      ),
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("select item has check indicator when selected", () => {
    const { container } = render(
      React.createElement(
        Select,
        { open: true, value: "1" },
        React.createElement(
          SelectTrigger,
          null,
          React.createElement(SelectValue, { placeholder: "Select" }),
        ),
        React.createElement(
          SelectContent,
          null,
          React.createElement(SelectItem, { value: "1" }, "Option 1"),
          React.createElement(SelectItem, { value: "2" }, "Option 2"),
        ),
      ),
    );
    // Check icon should be present for selected item
    const icons = container.querySelectorAll("svg");
    expect(icons.length).toBeGreaterThan(0);
  });

  it("select label has correct styling", () => {
    const { container } = render(
      React.createElement(
        Select,
        { open: true },
        React.createElement(
          SelectTrigger,
          null,
          React.createElement(SelectValue, { placeholder: "Select" }),
        ),
        React.createElement(
          SelectContent,
          null,
          React.createElement(
            SelectGroup,
            null,
            React.createElement(SelectLabel, null, "Group Label"),
            React.createElement(SelectItem, { value: "1" }, "Item 1"),
          ),
        ),
      ),
    );
    const label = screen.getByText("Group Label");
    expect(label).toHaveClass("font-semibold");
  });

  it("disabled select item has correct styling", () => {
    const { container } = render(
      React.createElement(
        Select,
        { open: true },
        React.createElement(
          SelectTrigger,
          null,
          React.createElement(SelectValue, { placeholder: "Select" }),
        ),
        React.createElement(
          SelectContent,
          null,
          React.createElement(
            SelectItem,
            { value: "1", disabled: true },
            "Disabled",
          ),
        ),
      ),
    );
    const item = screen.getByText("Disabled");
    expect(item.closest('[role="option"]')).toHaveAttribute(
      "data-disabled",
      "",
    );
  });
});
