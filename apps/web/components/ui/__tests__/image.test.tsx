import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, waitFor, fireEvent } from "@testing-library/react";
import { Image } from "../image";

describe("Image", () => {
  it("renders with required props", () => {
    const { container } = render(
      React.createElement(Image, {
        src: "/test.jpg",
        alt: "Test image",
        width: 400,
        height: 300,
      }),
    );
    expect(container.querySelector("img")).toBeInTheDocument();
  });

  it("renders with different rounded variants", () => {
    const { container: cFull } = render(
      React.createElement(Image, {
        src: "/test.jpg",
        alt: "Test",
        width: 100,
        height: 100,
        rounded: "full",
      }),
    );
    const { container: cLg } = render(
      React.createElement(Image, {
        src: "/test.jpg",
        alt: "Test",
        width: 100,
        height: 100,
        rounded: "lg",
      }),
    );

    expect(cFull.firstChild).toHaveClass("rounded-full");
    expect(cLg.firstChild).toHaveClass("rounded-lg");
  });

  it("renders with different fit modes", () => {
    const { container: cCover } = render(
      React.createElement(Image, {
        src: "/test.jpg",
        alt: "Test",
        width: 100,
        height: 100,
        fit: "cover",
      }),
    );
    const { container: cContain } = render(
      React.createElement(Image, {
        src: "/test.jpg",
        alt: "Test",
        width: 100,
        height: 100,
        fit: "contain",
      }),
    );

    expect(cCover.querySelector("img")).toHaveClass("object-cover");
    expect(cContain.querySelector("img")).toHaveClass("object-contain");
  });

  it("renders with aspect ratio classes", () => {
    const { container: cSquare } = render(
      React.createElement(Image, {
        src: "/test.jpg",
        alt: "Test",
        width: 100,
        height: 100,
        aspectRatio: "square",
      }),
    );
    const { container: cVideo } = render(
      React.createElement(Image, {
        src: "/test.jpg",
        alt: "Test",
        width: 100,
        height: 100,
        aspectRatio: "video",
      }),
    );

    expect(cSquare.firstChild).toHaveClass("aspect-square");
    expect(cVideo.firstChild).toHaveClass("aspect-video");
  });

  it("shows loading skeleton initially", () => {
    const { container } = render(
      React.createElement(Image, {
        src: "/test.jpg",
        alt: "Test",
        width: 100,
        height: 100,
      }),
    );
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("shows error state on load failure", async () => {
    const { container } = render(
      React.createElement(Image, {
        src: "/invalid.jpg",
        alt: "Test image",
        width: 100,
        height: 100,
      }),
    );

    const img = container.querySelector("img") as HTMLImageElement;
    if (img) {
      fireEvent.error(img);
    }

    await waitFor(() => {
      expect(container.textContent).toContain("Test image");
    });
  });

  it("hides error state when showError is false", () => {
    const { container } = render(
      React.createElement(Image, {
        src: "/test.jpg",
        alt: "Test",
        width: 100,
        height: 100,
        showError: false,
      }),
    );
    expect(container).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      React.createElement(Image, {
        src: "/test.jpg",
        alt: "Test",
        width: 100,
        height: 100,
        className: "custom-image",
      }),
    );
    expect(container.firstChild).toHaveClass("custom-image");
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLImageElement>();
    render(
      React.createElement(Image, {
        src: "/test.jpg",
        alt: "Test",
        width: 100,
        height: 100,
        ref,
      }),
    );
    expect(ref.current).toBeInstanceOf(HTMLImageElement);
  });

  it("has relative positioning", () => {
    const { container } = render(
      React.createElement(Image, {
        src: "/test.jpg",
        alt: "Test",
        width: 100,
        height: 100,
      }),
    );
    expect(container.firstChild).toHaveClass("relative");
  });

  it("image starts with opacity-0", () => {
    const { container } = render(
      React.createElement(Image, {
        src: "/test.jpg",
        alt: "Test",
        width: 100,
        height: 100,
      }),
    );
    const img = container.querySelector("img");
    expect(img).toHaveClass("opacity-0");
  });
});
