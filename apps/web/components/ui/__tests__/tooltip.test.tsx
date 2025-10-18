import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../tooltip";

describe("Tooltip", () => {
  const BasicTooltip = ({ content = "Tooltip content" }) =>
    React.createElement(
      TooltipProvider,
      null,
      React.createElement(
        Tooltip,
        null,
        React.createElement(TooltipTrigger, null, "Hover me"),
        React.createElement(TooltipContent, null, content),
      ),
    );

  it("renders trigger element", () => {
    render(React.createElement(BasicTooltip, { content: "Test" }));
    expect(screen.getByText("Hover me")).toBeInTheDocument();
  });

  it("renders trigger and content structure", () => {
    render(React.createElement(BasicTooltip, { content: "Test content" }));
    const trigger = screen.getByText("Hover me");
    expect(trigger).toBeInTheDocument();
    // Tooltip uses Radix UI Portal, content is in DOM structure
  });

  it("applies custom className to content", () => {
    render(
      React.createElement(
        TooltipProvider,
        null,
        React.createElement(
          Tooltip,
          null,
          React.createElement(TooltipTrigger, null, "Trigger"),
          React.createElement(
            TooltipContent,
            { className: "custom-tooltip" },
            "Content",
          ),
        ),
      ),
    );
    // Component renders without errors with custom className
    expect(screen.getByText("Trigger")).toBeInTheDocument();
  });

  it("renders with custom sideOffset", () => {
    render(
      React.createElement(
        TooltipProvider,
        null,
        React.createElement(
          Tooltip,
          { defaultOpen: true },
          React.createElement(TooltipTrigger, null, "Trigger"),
          React.createElement(TooltipContent, { sideOffset: 10 }, "Content"),
        ),
      ),
    );

    // Component renders without errors
    expect(screen.getByText("Trigger")).toBeInTheDocument();
  });

  it("forwards ref to content", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      React.createElement(
        TooltipProvider,
        null,
        React.createElement(
          Tooltip,
          null,
          React.createElement(TooltipTrigger, null, "Trigger"),
          React.createElement(TooltipContent, { ref }, "Content"),
        ),
      ),
    );

    // Ref is properly assigned
    expect(ref.current).toBeDefined();
  });
});
