import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormTextarea } from "../form-textarea";

describe("FormTextarea", () => {
  it("renders with label", () => {
    render(React.createElement(FormTextarea, { label: "Description" }));
    expect(screen.getByText("Description")).toBeInTheDocument();
  });

  it("renders without label", () => {
    const { container } = render(React.createElement(FormTextarea));
    expect(container.querySelector("label")).not.toBeInTheDocument();
  });

  it("displays error message", () => {
    render(React.createElement(FormTextarea, { error: "Required field" }));
    expect(screen.getByText("Required field")).toBeInTheDocument();
  });

  it("displays helper text", () => {
    render(React.createElement(FormTextarea, { helperText: "Enter details" }));
    expect(screen.getByText("Enter details")).toBeInTheDocument();
  });

  it("shows required indicator", () => {
    render(React.createElement(FormTextarea, { label: "Bio", required: true }));
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("applies error styling", () => {
    const { container } = render(
      React.createElement(FormTextarea, { error: "Error" }),
    );
    const textarea = container.querySelector("textarea");
    expect(textarea).toHaveClass("border-destructive");
  });

  it("error message has role alert", () => {
    render(React.createElement(FormTextarea, { error: "Error message" }));
    const error = screen.getByText("Error message");
    expect(error).toHaveAttribute("role", "alert");
  });

  it("textarea has aria-invalid when error exists", () => {
    const { container } = render(
      React.createElement(FormTextarea, { error: "Error" }),
    );
    const textarea = container.querySelector("textarea");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
  });

  it("textarea has aria-describedby for error", () => {
    const { container } = render(
      React.createElement(FormTextarea, {
        error: "Error",
        id: "test-textarea",
      }),
    );
    const textarea = container.querySelector("textarea");
    expect(textarea).toHaveAttribute("aria-describedby", "test-textarea-error");
  });

  it("textarea has aria-describedby for helper", () => {
    const { container } = render(
      React.createElement(FormTextarea, {
        helperText: "Help",
        id: "test-textarea",
      }),
    );
    const textarea = container.querySelector("textarea");
    expect(textarea).toHaveAttribute(
      "aria-describedby",
      "test-textarea-helper",
    );
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(React.createElement(FormTextarea, { ref }));
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("calls onChange when typing", async () => {
    const user = userEvent.setup();
    const { container } = render(React.createElement(FormTextarea));
    const textarea = container.querySelector("textarea") as HTMLTextAreaElement;
    await user.type(textarea, "test");
    expect(textarea.value).toBe("test");
  });

  it("helper text supports both helper and helperText props", () => {
    render(React.createElement(FormTextarea, { helper: "Old prop" }));
    expect(screen.getByText("Old prop")).toBeInTheDocument();
  });

  it("helperText takes precedence over helper", () => {
    render(
      React.createElement(FormTextarea, { helper: "Old", helperText: "New" }),
    );
    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.queryByText("Old")).not.toBeInTheDocument();
  });

  it("renders textarea element", () => {
    const { container } = render(React.createElement(FormTextarea));
    expect(container.querySelector("textarea")).toBeInTheDocument();
  });

  it("supports placeholder", () => {
    const { container } = render(
      React.createElement(FormTextarea, { placeholder: "Enter text" }),
    );
    const textarea = container.querySelector("textarea");
    expect(textarea).toHaveAttribute("placeholder", "Enter text");
  });
});
