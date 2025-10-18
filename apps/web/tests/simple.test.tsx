import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

describe("Simple React Test", () => {
  it("renders a basic element", () => {
    render(<div>Hello World</div>);
    expect(screen.getByText("Hello World")).toBeInTheDocument();
  });

  it("renders a button element", () => {
    render(<button>Click me</button>);
    expect(screen.getByRole("button")).toHaveTextContent("Click me");
  });
});
