import { render, screen } from "__support__/ui";

import { Sparkline } from "./Sparkline";

describe("Sparkline", () => {
  it("renders a responsive line and endpoint for a metric history", () => {
    render(
      <Sparkline
        color="#509EE3"
        height={40}
        showArea={false}
        values={[5, 8, 6, 10]}
      />,
    );

    expect(screen.getByTestId("kpi-sparkline")).toBeInTheDocument();
    expect(screen.getByTestId("kpi-sparkline-line")).toBeInTheDocument();
    expect(screen.getByTestId("kpi-sparkline-endpoint")).toHaveStyle({
      backgroundColor: "#509EE3",
    });
  });

  it("optionally renders an area fill", () => {
    render(
      <Sparkline color="#EB891F" height={40} showArea values={[5, 8, 6, 10]} />,
    );

    expect(screen.getByTestId("kpi-sparkline-area")).toBeInTheDocument();
  });

  it("does not render with fewer than two numeric values", () => {
    const { container } = render(
      <Sparkline color="#509EE3" height={40} showArea={false} values={[5]} />,
    );

    expect(container).toBeEmptyDOMElement();
  });
});
