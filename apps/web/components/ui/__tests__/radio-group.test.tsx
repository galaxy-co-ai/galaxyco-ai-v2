import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RadioGroup, RadioGroupItem } from "../radio-group";

describe("RadioGroup", () => {
  const BasicRadioGroup = () =>
    React.createElement(
      RadioGroup,
      { defaultValue: "option1" },
      React.createElement(RadioGroupItem, { value: "option1", id: "opt1" }),
      React.createElement(RadioGroupItem, { value: "option2", id: "opt2" }),
      React.createElement(RadioGroupItem, { value: "option3", id: "opt3" }),
    );

  it("renders radio group with items", () => {
    const { container } = render(React.createElement(BasicRadioGroup));
    const items = container.querySelectorAll("button[role='radio']");
    expect(items).toHaveLength(3);
  });

  it("selects default value", () => {
    const { container } = render(React.createElement(BasicRadioGroup));
    const firstItem = container.querySelector(
      "button[value='option1']",
    ) as HTMLElement;
    expect(firstItem).toHaveAttribute("data-state", "checked");
  });

  it("handles value change", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    const { container } = render(
      React.createElement(
        RadioGroup,
        { onValueChange },
        React.createElement(RadioGroupItem, { value: "option1" }),
        React.createElement(RadioGroupItem, { value: "option2" }),
      ),
    );

    const secondItem = container.querySelector(
      "button[value='option2']",
    ) as HTMLElement;
    await user.click(secondItem);
    expect(onValueChange).toHaveBeenCalledWith("option2");
  });

  it("can be disabled", () => {
    const { container } = render(
      React.createElement(
        RadioGroup,
        { disabled: true },
        React.createElement(RadioGroupItem, { value: "option1" }),
      ),
    );
    const item = container.querySelector("button") as HTMLElement;
    expect(item).toBeDisabled();
  });

  it("individual items can be disabled", () => {
    const { container } = render(
      React.createElement(
        RadioGroup,
        null,
        React.createElement(RadioGroupItem, { value: "option1" }),
        React.createElement(RadioGroupItem, {
          value: "option2",
          disabled: true,
        }),
      ),
    );
    const items = container.querySelectorAll("button");
    expect(items[0]).not.toBeDisabled();
    expect(items[1]).toBeDisabled();
  });

  it("applies custom className to group", () => {
    const { container } = render(
      React.createElement(
        RadioGroup,
        { className: "custom-group" },
        React.createElement(RadioGroupItem, { value: "option1" }),
      ),
    );
    const group = container.firstChild as HTMLElement;
    expect(group).toHaveClass("custom-group");
  });

  it("applies custom className to item", () => {
    const { container } = render(
      React.createElement(
        RadioGroup,
        null,
        React.createElement(RadioGroupItem, {
          value: "option1",
          className: "custom-item",
        }),
      ),
    );
    const item = container.querySelector("button");
    expect(item).toHaveClass("custom-item");
  });

  it("renders indicator when checked", () => {
    const { container } = render(
      React.createElement(
        RadioGroup,
        { defaultValue: "option1" },
        React.createElement(RadioGroupItem, { value: "option1" }),
      ),
    );
    const indicator = container.querySelector("svg");
    expect(indicator).toBeInTheDocument();
  });

  it("forwards ref to group", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      React.createElement(
        RadioGroup,
        { ref },
        React.createElement(RadioGroupItem, { value: "option1" }),
      ),
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("forwards ref to item", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      React.createElement(
        RadioGroup,
        null,
        React.createElement(RadioGroupItem, { value: "option1", ref }),
      ),
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
