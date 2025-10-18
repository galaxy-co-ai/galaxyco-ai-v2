import React from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  DashboardStatsSkeleton,
  AgentCardSkeleton,
  AgentGridSkeleton,
  KnowledgeItemSkeleton,
  KnowledgeGridSkeleton,
  MarketplaceAgentSkeleton,
  MarketplaceGridSkeleton,
  TableRowSkeleton,
  PageLoadingSkeleton,
  FormSkeleton,
} from "../loading-skeletons";

describe("LoadingSkeletons", () => {
  it("renders DashboardStatsSkeleton with 4 cards", () => {
    const { container } = render(React.createElement(DashboardStatsSkeleton));
    const cards = container.querySelectorAll(".rounded-lg.border");
    expect(cards.length).toBe(4);
  });

  it("renders AgentCardSkeleton", () => {
    const { container } = render(React.createElement(AgentCardSkeleton));
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders AgentGridSkeleton with default count", () => {
    const { container } = render(React.createElement(AgentGridSkeleton));
    expect(container.querySelector('[class*="grid"]')).toBeInTheDocument();
  });

  it("renders AgentGridSkeleton with custom count", () => {
    const { container } = render(
      React.createElement(AgentGridSkeleton, { count: 3 }),
    );
    expect(container.querySelector('[class*="grid"]')).toBeInTheDocument();
  });

  it("renders KnowledgeItemSkeleton", () => {
    const { container } = render(React.createElement(KnowledgeItemSkeleton));
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders KnowledgeGridSkeleton with default count", () => {
    const { container } = render(React.createElement(KnowledgeGridSkeleton));
    expect(container.querySelector('[class*="grid"]')).toBeInTheDocument();
  });

  it("renders KnowledgeGridSkeleton with custom count", () => {
    const { container } = render(
      React.createElement(KnowledgeGridSkeleton, { count: 12 }),
    );
    expect(container.querySelector('[class*="grid"]')).toBeInTheDocument();
  });

  it("renders MarketplaceAgentSkeleton", () => {
    const { container } = render(React.createElement(MarketplaceAgentSkeleton));
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders MarketplaceGridSkeleton with default count", () => {
    const { container } = render(React.createElement(MarketplaceGridSkeleton));
    expect(container.querySelector('[class*="grid"]')).toBeInTheDocument();
  });

  it("renders MarketplaceGridSkeleton with custom count", () => {
    const { container } = render(
      React.createElement(MarketplaceGridSkeleton, { count: 6 }),
    );
    expect(container.querySelector('[class*="grid"]')).toBeInTheDocument();
  });

  it("renders TableRowSkeleton with default columns", () => {
    const { container } = render(React.createElement(TableRowSkeleton));
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders TableRowSkeleton with custom columns", () => {
    const { container } = render(
      React.createElement(TableRowSkeleton, { columns: 6 }),
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders PageLoadingSkeleton", () => {
    const { container } = render(React.createElement(PageLoadingSkeleton));
    expect(
      container.querySelector('[class*="min-h-screen"]'),
    ).toBeInTheDocument();
  });

  it("renders FormSkeleton with multiple fields", () => {
    const { container } = render(React.createElement(FormSkeleton));
    expect(container.firstChild).toBeInTheDocument();
  });

  it("DashboardStatsSkeleton has grid layout", () => {
    const { container } = render(React.createElement(DashboardStatsSkeleton));
    expect(container.querySelector('[class*="grid"]')).toBeInTheDocument();
  });

  it("AgentGridSkeleton has responsive grid", () => {
    const { container } = render(React.createElement(AgentGridSkeleton));
    const grid = container.firstChild;
    expect(grid).toHaveClass("grid");
  });
});
