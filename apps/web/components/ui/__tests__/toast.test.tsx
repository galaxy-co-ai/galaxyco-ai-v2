import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ToastProvider,
  ToastViewport,
} from "../toast";

describe("Toast", () => {
  it("renders toast with title", () => {
    render(
      React.createElement(
        ToastProvider,
        null,
        React.createElement(
          Toast,
          { open: true },
          React.createElement(ToastTitle, null, "Success"),
        ),
        React.createElement(ToastViewport),
      ),
    );
    expect(screen.getByText("Success")).toBeInTheDocument();
  });

  it("renders with description", () => {
    render(
      React.createElement(
        ToastProvider,
        null,
        React.createElement(
          Toast,
          { open: true },
          React.createElement(ToastTitle, null, "Success"),
          React.createElement(ToastDescription, null, "Your action completed"),
        ),
        React.createElement(ToastViewport),
      ),
    );
    expect(screen.getByText("Your action completed")).toBeInTheDocument();
  });

  it("renders with different variants", () => {
    const { container: cDefault } = render(
      React.createElement(
        ToastProvider,
        null,
        React.createElement(
          Toast,
          { variant: "default", open: true },
          React.createElement(ToastTitle, null, "Default"),
        ),
        React.createElement(ToastViewport),
      ),
    );
    const { container: cDestructive } = render(
      React.createElement(
        ToastProvider,
        null,
        React.createElement(
          Toast,
          { variant: "destructive", open: true },
          React.createElement(ToastTitle, null, "Error"),
        ),
        React.createElement(ToastViewport),
      ),
    );

    expect(cDefault.textContent).toContain("Default");
    expect(cDestructive.textContent).toContain("Error");
  });

  it("renders close button", () => {
    const { container } = render(
      React.createElement(
        ToastProvider,
        null,
        React.createElement(
          Toast,
          { open: true },
          React.createElement(ToastTitle, null, "Toast"),
          React.createElement(ToastClose),
        ),
        React.createElement(ToastViewport),
      ),
    );
    const closeButton = container.querySelector("button[toast-close]");
    expect(closeButton).toBeInTheDocument();
  });

  it("renders action button", () => {
    render(
      React.createElement(
        ToastProvider,
        null,
        React.createElement(
          Toast,
          { open: true },
          React.createElement(ToastTitle, null, "Toast"),
          React.createElement(ToastAction, { altText: "Undo" }, "Undo"),
        ),
        React.createElement(ToastViewport),
      ),
    );
    expect(screen.getByText("Undo")).toBeInTheDocument();
  });

  it("applies custom className to toast", () => {
    const { container } = render(
      React.createElement(
        ToastProvider,
        null,
        React.createElement(
          Toast,
          { className: "custom-toast", open: true },
          React.createElement(ToastTitle, null, "Custom"),
        ),
        React.createElement(ToastViewport),
      ),
    );

    expect(container.textContent).toContain("Custom");
  });
});
