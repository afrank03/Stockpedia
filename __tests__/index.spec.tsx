import "@testing-library/jest-dom";
import { fireEvent, render, screen, act } from "@testing-library/react";
import React from "react";
import Home from "../pages";

describe("Index page", () => {
  beforeEach(() => {
    render(<Home />);
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should set the initial value of the expression", () => {
    expect(screen.getByTestId("expression-input")).toHaveValue(`{
  "expression": {"fn": "*", "a": "sales", "b": 2},
  "security": "ABC"
}`);
  });

  it("should set the expression when an example button is clicked", () => {
    fireEvent.click(screen.getByTestId("button-divide"));

    expect(screen.getByTestId("expression-input")).toHaveValue(`{
  "expression": {"fn": "/", "a": "price", "b": "eps"},
  "security": "BCD"
}`);
  });

  // TODO: Complete this test suite once implementation is complete
  it('should evaluate the expression when the "run" button is clicked (positive)', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ value: 6, error: false }),
      }),
    ) as jest.Mock;

    await act( async () => {
      fireEvent.click(screen.getByTestId("run-button"));
    });
    
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('dsl-output')).toHaveValue('6');
    expect(screen.getByText('DSL query ran successfully!')).toBeEnabled();
  });

  it('should evaluate the expression when the "run" button is clicked (negative)', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ value: 0, error: true }),
      }),
    ) as jest.Mock;

    await act( async () => {
      fireEvent.click(screen.getByTestId("run-button"));
    });
    
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('dsl-output')).toHaveValue('0');
    expect(screen.getByText('There is a problem with your DSL query.')).toBeEnabled();
  });

  // WE con obvioulsy test more cases. And it would be easier to test more eficiently with better breakdown of the functionality which currently exitsts in index.tsx
});

