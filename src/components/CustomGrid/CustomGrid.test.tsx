import React from "react";
import { render } from "@testing-library/react";
import { CustomGrid } from "./CustomGrid";

describe("CustomGrid", () => {
  it("renders container correctly", () => {
    const { container } = render(
      <CustomGrid container>
        <div>Test content</div>
      </CustomGrid>
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toBeInTheDocument();
    expect(gridElement.style.display).toBe("flex");
  });

  it("renders item correctly", () => {
    const { container } = render(
      <CustomGrid item xs={6}>
        <div>Test content</div>
      </CustomGrid>
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toBeInTheDocument();
    expect(gridElement.style.flexBasis).toBe("50%");
  });

  it("applies responsive breakpoints", () => {
    const { container } = render(
      <CustomGrid item xs={12} md={6}>
        <div>Test content</div>
      </CustomGrid>
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toBeInTheDocument();
    expect(gridElement.style.flexBasis).toBe("100%");
  });
});
