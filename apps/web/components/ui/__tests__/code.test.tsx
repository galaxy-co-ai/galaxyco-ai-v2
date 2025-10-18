import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Code } from "../code";

describe("Code", () => {
  it("renders inline code by default", () => {
    const { container } = render(
      React.createElement(Code, null, "npm install"),
    );
    const code = container.querySelector("code");
    expect(code).toBeInTheDocument();
    expect(code?.textContent).toBe("npm install");
  });

  it("renders block code with pre tag", () => {
    const { container } = render(
      React.createElement(Code, { variant: "block" }, "const x = 1;"),
    );
    const pre = container.querySelector("pre");
    const code = pre?.querySelector("code");
    expect(pre).toBeInTheDocument();
    expect(code).toBeInTheDocument();
    expect(code?.textContent).toBe("const x = 1;");
  });

  it("applies language attribute for block code", () => {
    const { container } = render(
      React.createElement(
        Code,
        { variant: "block", language: "typescript" },
        "const x = 1;",
      ),
    );
    const code = container.querySelector("code");
    expect(code).toHaveAttribute("data-language", "typescript");
  });

  it("applies custom className to inline code", () => {
    const { container } = render(
      React.createElement(
        Code,
        { variant: "inline", className: "custom-code" },
        "test",
      ),
    );
    const code = container.querySelector("code");
    expect(code).toHaveClass("custom-code");
  });

  it("applies custom className to block code", () => {
    const { container } = render(
      React.createElement(
        Code,
        { variant: "block", className: "custom-block" },
        "test",
      ),
    );
    const pre = container.querySelector("pre");
    expect(pre).toHaveClass("custom-block");
  });

  it("has monospace font", () => {
    const { container } = render(React.createElement(Code, null, "test"));
    const code = container.querySelector("code");
    expect(code).toHaveClass("font-mono");
  });

  it("inline variant has border", () => {
    const { container } = render(
      React.createElement(Code, { variant: "inline" }, "test"),
    );
    const code = container.querySelector("code");
    expect(code).toHaveClass("border");
  });

  it("block variant has overflow-x-auto", () => {
    const { container } = render(
      React.createElement(Code, { variant: "block" }, "test"),
    );
    const pre = container.querySelector("pre");
    expect(pre).toHaveClass("overflow-x-auto");
  });

  it("forwards ref correctly for inline", () => {
    const ref = React.createRef<HTMLElement>();
    render(React.createElement(Code, { variant: "inline", ref }, "test"));
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });

  it("forwards ref correctly for block", () => {
    const ref = React.createRef<HTMLElement>();
    render(React.createElement(Code, { variant: "block", ref }, "test"));
    expect(ref.current).toBeInstanceOf(HTMLPreElement);
  });
});
