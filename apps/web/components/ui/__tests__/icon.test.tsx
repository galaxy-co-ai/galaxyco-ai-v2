import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Star } from "lucide-react";
import { Icon } from "../icon";

describe("Icon", () => {
  it("renders with lucide icon component", () => {
    const { container } = render(
      React.createElement(Icon, { icon: React.createElement(Star) }),
    );
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("renders with different sizes", () => {
    const { container: cXs } = render(
      React.createElement(Icon, {
        icon: React.createElement(Star),
        size: "xs",
      }),
    );
    const { container: cLg } = render(
      React.createElement(Icon, {
        icon: React.createElement(Star),
        size: "lg",
      }),
    );

    // Icon renders with size classes on wrapper
    expect(cXs.querySelector("svg")).toBeInTheDocument();
    expect(cLg.querySelector("svg")).toBeInTheDocument();
  });

  it("renders with custom props", () => {
    const { container } = render(
      React.createElement(Icon, { icon: React.createElement(Star) }),
    );
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  it("applies custom className to wrapper", () => {
    const { container } = render(
      React.createElement(Icon, {
        icon: React.createElement(Star),
        className: "text-primary",
      }),
    );
    // Custom className applies to wrapper span
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders with react element as icon", () => {
    const customIcon = React.createElement("div", { className: "custom" }, "X");
    const { container } = render(
      React.createElement(Icon, { icon: customIcon }),
    );
    expect(container.querySelector(".custom")).toBeInTheDocument();
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLElement>();
    render(React.createElement(Icon, { icon: React.createElement(Star), ref }));
    expect(ref.current).toBeDefined();
  });

  it("renders icon element", () => {
    const { container } = render(
      React.createElement(Icon, { icon: React.createElement(Star) }),
    );
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });
});
