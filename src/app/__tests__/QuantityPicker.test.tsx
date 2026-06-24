import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { QuantityPicker } from "../components/QuantityPicker";

describe("QuantityPicker", () => {
  it("renders the current value", () => {
    render(<QuantityPicker value={2} onChange={() => {}} />);
    expect(screen.getByTestId("qty-value")).toHaveTextContent("2");
  });

  it("disables decrement at min and increments via +", () => {
    const onChange = vi.fn();
    render(<QuantityPicker value={1} onChange={onChange} min={1} max={5} />);
    expect(screen.getByLabelText("Decrease quantity")).toBeDisabled();
    fireEvent.click(screen.getByLabelText("Increase quantity"));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("caps the quantity at max", () => {
    const onChange = vi.fn();
    render(<QuantityPicker value={5} onChange={onChange} min={1} max={5} />);
    const inc = screen.getByLabelText("Increase quantity");
    expect(inc).toBeDisabled();
    // Clicking a disabled button must not invoke onChange.
    fireEvent.click(inc);
    expect(onChange).not.toHaveBeenCalled();
  });
});
