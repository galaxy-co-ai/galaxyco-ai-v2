import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Textarea } from "../textarea";

describe("Textarea", () => {
  it("renders with placeholder", () => {
    render(React.createElement(Textarea, { placeholder: "Enter description" }));
    expect(
      screen.getByPlaceholderText("Enter description"),
    ).toBeInTheDocument();
  });

  it("renders with default size", () => {
    const { container } = render(React.createElement(Textarea));
    const textarea = container.querySelector("textarea");
    expect(textarea).toHaveClass("min-h-[80px]");
  });

  it("renders with different sizes", () => {
    const { container: containerSm } = render(
      React.createElement(Textarea, { size: "sm" }),
    );
    const { container: containerLg } = render(
      React.createElement(Textarea, { size: "lg" }),
    );

    expect(containerSm.querySelector("textarea")).toHaveClass("min-h-[60px]");
    expect(containerLg.querySelector("textarea")).toHaveClass("min-h-[120px]");
  });

  it("renders with destructive variant", () => {
    const { container } = render(
      React.createElement(Textarea, { variant: "destructive" }),
    );
    const textarea = container.querySelector("textarea");
    expect(textarea).toHaveClass("border-destructive");
  });

  it("applies destructive variant when error prop is provided", () => {
    const { container } = render(
      React.createElement(Textarea, { error: "This field is required" }),
    );
    const textarea = container.querySelector("textarea");
    expect(textarea).toHaveClass("border-destructive");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
  });

  it("displays error message", () => {
    render(
      React.createElement(Textarea, {
        id: "test",
        error: "This field is required",
      }),
    );
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("displays helper text", () => {
    render(
      React.createElement(Textarea, {
        id: "test",
        helperText: "Enter at least 10 characters",
      }),
    );
    expect(
      screen.getByText("Enter at least 10 characters"),
    ).toBeInTheDocument();
  });

  it("handles user input", async () => {
    const user = userEvent.setup();
    render(React.createElement(Textarea, { placeholder: "Type here" }));

    const textarea = screen.getByPlaceholderText(
      "Type here",
    ) as HTMLTextAreaElement;
    await user.type(textarea, "Hello World");

    expect(textarea.value).toBe("Hello World");
  });

  it("shows character count when showCount is true", () => {
    const { container } = render(
      React.createElement(Textarea, {
        showCount: true,
        value: "Test",
        onChange: () => {},
      }),
    );
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("shows character count with maxLength", () => {
    const { container } = render(
      React.createElement(Textarea, {
        showCount: true,
        maxLength: 100,
        value: "Test",
        onChange: () => {},
      }),
    );
    expect(screen.getByText("4/100")).toBeInTheDocument();
  });

  it("can be disabled", () => {
    render(React.createElement(Textarea, { disabled: true }));
    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeDisabled();
  });

  it("can be read-only", () => {
    render(
      React.createElement(Textarea, { readOnly: true, value: "Read only" }),
    );
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    expect(textarea).toHaveAttribute("readonly");
    expect(textarea.value).toBe("Read only");
  });

  it("applies custom className", () => {
    const { container } = render(
      React.createElement(Textarea, { className: "custom-class" }),
    );
    const textarea = container.querySelector("textarea");
    expect(textarea).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(React.createElement(Textarea, { ref }));
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("sets aria-describedby when error is provided", () => {
    const { container } = render(
      React.createElement(Textarea, {
        id: "test-textarea",
        error: "Error message",
      }),
    );
    const textarea = container.querySelector("textarea");
    expect(textarea).toHaveAttribute("aria-describedby", "test-textarea-error");
  });

  it("sets aria-describedby when helperText is provided", () => {
    const { container } = render(
      React.createElement(Textarea, {
        id: "test-textarea",
        helperText: "Helper message",
      }),
    );
    const textarea = container.querySelector("textarea");
    expect(textarea).toHaveAttribute(
      "aria-describedby",
      "test-textarea-helper",
    );
  });

  it("updates character count on typing", async () => {
    const user = userEvent.setup();
    const TestComponent = () => {
      const [value, setValue] = React.useState("");
      return React.createElement(Textarea, {
        showCount: true,
        value,
        onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setValue(e.target.value),
        placeholder: "Type here",
      });
    };

    render(React.createElement(TestComponent));
    const textarea = screen.getByPlaceholderText("Type here");

    expect(screen.getByText("0")).toBeInTheDocument();

    await user.type(textarea, "Hello");
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("applies resize-none class when autoResize is true", () => {
    const { container } = render(
      React.createElement(Textarea, { autoResize: true }),
    );
    const textarea = container.querySelector("textarea");
    expect(textarea).toHaveClass("resize-none");
  });
});
