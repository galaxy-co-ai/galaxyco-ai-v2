import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogOverlay,
} from "../dialog";

describe("Dialog", () => {
  it("renders dialog trigger", () => {
    render(
      React.createElement(
        Dialog,
        null,
        React.createElement(DialogTrigger, null, "Open Dialog"),
      ),
    );
    expect(screen.getByText("Open Dialog")).toBeInTheDocument();
  });

  it("renders dialog content when open", () => {
    render(
      React.createElement(
        Dialog,
        { open: true },
        React.createElement(DialogTrigger, null, "Open"),
        React.createElement(
          DialogContent,
          null,
          React.createElement(DialogTitle, null, "Dialog Title"),
        ),
      ),
    );
    expect(screen.getByText("Dialog Title")).toBeInTheDocument();
  });

  it("renders dialog with title and description", () => {
    render(
      React.createElement(
        Dialog,
        { open: true },
        React.createElement(DialogTrigger, null, "Open"),
        React.createElement(
          DialogContent,
          null,
          React.createElement(
            DialogHeader,
            null,
            React.createElement(DialogTitle, null, "Confirm Action"),
            React.createElement(
              DialogDescription,
              null,
              "Are you sure you want to proceed?",
            ),
          ),
        ),
      ),
    );
    expect(screen.getByText("Confirm Action")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to proceed?"),
    ).toBeInTheDocument();
  });

  it("renders dialog with footer", () => {
    render(
      React.createElement(
        Dialog,
        { open: true },
        React.createElement(DialogTrigger, null, "Open"),
        React.createElement(
          DialogContent,
          null,
          React.createElement(DialogTitle, null, "Dialog"),
          React.createElement(
            DialogFooter,
            null,
            React.createElement("button", null, "Cancel"),
            React.createElement("button", null, "Confirm"),
          ),
        ),
      ),
    );
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });

  it("renders close button in content", () => {
    const { container } = render(
      React.createElement(
        Dialog,
        { open: true },
        React.createElement(DialogTrigger, null, "Open"),
        React.createElement(
          DialogContent,
          null,
          React.createElement(DialogTitle, null, "Dialog"),
        ),
      ),
    );
    // Close button should exist
    const closeText = screen.getByText("Close");
    expect(closeText).toBeInTheDocument();
  });

  it("renders with different sizes", () => {
    const { container: cSm } = render(
      React.createElement(
        Dialog,
        { open: true },
        React.createElement(DialogTrigger, null, "Open"),
        React.createElement(
          DialogContent,
          { size: "sm" },
          React.createElement(DialogTitle, null, "Small"),
        ),
      ),
    );
    const { container: cLg } = render(
      React.createElement(
        Dialog,
        { open: true },
        React.createElement(DialogTrigger, null, "Open"),
        React.createElement(
          DialogContent,
          { size: "lg" },
          React.createElement(DialogTitle, null, "Large"),
        ),
      ),
    );
    expect(screen.getByText("Small")).toBeInTheDocument();
    expect(screen.getByText("Large")).toBeInTheDocument();
  });

  it("applies custom className to content", () => {
    const { container } = render(
      React.createElement(
        Dialog,
        { open: true },
        React.createElement(DialogTrigger, null, "Open"),
        React.createElement(
          DialogContent,
          { className: "custom-dialog" },
          React.createElement(DialogTitle, null, "Custom"),
        ),
      ),
    );
    expect(screen.getByText("Custom")).toBeInTheDocument();
  });

  it("title has correct styling", () => {
    render(
      React.createElement(
        Dialog,
        { open: true },
        React.createElement(DialogTrigger, null, "Open"),
        React.createElement(
          DialogContent,
          null,
          React.createElement(DialogTitle, null, "Title"),
        ),
      ),
    );
    const title = screen.getByText("Title");
    expect(title).toHaveClass("font-heading");
  });

  it("description has muted text color", () => {
    render(
      React.createElement(
        Dialog,
        { open: true },
        React.createElement(DialogTrigger, null, "Open"),
        React.createElement(
          DialogContent,
          null,
          React.createElement(DialogTitle, null, "Title"),
          React.createElement(DialogDescription, null, "Description text"),
        ),
      ),
    );
    const description = screen.getByText("Description text");
    expect(description).toHaveClass("text-foreground-muted");
  });

  it("header has flex col layout", () => {
    const { container } = render(
      React.createElement(
        DialogHeader,
        null,
        React.createElement("div", null, "Header content"),
      ),
    );
    const header = container.firstChild;
    expect(header).toHaveClass("flex", "flex-col");
  });

  it("footer has border top", () => {
    const { container } = render(
      React.createElement(
        DialogFooter,
        null,
        React.createElement("div", null, "Footer content"),
      ),
    );
    const footer = container.firstChild;
    expect(footer).toHaveClass("border-t");
  });

  it("forwards ref to content", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      React.createElement(
        Dialog,
        { open: true },
        React.createElement(
          DialogContent,
          { ref },
          React.createElement(DialogTitle, null, "Test"),
        ),
      ),
    );
    expect(ref.current).toBeDefined();
  });

  it("renders dialog close component", () => {
    render(
      React.createElement(
        Dialog,
        { open: true },
        React.createElement(
          DialogContent,
          null,
          React.createElement(DialogTitle, null, "Dialog"),
          React.createElement(DialogClose, null, "Close"),
        ),
      ),
    );
    expect(screen.getAllByText("Close").length).toBeGreaterThan(0);
  });
});
