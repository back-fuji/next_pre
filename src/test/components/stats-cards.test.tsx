import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatsCards } from "@/components/features/dashboard/stats-cards";

describe("StatsCards", () => {
  it("統計が正しく表示される", () => {
    render(
      <StatsCards
        total={10}
        done={5}
        inProgress={3}
        completionRate={50}
        projectCount={2}
      />
    );
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
  });
});
