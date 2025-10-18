import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "../card";

describe("Card", () => {
  it("renders with default variant", () => {
    const { container } = render(React.createElement(Card, null, "Content"));
    const card = container.querySelector("div");
    expect(card).toHaveClass("bg-background-elevated");
    expect(card).toHaveClass("shadow");
  });

  it("renders with interactive variant", () => {
    const { container } = render(
      React.createElement(Card, { interactive: true }),
    );
    const card = container.querySelector("div");
    expect(card).toHaveClass("hover:shadow-md");
    expect(card).toHaveClass("cursor-pointer");
  });

  it("renders with outline variant", () => {
    const { container } = render(
      React.createElement(Card, { variant: "outline" }),
    );
    const card = container.querySelector("div");
    expect(card).toHaveClass("bg-background");
  });

  it("renders with ghost variant", () => {
    const { container } = render(
      React.createElement(Card, { variant: "ghost" }),
    );
    const card = container.querySelector("div");
    expect(card).toHaveClass("bg-transparent");
    expect(card).toHaveClass("border-transparent");
  });

  it("renders with different padding sizes", () => {
    const { container: containerNone } = render(
      React.createElement(Card, { padding: "none" }),
    );
    const { container: containerSm } = render(
      React.createElement(Card, { padding: "sm" }),
    );
    const { container: containerLg } = render(
      React.createElement(Card, { padding: "lg" }),
    );

    expect(containerNone.querySelector("div")).toHaveClass("p-0");
    expect(containerSm.querySelector("div")).toHaveClass("p-4");
    expect(containerLg.querySelector("div")).toHaveClass("p-8");
  });

  it("applies custom className", () => {
    const { container } = render(
      React.createElement(Card, { className: "custom-class" }),
    );
    expect(container.querySelector("div")).toHaveClass("custom-class");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(React.createElement(Card, { ref }));
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("CardHeader", () => {
  it("renders children correctly", () => {
    render(React.createElement(CardHeader, null, "Header Content"));
    expect(screen.getByText("Header Content")).toBeInTheDocument();
  });

  it("applies default classes", () => {
    const { container } = render(React.createElement(CardHeader));
    const header = container.querySelector("div");
    expect(header).toHaveClass("flex");
    expect(header).toHaveClass("flex-col");
    expect(header).toHaveClass("space-y-1.5");
    expect(header).toHaveClass("p-6");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(React.createElement(CardHeader, { ref }));
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("CardTitle", () => {
  it("renders as h3 element", () => {
    render(React.createElement(CardTitle, null, "Card Title"));
    const title = screen.getByText("Card Title");
    expect(title.tagName).toBe("H3");
  });

  it("applies default classes", () => {
    render(React.createElement(CardTitle, null, "Title"));
    const title = screen.getByText("Title");
    expect(title).toHaveClass("text-lg");
    expect(title).toHaveClass("font-semibold");
    expect(title).toHaveClass("text-foreground");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLHeadingElement>();
    render(React.createElement(CardTitle, { ref }, "Title"));
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
  });
});

describe("CardDescription", () => {
  it("renders as p element", () => {
    render(React.createElement(CardDescription, null, "Card description text"));
    const description = screen.getByText("Card description text");
    expect(description.tagName).toBe("P");
  });

  it("applies default classes", () => {
    render(React.createElement(CardDescription, null, "Description"));
    const description = screen.getByText("Description");
    expect(description).toHaveClass("text-sm");
    expect(description).toHaveClass("text-foreground-muted");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLParagraphElement>();
    render(React.createElement(CardDescription, { ref }, "Description"));
    expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
  });
});

describe("CardContent", () => {
  it("renders children correctly", () => {
    render(React.createElement(CardContent, null, "Content text"));
    expect(screen.getByText("Content text")).toBeInTheDocument();
  });

  it("applies default classes", () => {
    const { container } = render(React.createElement(CardContent));
    const content = container.querySelector("div");
    expect(content).toHaveClass("p-6");
    expect(content).toHaveClass("pt-0");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(React.createElement(CardContent, { ref }));
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("CardFooter", () => {
  it("renders children correctly", () => {
    render(React.createElement(CardFooter, null, "Footer content"));
    expect(screen.getByText("Footer content")).toBeInTheDocument();
  });

  it("applies default classes", () => {
    const { container } = render(React.createElement(CardFooter));
    const footer = container.querySelector("div");
    expect(footer).toHaveClass("flex");
    expect(footer).toHaveClass("items-center");
    expect(footer).toHaveClass("p-6");
    expect(footer).toHaveClass("pt-0");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(React.createElement(CardFooter, { ref }));
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("Card composition", () => {
  it("renders full card with all components", () => {
    render(
      React.createElement(
        Card,
        null,
        React.createElement(
          CardHeader,
          null,
          React.createElement(CardTitle, null, "Test Title"),
          React.createElement(CardDescription, null, "Test Description"),
        ),
        React.createElement(CardContent, null, "Test Content"),
        React.createElement(CardFooter, null, "Test Footer"),
      ),
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
    expect(screen.getByText("Test Footer")).toBeInTheDocument();
  });
});
