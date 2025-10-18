import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Progress } from "../progress";

describe("Progress", () => {
  it("renders with 0% progress", () => {
    const { container } = render(React.createElement(Progress, { value: 0 }));
    const root = container.firstChild as HTMLElement;
    const indicator = root.firstChild as HTMLElement;
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveStyle({ transform: "translateX(-100%)" });
  });

  it("renders with 50% progress", () => {
    const { container } = render(React.createElement(Progress, { value: 50 }));
    const root = container.firstChild as HTMLElement;
    const indicator = root.firstChild as HTMLElement;
    expect(indicator).toHaveStyle({ transform: "translateX(-50%)" });
  });

  it("renders with 100% progress", () => {
    const { container } = render(React.createElement(Progress, { value: 100 }));
    const root = container.firstChild as HTMLElement;
    const indicator = root.firstChild as HTMLElement;
    expect(indicator).toHaveStyle({ transform: "translateX(-0%)" });
  });

  it("renders with default styling", () => {
    const { container } = render(React.createElement(Progress, { value: 50 }));
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("relative");
    expect(root).toHaveClass("h-2");
    expect(root).toHaveClass("w-full");
    expect(root).toHaveClass("rounded-full");
  });

  it("applies custom className", () => {
    const { container } = render(
      React.createElement(Progress, { value: 50, className: "h-4 w-1/2" }),
    );
    const root = container.firstChild as HTMLElement;
    expect(root).toHaveClass("h-4");
    expect(root).toHaveClass("w-1/2");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(React.createElement(Progress, { value: 50, ref }));
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("handles missing value prop", () => {
    const { container } = render(React.createElement(Progress));
    const root = container.firstChild as HTMLElement;
    const indicator = root.firstChild as HTMLElement;
    expect(indicator).toHaveStyle({ transform: "translateX(-100%)" });
  });

  it("renders with transition classes", () => {
    const { container } = render(React.createElement(Progress, { value: 50 }));
    const root = container.firstChild as HTMLElement;
    const indicator = root.firstChild as HTMLElement;
    expect(indicator).toHaveClass("transition-[transform,width]");
    expect(indicator).toHaveClass("duration-normal");
  });

  it("renders primary background color for indicator", () => {
    const { container } = render(React.createElement(Progress, { value: 50 }));
    const root = container.firstChild as HTMLElement;
    const indicator = root.firstChild as HTMLElement;
    expect(indicator).toHaveClass("bg-primary");
  });

  it("updates progress dynamically", () => {
    const ProgressTest = () => {
      const [value, setValue] = React.useState(0);

      React.useEffect(() => {
        setValue(75);
      }, []);

      return React.createElement(Progress, { value });
    };

    const { container } = render(React.createElement(ProgressTest));
    const root = container.firstChild as HTMLElement;
    const indicator = root.firstChild as HTMLElement;

    // After state update, should reflect new value
    expect(indicator).toHaveStyle({ transform: "translateX(-25%)" });
  });
});
